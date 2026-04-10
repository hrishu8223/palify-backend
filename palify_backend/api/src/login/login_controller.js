const { loginService } = require("../login/login_service");

const login = async (req, res) => {
  try {
    const { email_address, password } = req.body;

    if (!email_address || !password) {
      return res.status(400).json({
        status: "error",
        msg: "Email and password are required",
      });
    }

    const user = await loginService({ email_address, password });

    return res.status(200).json({
      status: "success",
      msg: "Login successful",
      data: user,
    });

  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

module.exports = { login };