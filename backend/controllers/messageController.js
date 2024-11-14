const Message = require('../models/messageModel');

// Lưu tin nhắn
const saveMessage = async (req, res) => {
  try {
    const { userId, sender, text, time, imageUri, options } = req.body;
    const message = await Message.create({ userId, sender, text, time, imageUri, options });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy lịch sử tin nhắn theo userId
const getMessageHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ userId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveMessage, getMessageHistory };
