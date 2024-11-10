const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const secretKey = process.env.JWT_SECRET;

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = { id: user.id };
        next();
    });
};

// Lấy danh sách wishlist của người dùng
router.get('/', authenticateToken, wishlistController.getWishlist);

// Thêm sản phẩm vào wishlist
router.post('/add', authenticateToken, wishlistController.addProductToWishlist);

// Xóa sản phẩm khỏi wishlist
router.post('/remove', authenticateToken, wishlistController.removeProductFromWishlist);

module.exports = router;
