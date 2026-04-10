const analyticsService = require("./analytics_service");

const analyticsController = {};

analyticsController.getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getAnalytics();

    res.json({
      success: true,
      message: "Analytics fetched",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = analyticsController;