const express = require("express");
const router = express.Router();

const {
  getServicesController,
  getStaffController,
  getSlotsController,
  createBookingController,
} = require("../booking/booking_controller");

// routes
router.post("/services", getServicesController);
router.post("/staff", getStaffController);
router.post("/available-slots", getSlotsController);
router.post("/create", createBookingController);

module.exports = router;