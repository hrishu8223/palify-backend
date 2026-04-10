const bookingService = require("../booking/booking_service");

// ✅ Get Services
const getServicesController = async (req, res) => {
  try {
    const { business_id } = req.body;

    if (!business_id) {
      return res.status(400).json({
        status: "error",
        msg: "business_id is required",
      });
    }

    const data = await bookingService.getServices(business_id);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

// ✅ Get Staff
const getStaffController = async (req, res) => {
  try {
    const { business_id } = req.body;

    const data = await bookingService.getStaff(business_id);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

// ✅ Get Available Slots
const getSlotsController = async (req, res) => {
  try {
    const { business_id, staff_id, date } = req.body;

    if (!staff_id || !date) {
      return res.status(400).json({
        status: "error",
        msg: "staff_id and date required",
      });
    }

    const data = await bookingService.getAvailableSlots({
      business_id,
      staff_id,
      date,
    });

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

// ✅ Create Booking
const createBookingController = async (req, res) => {
  try {
    const { user_id, business_id, service_id, staff_id, date, time } = req.body;

    if (!user_id || !service_id || !staff_id || !date || !time) {
      return res.status(400).json({
        status: "error",
        msg: "All fields are required",
      });
    }

    await bookingService.createBooking({
      user_id,
      business_id,
      service_id,
      staff_id,
      date,
      time,
    });

    res.status(200).json({
      status: "success",
      msg: "Booking confirmed",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

module.exports = {
  getServicesController,
  getStaffController,
  getSlotsController,
  createBookingController,
};