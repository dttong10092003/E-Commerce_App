const Order = require('../models/orderModel');

// Create a new order
exports.createOrder = async (req, res) => {
  const { userId, products, totalAmount, shippingAddress, paymentMethod, deliveryMethod, shippingCost, discountAmount } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!userId || !products || !totalAmount || !shippingAddress || !paymentMethod || !deliveryMethod || shippingCost === undefined) {
    return res.status(400).json({ message: 'Missing required fields in order data' });
  }

  try {
    const order = new Order({
      user: userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      shippingCost,
      discountAmount,
      orderStatus: 'Processing',
      orderDate: Date.now(),
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error); // Kiểm tra chi tiết lỗi
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get all orders for a user
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng và populate thông tin sản phẩm
    const orders = await Order.find().populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  try {
    const updateData = { orderStatus };

    // Set canceledDate or deliveredDate based on status
    if (orderStatus === 'Canceled') {
      updateData.canceledDate = Date.now();
    } else if (orderStatus === 'Delivered') {
      updateData.deliveredDate = Date.now();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: 'Error deleting order', error });
  }
};


// Count orders by status
exports.countOrdersByStatus = async (req, res) => {
  try {
    // Đếm số lượng đơn hàng với orderStatus là 'Processing' và 'Shipping'
    const processingCount = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippingCount = await Order.countDocuments({ orderStatus: 'Shipping' });

    res.status(200).json({ processingCount, shippingCount });
  } catch (error) {
    console.error("Error counting orders by status:", error);
    res.status(500).json({ message: 'Error counting orders by status', error: error.message });
  }
};
