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
  }
} );

module.exports = mongoose.model('User', userSchema);
