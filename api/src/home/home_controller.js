const homeService = require("../home/home_service");

const getHomeData = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "error",
        msg: "user_id required",
      });
    }

    const data = await homeService(user_id);

    return res.status(200).json({
      status: "success",
      data,
    });

  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message,
    });
  }
};

module.exports = { getHomeData };