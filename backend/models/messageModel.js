const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: String,
    enum: ['user', 'support','admin'],
    required: true,
  },
  text: String,
  time: String,
  imageUri: String,
  options: [String],
});

module.exports = mongoose.model('Message', messageSchema);
