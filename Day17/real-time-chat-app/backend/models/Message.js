const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Receiver is for private messages
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Room is for group chats
  room: {
    type: String,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
