const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    phoneNumber: String,
    street: String,
    district: String,
    city: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  });
  
  module.exports = mongoose.model('ShippingAddress', shippingAddressSchema);
  