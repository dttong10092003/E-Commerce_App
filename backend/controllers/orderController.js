const Order = require('../models/orderModel');
const moment = require('moment');
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

// Calculate total amount of delivered orders
exports.getTotalDeliveredAmount = async (req, res) => {
  try {
    const totalDeliveredAmount = await Order.aggregate([
      { $match: { orderStatus: 'Delivered' } }, // Lọc các đơn hàng có trạng thái Delivered
      { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } } // Tính tổng totalAmount
    ]);

    res.status(200).json({ totalAmount: totalDeliveredAmount[0]?.totalAmount || 0 });
  } catch (error) {
    console.error("Error calculating total delivered amount:", error);
    res.status(500).json({ message: 'Error calculating total delivered amount', error });
  }
};
// Get recent transactions (last 10 orders)
exports.getRecentTransactions = async (req, res) => {
  try {
    const recentTransactions = await Order.find()
      .sort({ orderDate: -1 }) // Sắp xếp theo ngày gần nhất
      .limit(3) // Giới hạn 10 giao dịch
      .populate('user', 'username email')
      .populate('products.product', 'name price');

    res.status(200).json(recentTransactions);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ message: 'Error fetching recent transactions', error });
  }
};

// Get weekly activity data
exports.getWeeklyActivity = async (req, res) => {
  try {
    const startOfWeek = moment().startOf('isoWeek').toDate(); // Bắt đầu tuần
    const endOfWeek = moment().endOf('isoWeek').toDate(); // Kết thúc tuần

    const weeklyData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfWeek, $lte: endOfWeek }, // Lọc đơn hàng trong tuần
          orderStatus: 'Delivered', // Chỉ tính đơn hàng đã giao
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$orderDate' }, // Nhóm theo ngày trong tuần
          totalAmount: { $sum: '$totalAmount' }, // Tổng doanh thu trong ngày
        },
      },
    ]);

    // Map dữ liệu thành mảng 7 ngày
    const weeklyActivity = Array(7).fill(0); // 7 ngày, mặc định là 0
    weeklyData.forEach((item) => {
      const dayIndex = item._id - 1; // MongoDB: 1=Sunday, chỉnh thành 0=Monday
      weeklyActivity[dayIndex] = Math.round(item.totalAmount * 10) / 10; // Làm tròn 1 chữ số thập phân
    });

    res.status(200).json({ weeklyActivity });
  } catch (error) {
    console.error('Error fetching weekly activity:', error);
    res.status(500).json({ message: 'Error fetching weekly activity', error });
  }
};

// Get monthly balance history
exports.getBalanceHistory = async (req, res) => {
  try {
    const monthlyData = await Order.aggregate([
      {
        $match: {
          orderStatus: 'Delivered', // Chỉ tính đơn hàng đã giao
        },
      },
      {
        $group: {
          _id: { $month: '$orderDate' }, // Nhóm theo tháng
          totalAmount: { $sum: '$totalAmount' }, // Tính tổng doanh thu
        },
      },
    ]);

    // Chuẩn bị mảng dữ liệu cho 12 tháng
    const balanceHistory = Array(12).fill(0); // 12 tháng, mặc định là 0
    monthlyData.forEach((item) => {
      const monthIndex = item._id - 1; // MongoDB trả về tháng 1-12, chỉnh thành 0-11
      balanceHistory[monthIndex] = Math.round(item.totalAmount * 10) / 10; // Làm tròn 1 chữ số thập phân
    });

    res.status(200).json({ balanceHistory });
  } catch (error) {
    console.error('Error fetching balance history:', error);
    res.status(500).json({ message: 'Error fetching balance history', error });
  }
};
