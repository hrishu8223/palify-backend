const express = require("express");
const router = express.Router();

const scheduleController = require("./schedule_controller");

// Schedule
router.post("/get/:staff_id", scheduleController.getSchedule);
router.put("/update/:staff_id", scheduleController.updateSchedule);

// Holidays
router.post("/holiday", scheduleController.addHoliday);
router.get("/holiday/:staff_id", scheduleController.getHolidays);

module.exports = router;