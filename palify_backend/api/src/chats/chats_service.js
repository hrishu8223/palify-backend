const db = require("../config/db");

const chatService = {};

// ✅ Send Message
chatService.sendMessage = async (data) => {
  const { booking_id, sender, message } = data;

  if (!booking_id || !sender || !message) {
    throw new Error("All fields are required");
  }

  const [result] = await db.query(
    "INSERT INTO chats (booking_id, sender, message) VALUES (?, ?, ?)",
    [booking_id, sender, message]
  );

  return {
    message: "Message sent",
    chatId: result.insertId,
  };
};

// ✅ Get Messages (Chat History)
chatService.getMessages = async (booking_id) => {
  const [messages] = await db.query(
    "SELECT * FROM chats WHERE booking_id = ? ORDER BY created_at ASC",
    [booking_id]
  );

  return messages;
};

// ✅ Delete Message
chatService.deleteMessage = async (id) => {
  await db.query("DELETE FROM chats WHERE id = ?", [id]);

  return { message: "Message deleted" };
};

module.exports = chatService;