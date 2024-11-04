// controllers/shippingAddressController.js
const ShippingAddress = require('../models/shippingAddressModel');
const mongoose = require('mongoose');
// Lấy tất cả địa chỉ của người dùng
const getUserShippingAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await ShippingAddress.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm địa chỉ mới
const addShippingAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = new ShippingAddress({ ...req.body, userId });
    await address.save();
    res.status(201).json({ message: 'Address added successfully', address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật địa chỉ
const updateShippingAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAddress = await ShippingAddress.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa địa chỉ
const deleteShippingAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAddress = await ShippingAddress.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;

  try {
    await ShippingAddress.updateMany({ userId }, { isDefault: false });

    // Đặt isDefault: true cho địa chỉ mới được chọn
    const updatedAddress = await ShippingAddress.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Default address set successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ error: "Failed to set default address" });
  }
};
module.exports = { getUserShippingAddresses, addShippingAddress, updateShippingAddress, deleteShippingAddress,setDefaultAddress };
