const express = require("express");
const router = express.Router();

const notificationController = require("../notification/notification_controller");

// ✅ Get Notifications
router.post("/:user_id", notificationController.getNotifications);

// ✅ Mark All Read
router.put("/read/:user_id", notificationController.markAllRead);

module.exports = router;