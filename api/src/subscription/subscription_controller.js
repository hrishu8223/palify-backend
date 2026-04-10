const subscriptionService = require("../subscription/subscription_service");

const subscriptionController = {};

subscriptionController.getPlans = async (req, res) => {
  try {
    const data = await subscriptionService.getPlans();

    res.json({
      success: true,
      message: "Plans fetched",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

subscriptionController.subscribe = async (req, res) => {
  try {
    const data = await subscriptionService.subscribe(req.body);

    res.json({
      success: true,
      message: "Subscribed",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = subscriptionController;