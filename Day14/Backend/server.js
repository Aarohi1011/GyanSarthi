const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jwt_auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'JWT Authentication API is running 🚀' });
});

const PORT = process.env.PORT || 5001; // keep same as frontend calls

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
