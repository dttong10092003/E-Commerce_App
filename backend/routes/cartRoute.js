const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Lấy giỏ hàng của người dùng
router.get('/:userId', cartController.getCart);

router.get('/:userId/item-count', cartController.getCartItemCount);

router.get('/:userId/item-quantity', cartController.getCartItemQuantity);

// Thêm sản phẩm vào giỏ hàng
router.post('/:userId/add', cartController.addProductToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.patch('/:userId/update', cartController.updateProductQuantity);

// Xóa sản phẩm khỏi giỏ hàng
router.post('/:userId/remove', cartController.removeProductFromCart);

module.exports = router;
