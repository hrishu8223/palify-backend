const db = require("../config/db");

// Dashboard
const getDashboardService = async () => {
  const [[users]]         = await db.query("SELECT COUNT(*) as total FROM users");
  const [[providers]]     = await db.query("SELECT COUNT(*) as total FROM businesses");
  const [[bookings]]      = await db.query("SELECT COUNT(*) as total FROM bookings");
  const [[todayBookings]] = await db.query("SELECT COUNT(*) as total FROM bookings WHERE DATE(created_at) = CURDATE()");
  const [[revenue]]       = await db.query("SELECT SUM(total_amount) as total FROM bookings WHERE status = 'completed'");
  const [[todayRevenue]]  = await db.query("SELECT SUM(total_amount) as total FROM bookings WHERE status='completed' AND DATE(created_at)=CURDATE()");
  const [[avgRating]]     = await db.query("SELECT AVG(stars) as avg FROM ratings");

  return {
    totalUsers:     users.total,
    totalProviders: providers.total,
    totalBookings:  bookings.total,
    todayBookings:  todayBookings.total,
    totalRevenue:   revenue.total || 0,
    todayRevenue:   todayRevenue.total || 0,
    avgRating:      Number(avgRating.avg || 0).toFixed(1),
  };
};

// Users
const getUsersService = async () => {
  const [users] = await db.query(`
    SELECT 
      u.id, u.full_name, u.email_address, u.created_at,
      COUNT(b.id) as total_bookings,
      COALESCE(s.name, 'Free') as plan,
      CASE WHEN u.is_active = 1 THEN 'Active' ELSE 'Inactive' END as status
    FROM users u
    LEFT JOIN bookings b ON b.user_id = u.id
    LEFT JOIN user_subscriptions us ON us.user_id = u.id
    LEFT JOIN subscriptions s ON s.id = us.plan_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
  return users;
};

// Bookings
const getBookingsService = async () => {
  const [bookings] = await db.query(`
    SELECT 
      b.id, b.date, b.time, b.status, b.total_amount, b.created_at,
      u.full_name as customer_name,
      u.email_address as customer_email,
      biz.name as business_name,
      sv.name as service_name,
      sv.price,
      st.name as staff_name
    FROM bookings b
    LEFT JOIN users u ON u.id = b.user_id
    LEFT JOIN businesses biz ON biz.id = b.business_id
    LEFT JOIN services sv ON sv.id = b.service_id
    LEFT JOIN staff st ON st.id = b.staff_id
    ORDER BY b.created_at DESC
    LIMIT 500
  `);
  return bookings;
};

// Revenue
const getRevenueService = async () => {
  const [data] = await db.query(`
    SELECT 
      biz.id, biz.name as business_name,
      COUNT(b.id) as total_bookings,
      COALESCE(SUM(b.total_amount), 0) as gross_revenue,
      COALESCE(SUM(b.total_amount), 0) * 0.15 as commission,
      COALESCE(SUM(b.total_amount), 0) * 0.85 as net_payout
    FROM businesses biz
    LEFT JOIN bookings b ON b.business_id = biz.id AND b.status = 'completed'
    GROUP BY biz.id
    ORDER BY gross_revenue DESC
  `);
  return data;
};

// Payouts
const getPayoutsService = async () => {
  const [data] = await db.query(`
    SELECT 
      biz.id, biz.name as business_name,
      biz.bank_account,
      COALESCE(SUM(b.total_amount), 0) * 0.85 as payout_amount,
      'Pending' as status,
      CURDATE() as due_date
    FROM businesses biz
    LEFT JOIN bookings b ON b.business_id = biz.id 
      AND b.status = 'completed'
    GROUP BY biz.id
    ORDER BY payout_amount DESC
  `);
  return data;
};

// Update booking status
const updateBookingStatusService = async (id, status) => {
  await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
  const [[booking]] = await db.query("SELECT * FROM bookings WHERE id = ?", [id]);
  return booking;
};

// Update user status
const updateUserStatusService = async (id, is_active) => {
  await db.query("UPDATE users SET is_active = ? WHERE id = ?", [is_active, id]);
  const [[user]] = await db.query(
    "SELECT id, full_name, email_address, is_active FROM users WHERE id = ?",
    [id]
  );
  return user;
};

// Business management - now uses admin_business_states for proper status
const getBusinessesService = async () => {
  const [businesses] = await db.query(`
    SELECT 
      b.id,
      b.name,
      b.phone,
      b.phone AS email,
      b.location,
      b.description,
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
  return businesses;
};

const approveBusinessService = async (id) => {
  await db.query("UPDATE businesses SET is_active = 1 WHERE id = ?", [id]);
  await db.query(`
    INSERT INTO admin_business_states (business_id, admin_status, reviewed_at)
    VALUES (?, 'approved', NOW())
    ON DUPLICATE KEY UPDATE admin_status = 'approved', reviewed_at = NOW(), updated_at = CURRENT_TIMESTAMP
  `, [id]);
  return { id, status: 'approved', blocked: false };
};

const rejectBusinessService = async (id) => {
  await db.query("UPDATE businesses SET is_active = 0 WHERE id = ?", [id]);
  await db.query(`
    INSERT INTO admin_business_states (business_id, admin_status, reviewed_at)
    VALUES (?, 'rejected', NOW())
    ON DUPLICATE KEY UPDATE admin_status = 'rejected', reviewed_at = NOW(), updated_at = CURRENT_TIMESTAMP
  `, [id]);
  return { id, status: 'rejected', blocked: true };
};

const toggleBusinessBlockService = async (id) => {
  const [[business]] = await db.query(`
    SELECT COALESCE(abs.admin_status, 'pending') AS status
    FROM businesses b
    LEFT JOIN admin_business_states abs ON abs.business_id = b.id
    WHERE b.id = ?
  `, [id]);

  const blockedStates = ['blocked', 'suspended', 'rejected'];
  const isBlocked = blockedStates.includes(business?.status || '');
  const nextStatus = isBlocked ? 'approved' : 'blocked';
  const newIsActive = nextStatus === 'approved' ? 1 : 0;

  await db.query("UPDATE businesses SET is_active = ? WHERE id = ?", [newIsActive, id]);
  await db.query(`
    INSERT INTO admin_business_states (business_id, admin_status, reviewed_at)
    VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE admin_status = VALUES(admin_status), reviewed_at = NOW(), updated_at = CURRENT_TIMESTAMP
  `, [id, nextStatus]);

  return { id, blocked: newIsActive === 0, status: nextStatus };
};

// Subscription management
const getSubscriptionsService = async () => {
  const [subscriptions] = await db.query(`
    SELECT
      b.id,
      b.name,
      COALESCE(s.name, 'Free') AS currentPlan,
      abs.plan_id AS currentPlanId,
      COALESCE(abs.subscription_type, 'default') AS subscriptionType,
      COALESCE(abs.duration_months, 0) AS freeMonths,
      COALESCE(abs.is_lifetime, 0) AS lifetimeAccess,
      COALESCE(abs.status, 'inactive') AS status
    FROM businesses b
    LEFT JOIN admin_business_subscriptions abs ON abs.business_id = b.id
    LEFT JOIN subscriptions s ON s.id = abs.plan_id
    ORDER BY b.name
  `);
  return subscriptions;
};

const grantFreeAccessService = async (userId, duration) => {
  const freePlanId = 1;
  const [existing] = await db.query("SELECT * FROM user_subscriptions WHERE user_id = ?", [userId]);
  if (existing.length > 0) {
    await db.query("UPDATE user_subscriptions SET plan_id = ?, created_at = NOW() WHERE user_id = ?", [freePlanId, userId]);
  } else {
    await db.query("INSERT INTO user_subscriptions (user_id, plan_id, created_at) VALUES (?, ?, NOW())", [userId, freePlanId]);
  }
  const planLabel = duration < 0 ? 'Lifetime' : `${duration} months`;
  return { userId, plan: 'Free', duration: planLabel };
};


module.exports = {
  getDashboardService,
  getUsersService,
  getBookingsService,
  getRevenueService,
  getPayoutsService,
  updateBookingStatusService,
  updateUserStatusService,
  getBusinessesService,
  approveBusinessService,
  rejectBusinessService,
  toggleBusinessBlockService,
  getSubscriptionsService,
  grantFreeAccessService
};
