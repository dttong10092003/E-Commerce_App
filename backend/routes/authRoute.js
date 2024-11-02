// routes/authRoute.js
const express = require('express');
const { registerUser, loginUser, getAllUsers, getSingleUser,updateUsername,getCurrentUser,updatePassword,authenticateToken,forgotPassword } = require('../controllers/authController');

const router = express.Router();

// Đăng ký
router.post('/register', registerUser);

// Đăng nhập
router.post('/login', loginUser);
// Lấy tất cả người dùng
router.get('/users', getAllUsers);

// Lấy chi tiết một người dùng theo ID
router.get('/users/:id', getSingleUser);

// Cập nhật tên người dùng
router.patch('/users/:id/username', updateUsername);

// Lấy thông tin người dùng hiện tại (sử dụng token)
router.get('/user', getCurrentUser); 

router.patch('/update-password', authenticateToken, updatePassword);
router.post('/forgot-password', forgotPassword);
module.exports = router;
