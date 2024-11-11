const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      selectedSize: {
        type: String,
        required: true
      },
      selectedColor: {
        type: String,
        required: true
      },
      subTotal: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: {
      name: String,
      phoneNumber: String,
      street: String,
      district: String,
      city: String,
      country: String
    },
    required: true
  },
  paymentMethod: {
    type: {
      cardType: String,
      cardNumber: String,
      cardHolder: String,
      expiryDate: String
    },
    required: true
  },
  deliveryMethod: {
    type: String,
    enum: ['fedex', 'usps', 'dhl'],
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipping', 'Delivered', 'Canceled'],
    default: 'Processing'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  canceledDate: {
    type: Date,
    default: null
  },
  deliveredDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
