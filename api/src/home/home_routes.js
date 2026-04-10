const express = require("express");
const router = express.Router();

const { getHomeData } = require("../home/home_controller");

router.post("/home", getHomeData);

module.exports = router;