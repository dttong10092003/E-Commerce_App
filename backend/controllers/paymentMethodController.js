// controllers/paymentMethodController.js
const PaymentMethod = require('../models/paymentMethodModel');
const mongoose = require('mongoose');

// Lấy tất cả phương thức thanh toán của người dùng
const getUserPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const methods = await PaymentMethod.find({ userId });
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm phương thức thanh toán mới
const addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const method = new PaymentMethod({ ...req.body, userId });
    await method.save();
    res.status(201).json({ message: 'Payment method added successfully', method });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật phương thức thanh toán
const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMethod = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedMethod) return res.status(404).json({ message: 'Payment method not found' });
    res.status(200).json({ message: 'Payment method updated successfully', method: updatedMethod });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa phương thức thanh toán
const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMethod = await PaymentMethod.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedMethod) return res.status(404).json({ message: 'Payment method not found' });
    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Đặt thẻ làm mặc định
const setDefaultPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Đặt tất cả thẻ của người dùng thành không mặc định
    await PaymentMethod.updateMany({ userId }, { isDefault: false });

    // Đặt thẻ mới làm mặc định
    const updatedMethod = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId },
      { isDefault: true },
      { new: true }
    );

    if (!updatedMethod) return res.status(404).json({ message: 'Payment method not found' });
    res.status(200).json({ message: 'Default payment method set successfully', method: updatedMethod });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,setDefaultPaymentMethod };
