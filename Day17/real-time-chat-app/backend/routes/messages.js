const express = require('express');
const Message = require('../models/Message');
// This is a placeholder for a future middleware that would check JWT
// const authMiddleware = require('../middleware/auth'); 

const router = express.Router();

// Fetch messages for a specific room
// In a real app, you'd protect this route with authMiddleware
router.get('/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .sort({ createdAt: -1 }) // Get newest messages first
      .limit(50) // Limit to the last 50 messages
      .populate('sender', 'username'); // Populate sender info

    // We reverse because we want to show oldest messages first in the chat UI
    res.json(messages.reverse()); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
