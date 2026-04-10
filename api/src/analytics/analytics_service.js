const db = require("../config/db");

const analyticsService = {};

analyticsService.getAnalytics = async () => {
  const [[revenue]] = await db.query(
    "SELECT SUM(total_amount) as totalRevenue FROM bookings"
  );

  const [[bookings]] = await db.query(
    "SELECT COUNT(*) as totalBookings FROM bookings"
  );

  const [[rating]] = await db.query(
    "SELECT AVG(rating) as avgRating FROM reviews"
  );

  const [[customers]] = await db.query(
    "SELECT COUNT(*) as customers FROM users"
  );

  return {
    totalRevenue: revenue.totalRevenue || 0,
    totalBookings: bookings.totalBookings,
    avgRating: rating.avgRating || 0,
    customers: customers.customers,
  };
};

module.exports = analyticsService;