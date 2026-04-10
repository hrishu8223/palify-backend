const express = require("express");
const router = express.Router();
const ctrl = require("../ratings/ratings_controller");
const { authenticate } = require("../middlewares/auth.middleware");

// POST /api/ratings  (protected)
router.post("/", authenticate, ctrl.submitRating);

// GET  /api/ratings/business/:businessId  (public)
router.get("/business/:businessId", ctrl.getBusinessRatings);

module.exports = router;