const express = require("express");
const router = express.Router();

const analyticsController = require("./analytics_controller");

router.post("/getAnalytics", analyticsController.getAnalytics);

module.exports = router;