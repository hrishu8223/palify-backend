const express = require("express");
const router = express.Router();

const subscriptionController = require("../subscription/subscription_controller");

// ✅ Use POST instead of GET
router.post("/plans", subscriptionController.getPlans);

// ✅ Subscribe
router.post("/subscribe", subscriptionController.subscribe);

module.exports = router;