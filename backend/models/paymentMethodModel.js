const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cardType: String,
    cardNumber: {
      type: String,
      required: true,
      match: [/^\d{16}$/, '{VALUE} is not a valid card number! It should contain exactly 16 digits.'],
    },
    cardHolder: {
      type: String,
      required: true,
      match: [/^[A-Za-z\s]+$/, '{VALUE} is not a valid card holder name! It should not contain special characters.'],
    },
    expiryDate: {
      type: String,
      required: true,
      match: [/^(0[1-9]|1[0-2])\d{2}$/, '{VALUE} is not a valid expiry date! It should be in MMYY format.'],
    },    
    cvv: {
      type: String,
      required: true,
      match: [/^\d{3}$/, '{VALUE} is not a valid CVV! It should contain exactly 3 digits.'],
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
