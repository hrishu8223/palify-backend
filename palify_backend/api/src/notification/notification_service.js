const db = require("../config/db");

const notificationService = {};


// ✅ Get Notifications
notificationService.getNotifications = async (user_id) => {
  const [data] = await db.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC",
    [user_id]
  );

  return data;
};


// ✅ Mark All as Read
notificationService.markAllRead = async (user_id) => {
  await db.query(
    "UPDATE notifications SET is_read=TRUE WHERE user_id=?",
    [user_id]
  );

  return { message: "All notifications marked as read" };
};


// ✅ Add Notification (internal use)
notificationService.createNotification = async (data) => {
  const { user_id, title, message, type } = data;

  await db.query(
    "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
    [user_id, title, message, type]
  );

  return { message: "Notification created" };
};


module.exports = notificationService;