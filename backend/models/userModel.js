const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password']
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String, // URL hoặc base64 của ảnh đại diện
    default: '', // Có thể thêm avatar mặc định nếu cần
  }
} );

module.exports = mongoose.model('User', userSchema);
