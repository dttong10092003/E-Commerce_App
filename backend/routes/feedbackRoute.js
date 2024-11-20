const express = require("express");
const {
  createFeedback,
  getFeedbacksByProduct,
  getFeedbacksByUser,
  checkOrderFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", createFeedback); // Tạo phản hồi
router.get("/product/:productId", getFeedbacksByProduct); // Lấy phản hồi theo sản phẩm
router.post("/user", getFeedbacksByUser); // Lấy phản hồi theo người dùng
router.get("/check/:orderId", checkOrderFeedback);

module.exports = router;
