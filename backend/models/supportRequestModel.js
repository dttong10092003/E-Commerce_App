// models/supportRequestModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supportRequestSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Liên kết đến bảng User
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
