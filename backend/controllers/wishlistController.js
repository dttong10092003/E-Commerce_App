const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');

// Lấy danh sách wishlist của người dùng
exports.getWishlist = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ token đã xác thực
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    res.status(200).json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};



// Thêm sản phẩm vào wishlist
exports.addProductToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    } else {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to wishlist', error });
  }
};

// Xóa sản phẩm khỏi wishlist
exports.removeProductFromWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from wishlist', error });
  }
};
