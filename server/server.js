require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatdb';

// MongoDB Connection (updated for MongoDB Driver v4+)
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  to: String,
  from: String
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  socketId: String,
  online: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);
const User = mongoose.model('User', userSchema);

io.on('connection', async (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join chat
  socket.on('join', async (username) => {
    try {
      // Update user status
      const user = await User.findOneAndUpdate(
        { username },
        { socketId: socket.id, online: true },
        { upsert: true, new: true }
      );

      // Load last 50 messages
      const previousMessages = await Message.find({
        $or: [
          { isPrivate: false },
          { $and: [{ isPrivate: true }, { $or: [{ to: username }, { from: username }] }] }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(50);

      // Get online users
      const onlineUsers = await User.find({ online: true });

      socket.emit('previousMessages', previousMessages.reverse());
      io.emit('users', onlineUsers);
      
      // Notify others
      io.emit('message', {
        username: 'System',
        text: `${username} has joined the chat`,
        timestamp: new Date(),
        isPrivate: false
      });
    } catch (err) {
      console.error('Join error:', err);
    }
  });

  // Public message
  socket.on('sendMessage', async (message) => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        const msg = new Message({
          username: user.username,
          text: message,
          isPrivate: false,
          from: user.username
        });
        await msg.save();
        io.emit('message', msg);
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { online: false }
      );
      
      if (user) {
        const onlineUsers = await User.find({ online: true });
        io.emit('users', onlineUsers);
        io.emit('message', {
          username: 'System',
          text: `${user.username} has left the chat`,
          timestamp: new Date(),
          isPrivate: false
        });
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});