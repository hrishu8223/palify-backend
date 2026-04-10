const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../forgot_password/forgot_password_controller");

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;