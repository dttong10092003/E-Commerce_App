// routes/supportRequestRoutes.js
const express = require('express');
const { createSupportRequest, getSupportRequests, updateSupportRequestStatus, deleteSupportRequest } = require('../controllers/supportRequestController');
const { authenticateToken, isAdmin } = require('../controllers/authController');

const router = express.Router();

// Tạo yêu cầu hỗ trợ
router.post('/', authenticateToken, createSupportRequest);

// Lấy danh sách yêu cầu hỗ trợ (chỉ admin)
router.get('/', authenticateToken, isAdmin, getSupportRequests);

// Cập nhật trạng thái yêu cầu hỗ trợ
router.patch('/:id', authenticateToken, isAdmin, updateSupportRequestStatus);

// Xóa yêu cầu hỗ trợ
router.delete('/:id', authenticateToken, isAdmin, deleteSupportRequest);

module.exports = router;
