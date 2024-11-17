const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders for a user
router.get('/user/:userId', orderController.getOrdersByUser);

// Lấy tất cả đơn hàng
router.get('/', orderController.getAllOrders);

// Update order status
router.patch('/:orderId/status', orderController.updateOrderStatus);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

// Route for counting orders by status
router.get('/count-by-status', orderController.countOrdersByStatus);

module.exports = router;
