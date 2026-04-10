const notificationService = require("../notification/notification_service");

const notificationController = {};


// ✅ Get Notifications
notificationController.getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await notificationService.getNotifications(user_id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ Mark All Read
notificationController.markAllRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await notificationService.markAllRead(user_id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = notificationController;