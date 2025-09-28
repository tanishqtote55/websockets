// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Serve static frontend from ./public
// app.use(express.static(path.resolve('./public')));

// // Socket.io handler
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('user-message', (data) => {
//     io.emit('message', data); // data = { name, message }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.sendFile(path.resolve('./public/index.html'));
// });

// server.listen(9000, () => {
//   console.log('Server started on http://localhost:9000');
// });






const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { nanoid } = require('nanoid'); // npm i nanoid

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const activeRooms = new Set(); // Keep track of created rooms

// Serve static frontend from ./public
app.use(express.static(path.resolve('./public')));

// Route to generate unique room ID
app.get('/create-room', (req, res) => {
  let roomId;
  do {
    roomId = nanoid(6); // e.g. 'a8fj2k'
  } while (activeRooms.has(roomId));

  activeRooms.add(roomId);
  res.json({ roomId });
});

// Socket.io handler
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', ({ name, roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`${name} joined room: ${roomId}`);
  });

  socket.on('user-message', ({ name, message, roomId }) => {
    if (roomId) {
      io.to(roomId).emit('message', { name, message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

server.listen(9000, () => {
  console.log('Server started on http://localhost:9000');
});
