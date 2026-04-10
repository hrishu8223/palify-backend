// const db = require("../config/db");

// const adminController = {};

// // GET /admin/dashboard
// adminController.getDashboard = async (req, res) => {
//   try {
//     const [[users]]         = await db.query("SELECT COUNT(*) as total FROM users");
//     const [[providers]]     = await db.query("SELECT COUNT(*) as total FROM businesses");
//     const [[bookings]]      = await db.query("SELECT COUNT(*) as total FROM bookings");
//     const [[todayBookings]] = await db.query("SELECT COUNT(*) as total FROM bookings WHERE DATE(created_at) = CURDATE()");
//     const [[revenue]]       = await db.query("SELECT SUM(total_amount) as total FROM bookings WHERE status = 'completed'");
//     const [[todayRevenue]]  = await db.query("SELECT SUM(total_amount) as total FROM bookings WHERE status='completed' AND DATE(created_at)=CURDATE()");
//     const [[avgRating]]     = await db.query("SELECT AVG(stars) as avg FROM ratings");

//     res.json({
//       totalUsers:     users.total,
//       totalProviders: providers.total,
//       totalBookings:  bookings.total,
//       todayBookings:  todayBookings.total,
//       totalRevenue:   revenue.total || 0,
//       todayRevenue:   todayRevenue.total || 0,
//       avgRating:      Number(avgRating.avg || 0).toFixed(1),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET /admin/users
// adminController.getUsers = async (req, res) => {
//   try {
//     const [users] = await db.query(
//       `SELECT 
//         u.id, u.full_name, u.email_address, u.created_at,
//         COUNT(b.id) as total_bookings,
//         COALESCE(s.name, 'Free') as plan,
//         CASE WHEN u.is_active = 1 THEN 'Active' ELSE 'Inactive' END as status
//        FROM users u
//        LEFT JOIN bookings b ON b.user_id = u.id
//        LEFT JOIN user_subscriptions us ON us.user_id = u.id
//        LEFT JOIN subscriptions s ON s.id = us.plan_id
//        GROUP BY u.id
//        ORDER BY u.created_at DESC`
//     );
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET /admin/bookings
// adminController.getBookings = async (req, res) => {
//   try {
//     const [bookings] = await db.query(
//       `SELECT 
//         b.id, b.date, b.time, b.status, b.total_amount, b.created_at,
//         u.full_name   as customer_name,
//         u.email_address as customer_email,
//         biz.name      as business_name,
//         sv.name       as service_name,
//         sv.price,
//         st.name       as staff_name
//        FROM bookings b
//        LEFT JOIN users      u   ON u.id   = b.user_id
//        LEFT JOIN businesses biz ON biz.id = b.business_id
//        LEFT JOIN services   sv  ON sv.id  = b.service_id
//        LEFT JOIN staff      st  ON st.id  = b.staff_id
//        ORDER BY b.created_at DESC
//        LIMIT 500`
//     );
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET /admin/revenue
// adminController.getRevenue = async (req, res) => {
//   try {
//     const [data] = await db.query(
//       `SELECT 
//         biz.id, biz.name as business_name,
//         COUNT(b.id)               as total_bookings,
//         SUM(b.total_amount)       as gross_revenue,
//         SUM(b.total_amount)*0.15  as commission,
//         SUM(b.total_amount)*0.85  as net_payout
//        FROM businesses biz
//        LEFT JOIN bookings b ON b.business_id = biz.id AND b.status = 'completed'
//        GROUP BY biz.id
//        ORDER BY gross_revenue DESC`
//     );
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET /admin/payouts
// adminController.getPayouts = async (req, res) => {
//   try {
//     const [data] = await db.query(
//       `SELECT 
//         biz.id, biz.name as business_name,
//         biz.bank_account,
//         SUM(b.total_amount)*0.85 as payout_amount,
//         'Pending' as status,
//         CURDATE() as due_date
//        FROM businesses biz
//        LEFT JOIN bookings b ON b.business_id = biz.id 
//          AND b.status = 'completed'
//        GROUP BY biz.id
//        ORDER BY payout_amount DESC`
//     );
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // PUT /admin/bookings/:id/status
// adminController.updateBookingStatus = async (req, res) => {
//   try {
//     const { id }     = req.params;
//     const { status } = req.body;
//     await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
//     const [[booking]] = await db.query("SELECT * FROM bookings WHERE id = ?", [id]);
//     res.json(booking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // PUT /admin/users/:id/status
// adminController.updateUserStatus = async (req, res) => {
//   try {
//     const { id }        = req.params;
//     const { is_active } = req.body;
//     await db.query("UPDATE users SET is_active = ? WHERE id = ?", [is_active, id]);
//     const [[user]] = await db.query("SELECT id, full_name, email_address, is_active FROM users WHERE id = ?", [id]);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = adminController;

// src/admin/admin_controller.js

const {
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
} = require("./admin_service");


// Dashboard
const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Users
const getUsers = async (req, res) => {
  try {
    const data = await getUsersService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Bookings
const getBookings = async (req, res) => {
  try {
    const data = await getBookingsService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Revenue
const getRevenue = async (req, res) => {
  try {
    const data = await getRevenueService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Payouts
const getPayouts = async (req, res) => {
  try {
    const data = await getPayoutsService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update booking
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data = await updateBookingStatusService(id, status);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update user
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const data = await updateUserStatusService(id, is_active);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Business management controllers
const getBusinesses = async (req, res) => {
  try {
    const data = await getBusinessesService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await approveBusinessService(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await rejectBusinessService(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBusinessBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await toggleBusinessBlockService(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subscription management controllers
const getSubscriptions = async (req, res) => {
  try {
    const data = await getSubscriptionsService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const grantFreeAccess = async (req, res) => {
  try {
    const { userId, duration } = req.body;
    const data = await grantFreeAccessService(userId, duration);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDashboard,
  getUsers,
  getBookings,
  getRevenue,
  getPayouts,
  updateBookingStatus,
  updateUserStatus,
  getBusinesses,
  approveBusiness,
  rejectBusiness,
  toggleBusinessBlock,
  getSubscriptions,
  grantFreeAccess
};