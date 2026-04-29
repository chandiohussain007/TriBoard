import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Define matchmaking queue and basic rooms
const matchmakingQueue: { socket: any, gameType: string }[] = [];
const activeGames: Record<string, { type: string, players: string[], state: any }> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('find_match', ({ gameType }) => {
      // Basic matchmaking logic
      const index = matchmakingQueue.findIndex(p => p.gameType === gameType);
      
      if (index !== -1) {
        // Found a match
        const opponent = matchmakingQueue.splice(index, 1)[0].socket;
        const roomId = `room_${opponent.id}_${socket.id}`;
        
        socket.join(roomId);
        opponent.join(roomId);
        
        // Randomize colors
        const colors = Math.random() > 0.5 ? ['w', 'b'] : ['b', 'w'];
        
        io.to(roomId).emit('match_found', { 
          roomId, 
          players: { [socket.id]: colors[0], [opponent.id]: colors[1] } 
        });
        
        activeGames[roomId] = { type: gameType, players: [socket.id, opponent.id], state: null };
      } else {
        matchmakingQueue.push({ socket, gameType });
        // Return a timeout after 5 seconds to play bot instead? Or the client can timeout and emit 'cancel_match'
      }
    });
    
    socket.on('cancel_match', () => {
      const index = matchmakingQueue.findIndex(p => p.socket.id === socket.id);
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
      }
    });

    socket.on('send_move', ({ roomId, move, state }) => {
       // Broadcast move to other player in room
       socket.to(roomId).emit('receive_move', { move, state });
       if (activeGames[roomId]) {
         activeGames[roomId].state = state;
       }
    });

    socket.on('disconnect', () => {
       const index = matchmakingQueue.findIndex(p => p.socket.id === socket.id);
       if (index !== -1) matchmakingQueue.splice(index, 1);
       // Inform opponent if in game
       for (const roomId in activeGames) {
         if (activeGames[roomId].players.includes(socket.id)) {
           socket.to(roomId).emit('opponent_disconnected');
           delete activeGames[roomId];
         }
       }
    });
  });

  // API routes
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
