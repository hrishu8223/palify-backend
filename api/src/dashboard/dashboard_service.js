const db = require("../config/db");

const dashboardService = {};

dashboardService.getDashboard = async () => {
  const [[bookings]] = await db.query(
    "SELECT COUNT(*) as totalBookings FROM bookings"
  );

  const [[revenue]] = await db.query(
    "SELECT SUM(total_amount) as totalRevenue FROM bookings WHERE status='completed'"
  );

  const [[todayBookings]] = await db.query(
    "SELECT COUNT(*) as today FROM bookings WHERE DATE(created_at)=CURDATE()"
  );

  return {
    totalBookings: bookings.totalBookings,
    totalRevenue: revenue.totalRevenue || 0,
    todayBookings: todayBookings.today,
  };
};

module.exports = dashboardService;