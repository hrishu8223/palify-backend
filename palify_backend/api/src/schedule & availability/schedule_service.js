const db = require("../config/db");

const scheduleService = {};

// ✅ Get Schedule
scheduleService.getSchedule = async (staff_id) => {
  const [[data]] = await db.query(
    "SELECT * FROM staff_schedule WHERE staff_id=?",
    [staff_id]
  );
  return data;
};

// ✅ Update Schedule
scheduleService.updateSchedule = async (staff_id, data) => {
  const { working_days, start_time, end_time, lunch_start, lunch_end } = data;

  await db.query(
    `UPDATE staff_schedule 
     SET working_days=?, start_time=?, end_time=?, lunch_start=?, lunch_end=? 
     WHERE staff_id=?`,
    [working_days, start_time, end_time, lunch_start, lunch_end, staff_id]
  );

  return { message: "Schedule updated" };
};

// ✅ Add Holiday
scheduleService.addHoliday = async ({ staff_id, title, date }) => {
  await db.query(
    "INSERT INTO staff_holidays (staff_id, title, date) VALUES (?, ?, ?)",
    [staff_id, title, date]
  );

  return { message: "Holiday added" };
};

// ✅ Get Holidays
scheduleService.getHolidays = async (staff_id) => {
  const [data] = await db.query(
    "SELECT * FROM staff_holidays WHERE staff_id=?",
    [staff_id]
  );

  return data;
};

module.exports = scheduleService;