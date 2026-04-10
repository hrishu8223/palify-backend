const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/auth");

const {
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
} = require("./admin_controller");

// Apply auth middleware to all admin routes
router.use(verifyAdmin);

router.get("/dashboard",  getDashboard);
router.get("/users",      getUsers);
router.get("/bookings",   getBookings);
router.get("/revenue",    getRevenue);
router.get("/payouts",    getPayouts);

router.put("/bookings/:id/status", updateBookingStatus);
router.put("/users/:id/status",    updateUserStatus);

router.get("/businesses",                  getBusinesses);
router.patch("/businesses/:id/approve",    approveBusiness);
router.patch("/businesses/:id/reject",     rejectBusiness);
router.patch("/businesses/:id/block",      toggleBusinessBlock);

router.get("/subscriptions",               getSubscriptions);
router.post("/subscriptions/grant-free",   grantFreeAccess);

module.exports = router;
