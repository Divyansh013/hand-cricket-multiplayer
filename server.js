import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const rooms = new Map();

app.use(express.json());

app.post('/api/create-room', (req, res) => {
  const roomId = uuidv4();
  rooms.set(roomId, { players: [req.body.playerName], gameState: null });
  console.log(`Room created: ${roomId}`);
  res.json({ roomId });
});

app.post('/api/join-room', (req, res) => {
  const { roomId, playerName } = req.body;
  console.log(`Attempt to join room: ${roomId} by ${playerName}`);
  if (rooms.has(roomId) && rooms.get(roomId).players.length < 2) {
    rooms.get(roomId).players.push(playerName);
    console.log(`${playerName} joined room ${roomId}`);
    res.status(200).json({ success: true });
  } else {
    console.log(`Failed to join room ${roomId}: ${rooms.has(roomId) ? 'Room is full' : 'Room not found'}`);
    res.status(400).json({ success: false, error: 'Room not found or full' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId);
    const room = rooms.get(roomId);
    if (room && room.players.length === 2 && !room.gameState) {
      room.gameState = {
        player1Score: 0,
        player2Score: 0,
        currentBatter: 1,
        lastResult: '',
      };
      io.to(roomId).emit('gameStart', room.gameState);
    }
  });

  socket.on('playTurn', ({ roomId, choice }) => {
    console.log(`Play turn in room ${roomId}: ${choice}`);
    const room = rooms.get(roomId);
    if (room && room.gameState) {
      const opponentChoice = Math.floor(Math.random() * 6) + 1;
      if (choice === opponentChoice) {
        room.gameState.lastResult = `Out! ${choice} vs ${opponentChoice}`;
        room.gameState.currentBatter = room.gameState.currentBatter === 1 ? 2 : 1;
      } else {
        const score = room.gameState.currentBatter === 1 ? 'player1Score' : 'player2Score';
        room.gameState[score] += choice;
        room.gameState.lastResult = `${choice} vs ${opponentChoice}`;
      }
      io.to(roomId).emit('gameState', room.gameState);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

