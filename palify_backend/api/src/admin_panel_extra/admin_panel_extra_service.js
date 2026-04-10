const db = require("../config/db");

const PERIOD_MAP = {
  "7_days": 7,
  "30_days": 30,
  "90_days": 90,
  "6_months": 180,
  "1_year": 365,
};

const blockedStates = new Set(["blocked", "suspended", "rejected"]);

const getBusinessesService = async () => {
  const [rows] = await db.query(`
    SELECT
      b.id,
      b.name,
      b.phone AS email,
      b.phone,
      b.description,
      b.location,
      b.created_at AS registrationDate,
      c.name AS category,
      b.rating,
      b.reviews,
      COALESCE(abs.admin_status, 'pending') AS status,
      CASE
        WHEN COALESCE(abs.admin_status, 'pending') IN ('blocked', 'suspended', 'rejected') THEN 1
        ELSE 0
      END AS blocked
    FROM businesses b
    LEFT JOIN categories c ON c.id = b.category_id
    LEFT JOIN admin_business_states abs ON abs.business_id = b.id
    ORDER BY b.created_at DESC
  `);

  return rows;
};

const getBusinessDetailsService = async (businessId) => {
  const [[row]] = await db.query(`
    SELECT
      b.id,
      b.name,
      b.phone AS email,
      b.phone,
      b.description,
      b.location,
      b.bank_account,
      b.image,
      b.created_at AS registrationDate,
      c.name AS category,
      b.rating,
      b.reviews,
      COALESCE(abs.admin_status, 'pending') AS status,
      abs.notes,
      abs.reviewed_at
    FROM businesses b
    LEFT JOIN categories c ON c.id = b.category_id
    LEFT JOIN admin_business_states abs ON abs.business_id = b.id
    WHERE b.id = ?
  `, [businessId]);

  if (!row) {
    throw new Error("Business not found");
  }

  return row;
};

const setBusinessStatusService = async (businessId, status, notes = null) => {
  const normalizedStatus = String(status || "").toLowerCase();
  const allowedStatuses = ["pending", "approved", "rejected", "blocked", "suspended"];

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new Error("Invalid business status");
  }

  const activeValue = normalizedStatus === "approved" ? 1 : 0;

  await db.query("UPDATE businesses SET is_active = ? WHERE id = ?", [activeValue, businessId]);
  await db.query(
    `
      INSERT INTO admin_business_states (business_id, admin_status, notes, reviewed_at)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        admin_status = VALUES(admin_status),
        notes = VALUES(notes),
        reviewed_at = VALUES(reviewed_at),
        updated_at = CURRENT_TIMESTAMP
    `,
    [businessId, normalizedStatus, notes]
  );

  return getBusinessDetailsService(businessId);
};

const toggleBusinessBlockService = async (businessId) => {
  const details = await getBusinessDetailsService(businessId);
  const nextStatus = blockedStates.has(details.status) ? "approved" : "blocked";
  return setBusinessStatusService(businessId, nextStatus);
};

const getSubscriptionPlansService = async () => {
  const [rows] = await db.query(`
    SELECT id, name, price, duration_days, features
    FROM subscriptions
    ORDER BY price ASC, id ASC
  `);

  return rows;
};

const getBusinessSubscriptionsService = async () => {
  const [rows] = await db.query(`
    SELECT
      b.id,
      b.name,
      COALESCE(s.name, 'Free') AS currentPlan,
      abs.plan_id AS currentPlanId,
      COALESCE(abs.subscription_type, 'default') AS subscriptionType,
      COALESCE(abs.duration_months, 0) AS freeMonths,
      COALESCE(abs.is_lifetime, 0) AS lifetimeAccess,
      COALESCE(abs.status, 'inactive') AS status,
      abs.starts_at AS startsAt,
      abs.ends_at AS endsAt
    FROM businesses b
    LEFT JOIN admin_business_subscriptions abs ON abs.business_id = b.id
    LEFT JOIN subscriptions s ON s.id = abs.plan_id
    ORDER BY b.name ASC
  `);

  return rows;
};

const upsertBusinessSubscriptionService = async ({
  businessId,
  planId = null,
  subscriptionType,
  durationMonths = null,
  isLifetime = 0,
}) => {
  let endsAt = null;

  if (durationMonths && Number(durationMonths) > 0) {
    endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + Number(durationMonths));
  }

  await db.query(
    `
      INSERT INTO admin_business_subscriptions
        (business_id, plan_id, subscription_type, duration_months, is_lifetime, starts_at, ends_at, status)
      VALUES
        (?, ?, ?, ?, ?, NOW(), ?, 'active')
      ON DUPLICATE KEY UPDATE
        plan_id = VALUES(plan_id),
        subscription_type = VALUES(subscription_type),
        duration_months = VALUES(duration_months),
        is_lifetime = VALUES(is_lifetime),
        starts_at = VALUES(starts_at),
        ends_at = VALUES(ends_at),
        status = VALUES(status),
        updated_at = CURRENT_TIMESTAMP
    `,
    [businessId, planId, subscriptionType, durationMonths, isLifetime, endsAt]
  );

  const [[subscription]] = await db.query(`
    SELECT
      business_id AS businessId,
      plan_id AS planId,
      subscription_type AS subscriptionType,
      duration_months AS durationMonths,
      is_lifetime AS isLifetime,
      starts_at AS startsAt,
      ends_at AS endsAt,
      status
    FROM admin_business_subscriptions
    WHERE business_id = ?
  `, [businessId]);

  return subscription;
};

const grantFreeMonthsService = async (businessId, months) => {
  const freePlanId = 1;
  return upsertBusinessSubscriptionService({
    businessId,
    planId: freePlanId,
    subscriptionType: "free_months",
    durationMonths: months,
    isLifetime: 0,
  });
};

const grantLifetimeService = async (businessId) => {
  const [[existing]] = await db.query(
    "SELECT plan_id FROM admin_business_subscriptions WHERE business_id = ?",
    [businessId]
  );

  const planId = existing?.plan_id || 1;

  return upsertBusinessSubscriptionService({
    businessId,
    planId,
    subscriptionType: "lifetime",
    durationMonths: null,
    isLifetime: 1,
  });
};

const overrideSubscriptionService = async (businessId, planId) => {
  return upsertBusinessSubscriptionService({
    businessId,
    planId,
    subscriptionType: "override",
    durationMonths: null,
    isLifetime: 0,
  });
};

const getRevenueReportService = async (periodKey) => {
  const days = PERIOD_MAP[periodKey];

  if (!days) {
    throw new Error("Invalid report period");
  }

  const [rows] = await db.query(
    `
      SELECT
        b.id,
        b.total_amount,
        b.status,
        b.created_at,
        u.full_name AS customer_name,
        biz.name AS business_name
      FROM bookings b
      LEFT JOIN users u ON u.id = b.user_id
      LEFT JOIN businesses biz ON biz.id = b.business_id
      WHERE b.status = 'Completed'
        AND b.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY b.created_at DESC
    `,
    [days]
  );

  const totalRevenue = rows.reduce((sum, row) => sum + Number(row.total_amount || 0), 0);

  return {
    period: periodKey,
    bookingCount: rows.length,
    totalRevenue,
    rows,
  };
};

module.exports = {
  getBusinessesService,
  getBusinessDetailsService,
  setBusinessStatusService,
  toggleBusinessBlockService,
  getSubscriptionPlansService,
  getBusinessSubscriptionsService,
  grantFreeMonthsService,
  grantLifetimeService,
  overrideSubscriptionService,
  getRevenueReportService,
};
