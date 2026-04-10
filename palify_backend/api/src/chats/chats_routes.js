const express = require("express");
const router = express.Router();

const chatController = require("../chats/chats_controller");

// ✅ Send Message
router.post("/msg", chatController.sendMessage);

// ✅ Get Messages
router.post("/:booking_id", chatController.getMessages);

// ✅ Delete Message
router.delete("/:id", chatController.deleteMessage);

module.exports = router;