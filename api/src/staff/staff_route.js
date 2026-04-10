const express = require("express");
const router = express.Router();

const staffController = require("../staff/staff_controller");

router.post("/addStaff", staffController.addStaff);
router.post("/getStaff", staffController.getStaff);
router.put("/update/:id", staffController.updateStaff);
router.delete("/delete/:id", staffController.deleteStaff);

module.exports = router;