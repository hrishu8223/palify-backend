const { signupService } = require("./signup_service");

const signup = async (req, res) => {
  try {
    const { full_name, email_address, password, confirm_password } = req.body;

    if (!full_name || !email_address || !password || !confirm_password) {
      return res.status(400).json({
        status: "error",
        msg: "All fields are required",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        status: "error",
        msg: "Passwords do not match",
      });
    }

    const user = await signupService({
      full_name,
      email_address,
      password,
    });

    return res.status(201).json({
      status: "success",
      msg: "Account created successfully",
      data: user
    });

  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { signup };