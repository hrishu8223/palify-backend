const express = require("express");
const router = express.Router();
const { getDashboard } = require("./dashboard_controller");

router.get("/", getDashboard);

module.exports = router;
