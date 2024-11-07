const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // Mỗi người dùng chỉ có một giỏ hàng
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
        required: true,
        default: 1
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
    required: true,
    default: 0
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
