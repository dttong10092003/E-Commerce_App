const express = require('express');
const { saveMessage, getMessageHistory } = require('../controllers/messageController');
const router = express.Router();

router.post('/messages', saveMessage); // Lưu tin nhắn
router.get('/messages/:userId', getMessageHistory); // Lấy lịch sử tin nhắn theo userId

module.exports = router;
