const chatService = require("../chats/chats_service");

const chatController = {};

// ✅ Send Message
chatController.sendMessage = async (req, res) => {
  try {
    const data = await chatService.sendMessage(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get Messages
chatController.getMessages = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const data = await chatService.getMessages(booking_id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete Message
chatController.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await chatService.deleteMessage(id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = chatController;