const scheduleService = require("../schedule & availability/schedule_service");

const scheduleController = {};

// ✅ Get Schedule
scheduleController.getSchedule = async (req, res) => {
  try {
    const { staff_id } = req.params;

    const data = await scheduleService.getSchedule(staff_id);

    res.json({
      success: true,
      message: "Schedule fetched",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Update Schedule
scheduleController.updateSchedule = async (req, res) => {
  try {
    const { staff_id } = req.params;

    const data = await scheduleService.updateSchedule(
      staff_id,
      req.body
    );

    res.json({
      success: true,
      message: "Schedule updated",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Add Holiday
scheduleController.addHoliday = async (req, res) => {
  try {
    const data = await scheduleService.addHoliday(req.body);

    res.json({
      success: true,
      message: "Holiday added",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get Holidays
scheduleController.getHolidays = async (req, res) => {
  try {
    const { staff_id } = req.params;

    const data = await scheduleService.getHolidays(staff_id);

    res.json({
      success: true,
      message: "Holidays fetched",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = scheduleController;