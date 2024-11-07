// models/userRewardModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRewardSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendance: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false]
  },
  lastCheckIn: {
    type: Date,
    default: null
  },
  spinCount: {
    type: Number,
    default: 0
  },
  rewardHistory: [
    {
      text: String,
      icon: String,
      code: String,
      daysRemaining: Number,
      time: { type: Date, default: Date.now },  // Thay đổi ở đây
      type: { type: String, enum: ['deliver', 'coupon'] } // Thêm trường type vào rewardHistory
    }
  ],
  availableVouchers: [
    {
      name: String,
      discount: String,
      code: String,
      daysRemaining: Number,
      icon: String,
      receivedAt: {
        type: Date,
        default: Date.now
      },
      type: { type: String, enum: ['deliver', 'coupon'], default: 'coupon' }
    }
  ]
});

module.exports = mongoose.model('UserReward', userRewardSchema);
