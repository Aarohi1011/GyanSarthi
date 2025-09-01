// -----------------------
// backend/index.js
// -----------------------

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// -----------------------
// MongoDB Connection
// -----------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// -----------------------
// Routes
// -----------------------
app.get('/', (req, res) => {
  res.json({ msg: 'Server is running' });
});

app.use('/api/auth', authRoutes);

// -----------------------
// Socket.IO Setup
// -----------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Map to track userId => socket.id
const userSockets = {};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Register socket for private messaging
  socket.on('register_socket', (userId) => {
    userSockets[userId] = socket.id;
    io.emit('online_users', Object.keys(userSockets));
  });

  // Handle joining a room
  socket.on('join_room', async (room) => {
    socket.join(room);

    // Fetch last 50 messages in the room
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username');

    // Send messages in correct order (oldest first)
    socket.emit('chat_history', messages.reverse());
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { senderId, content, room, receiverId } = data;
      if (!senderId || !content) return;

      const newMessage = new Message({
        sender: senderId,
        content,
        room,
        receiver: receiverId,
      });

      await newMessage.save();
      const populatedMessage = await newMessage.populate('sender', 'username');

      // Room message
      if (room) {
        io.to(room).emit('receive_message', populatedMessage);
      }
      // Private message
      else if (receiverId) {
        const receiverSocket = userSockets[receiverId];
        if (receiverSocket) io.to(receiverSocket).emit('receive_message', populatedMessage);
        // Also send back to sender
        io.to(socket.id).emit('receive_message', populatedMessage);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from userSockets
    for (const [userId, sId] of Object.entries(userSockets)) {
      if (sId === socket.id) {
        delete userSockets[userId];
        io.emit('online_users', Object.keys(userSockets));
        break;
      }
    }
  });
});

// -----------------------
// Start Server
// -----------------------
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
