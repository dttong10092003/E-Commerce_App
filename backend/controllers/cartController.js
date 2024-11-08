const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    res.status(200).json(cart || { products: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addProductToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity, selectedSize, selectedColor } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const subTotal = product.salePrice * (1 - product.discount / 100) * quantity;

    // Nếu người dùng chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity, selectedSize, selectedColor, subTotal }],
        totalAmount: subTotal
      });
    } else {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng tiền nhỏ
        cart.products[existingProductIndex].quantity += quantity;
        cart.products[existingProductIndex].subTotal += subTotal;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        cart.products.push({ product: productId, quantity, selectedSize, selectedColor, subTotal });
      }

      // Cập nhật tổng tiền
      cart.totalAmount += subTotal;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
  exports.updateProductQuantity = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity, selectedSize, selectedColor } = req.body;
  
    if (!userId || !productId || !selectedSize || !selectedColor) {
      return res.status(400).json({ message: "User ID, Product ID, selected size, and selected color are required" });
    }
  
    try {
      const cart = await Cart.findOne({ user: userId }).populate('products.product'); // Lấy thông tin sản phẩm trong giỏ hàng
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Tìm sản phẩm trong giỏ hàng dựa trên productId, selectedSize, và selectedColor
      const productInCart = cart.products.find(
        (p) => 
          p.product._id.toString() === productId &&
          p.selectedSize === selectedSize &&
          p.selectedColor === selectedColor
      );
  
      if (!productInCart) {
        return res.status(404).json({ message: "Product with specified size and color not found in cart" });
      }
  
      // Lấy giá và giảm giá của sản phẩm
      const salePrice = productInCart.product.salePrice;
      const discount = productInCart.product.discount || 0; // Mặc định là 0 nếu không có giảm giá
  
      if (!salePrice) {
        return res.status(400).json({ message: "Product sale price is not defined" });
      }
  
      // Cập nhật số lượng và tính toán lại subTotal
      productInCart.quantity = quantity;
      productInCart.subTotal = salePrice * (1 - discount / 100) * quantity;
  
      // Tính lại tổng tiền totalAmount của giỏ hàng
      cart.totalAmount = cart.products.reduce((sum, item) => sum + item.subTotal, 0);
  
      await cart.save();
      res.status(200).json({ message: "Quantity updated successfully", cart });
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      res.status(500).json({ message: "Error updating cart quantity", error });
    }
  };
  
  

// Xóa sản phẩm khỏi giỏ hàng
exports.removeProductFromCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, selectedSize, selectedColor } = req.body;
  
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      const productSubTotal = cart.products[productIndex].subTotal;
      if (productSubTotal) {
        cart.totalAmount -= productSubTotal;
      }
  
      cart.products.splice(productIndex, 1);
  
      await cart.save();
      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
      res.status(500).json({ message: 'Error removing product from cart', error });
    }
  };

  // Lấy số lượng sản phẩm trong giỏ hàng của người dùng
  exports.getCartItemCount = async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await Cart.findOne({ user: userId });
      const itemCount = cart ? cart.products.length : 0;
      res.status(200).json({ itemCount });
    } catch (error) {
      console.error("Error fetching cart item count:", error);
      res.status(500).json({ message: "Error fetching cart item count", error });
    }
  };

  exports.getCartItemQuantity = async (req, res) => {
    const { userId } = req.params;
    const { productId, selectedSize, selectedColor } = req.query;
  
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(200).json({ quantity: 0 });
      }
  
      const item = cart.products.find(
        p => 
          p.product.toString() === productId &&
          p.selectedSize === selectedSize &&
          p.selectedColor === selectedColor
      );
  
      const quantity = item ? item.quantity : 0;
      res.status(200).json({ quantity });
    } catch (error) {
      console.error("Error fetching cart item quantity:", error);
      res.status(500).json({ message: "Error fetching cart item quantity" });
    }
  };