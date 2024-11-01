// routes/authRoute.js
const express = require('express');
const { registerUser, loginUser, getAllUsers, getSingleUser } = require('../controllers/authController');

const router = express.Router();

// Đăng ký
router.post('/register', registerUser);

// Đăng nhập
router.post('/login', loginUser);
// Lấy tất cả người dùng
router.get('/users', getAllUsers);

// Lấy chi tiết một người dùng theo ID
router.get('/users/:id', getSingleUser);
module.exports = router;
