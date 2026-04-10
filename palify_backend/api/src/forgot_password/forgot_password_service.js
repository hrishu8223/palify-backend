const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 🔹 Generate OTP
const forgotPasswordService = async (email_address) => {
  const [user] = await db.query(
    "SELECT * FROM users WHERE email_address = ?",
    [email_address]
  );

  if (user.length === 0) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await db.query(
    "UPDATE users SET otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE email_address = ?",
    [otp, email_address]
  );

  console.log("OTP:", otp);

  return true;
};

// 🔹 Verify OTP
const verifyOtpService = async (email_address, otp) => {
  const [user] = await db.query(
    "SELECT * FROM users WHERE email_address = ? AND otp = ? AND otp_expiry > NOW()",
    [email_address, otp]
  );

  if (user.length === 0) {
    throw new Error("Invalid or expired OTP");
  }

  return true;
};

// 🔹 Reset Password
const resetPasswordService = async (email_address, new_password) => {
  const hashedPassword = await bcrypt.hash(new_password, 10);

  await db.query(
    "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email_address = ?",
    [hashedPassword, email_address]
  );

  return true;
};

module.exports = {
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
};