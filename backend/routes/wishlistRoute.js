const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Lấy danh sách wishlist của người dùng
router.get('/:userId', wishlistController.getWishlist);

// Thêm sản phẩm vào wishlist
router.post('/:userId/add', wishlistController.addProductToWishlist);

// Xóa sản phẩm khỏi wishlist
router.post('/:userId/remove', wishlistController.removeProductFromWishlist);

module.exports = router;
