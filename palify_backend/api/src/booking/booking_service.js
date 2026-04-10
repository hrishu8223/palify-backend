const db = require("../config/db");

// ✅ Get Services
const getServices = async (business_id) => {
  const [services] = await db.query(
    "SELECT id, name, duration, price, image FROM services WHERE business_id = ?",
    [business_id]
  );

  return services;
};

// ✅ Get Staff
const getStaff = async (business_id) => {
  const [staff] = await db.query(
    "SELECT id, name, role, rating, image FROM team WHERE business_id = ?",
    [business_id]
  );

  return staff;
};

// ✅ Get Available Slots
const getAvailableSlots = async ({ staff_id, date }) => {
  const allSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM",
    "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const [booked] = await db.query(
    "SELECT time FROM bookings WHERE staff_id = ? AND date = ?",
    [staff_id, date]
  );

  const bookedTimes = booked.map((b) => b.time);

  const slots = allSlots.map((time) => ({
    time,
    is_booked: bookedTimes.includes(time),
  }));

  return slots;
};

// ✅ Create Booking
const createBooking = async (data) => {
  const { user_id, business_id, service_id, staff_id, date, time } = data;

  // check if already booked
  const [existing] = await db.query(
    "SELECT * FROM bookings WHERE staff_id = ? AND date = ? AND time = ?",
    [staff_id, date, time]
  );

  if (existing.length > 0) {
    throw new Error("Slot already booked");
  }

  await db.query(
    `INSERT INTO bookings 
    (user_id, business_id, service_id, staff_id, date, time) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, business_id, service_id, staff_id, date, time]
  );

  return true;
};

module.exports = {
  getServices,
  getStaff,
  getAvailableSlots,
  createBooking,
};