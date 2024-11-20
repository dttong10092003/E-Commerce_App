const Feedback = require("../models/feedbackModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.createFeedback = async (req, res) => {
  try {
    const { userId, productId, orderId, rating, comment } = req.body;

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const order = await Order.findOne({ _id: orderId, user: userId, orderStatus: "Delivered" });
    if (!order) {
      return res.status(404).json({ message: "Order not found or not eligible for feedback." });
    }

    // Kiểm tra nếu feedback đã tồn tại
    const feedbackExists = await Feedback.findOne({ order: orderId });
    if (feedbackExists) {
      return res.status(400).json({ message: "Feedback for this order already exists." });
    }

    // Tạo phản hồi mới
    const feedback = await Feedback.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    // Cập nhật thông tin sản phẩm
    const product = await Product.findById(productId);
    if (product) {
      product.reviews += 1; // Tăng số lượng reviews
      product.ratings[rating] = (product.ratings[rating] || 0) + 1; // Tăng số lượng rating được chọn
      await product.save(); // Lưu thay đổi
    }

    res.status(201).json({ message: "Feedback submitted successfully.", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Check if feedback exists for a specific order
exports.checkOrderFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const feedbackExists = await Feedback.findOne({ order: orderId });
    if (feedbackExists) {
      return res.status(200).json({ hasFeedback: true });
    }

    res.status(200).json({ hasFeedback: false });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};


exports.getFeedbacksByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const feedbacks = await Feedback.find({ product: productId }).populate("user", "username avatar");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.getFeedbacksByUser = async (req, res) => {
  try {
    const { userId } = req.body; // Lấy userId từ body request

    const feedbacks = await Feedback.find({ user: userId }).populate("product", "name images");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
