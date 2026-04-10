const {
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
} = require("../forgot_password/forgot_password_service");

// 🔹 Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email_address } = req.body;

    if (!email_address) {
      return res.status(400).json({
        status: "error",
        msg: "Email is required",
      });
    }

    await forgotPasswordService(email_address);

    return res.status(200).json({
      status: "success",
      msg: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

// 🔹 Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email_address, otp } = req.body;

    if (!email_address || !otp) {
      return res.status(400).json({
        status: "error",
        msg: "Email and OTP are required",
      });
    }

    await verifyOtpService(email_address, otp);

    return res.status(200).json({
      status: "success",
      msg: "OTP verified",
    });

  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

// 🔹 Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email_address, new_password } = req.body;

    if (!email_address || !new_password) {
      return res.status(400).json({
        status: "error",
        msg: "Email and new password are required",
      });
    }

    await resetPasswordService(email_address, new_password);

    return res.status(200).json({
      status: "success",
      msg: "Password reset successful",
    });

  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

module.exports = {
  forgotPassword,
  verifyOtp,
  resetPassword,
};