const express = require('express');
const { checkInUser, handleSpin, fetchUserRewards  } = require('../controllers/userRewardController');
const { authenticateToken } = require('../controllers/authController');

const router = express.Router();

// Lấy thông tin reward của người dùng
router.get('/', authenticateToken, fetchUserRewards);

// Điểm danh
router.post('/check-in', authenticateToken, checkInUser);

// Quay thưởng
router.post('/spin', authenticateToken, handleSpin);


module.exports = router;
