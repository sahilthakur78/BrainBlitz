import { nanoid } from 'nanoid';
import User from '../models/User.js';

const waitingQueue = [];
const activeRooms = new Map();

export const initBattleSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    socket.on('find-battle', async ({ userId, username, avatar }) => {
      socket.userId = userId;
      if (waitingQueue.length > 0) {
        const opponent = waitingQueue.shift();
        const roomId = nanoid(10);
        const room = {
          roomId,
          players: [
            { socketId: opponent.id, userId: opponent.userId, username: opponent.username, hp: 100 },
            { socketId: socket.id, userId, username, hp: 100 },
          ],
          status: 'countdown',
        };
        activeRooms.set(roomId, room);
        socket.join(roomId);
        opponent.join(roomId);

        const challenge = await getRandomChallenge();
        room.challenge = challenge;
        io.to(roomId).emit('battle-found', { roomId, room, challenge });

        let count = 5;
        const interval = setInterval(() => {
          io.to(roomId).emit('countdown', count--);
          if (count < 0) {
            clearInterval(interval);
            room.status = 'active';
            room.startedAt = Date.now();
            io.to(roomId).emit('battle-start', { room });
          }
        }, 1000);
      } else {
        waitingQueue.push(socket);
        socket.emit('in-queue', { position: waitingQueue.length });
      }
    });

    socket.on('code-update', ({ roomId, code }) => {
      socket.to(roomId).emit('opponent-code-update', { code });
    });

    socket.on('battle-submit', async ({ roomId, userId, testsPassed, testsTotal }) => {
      const room = activeRooms.get(roomId);
      if (!room || room.status !== 'active') return;
      const opponent = room.players.find(p => p.userId !== userId);
      if (!opponent) return;
      const damage = Math.floor((testsPassed / testsTotal) * 40) + (testsPassed === testsTotal ? 20 : 0);
      opponent.hp = Math.max(0, opponent.hp - damage);
      io.to(roomId).emit('hp-update', { players: room.players });
      if (opponent.hp <= 0 || testsPassed === testsTotal) {
        room.status = 'finished';
        io.to(roomId).emit('battle-over', { winnerId: userId });
        await User.findByIdAndUpdate(userId, { $inc: { 'battleStats.wins': 1, 'battleStats.totalBattles': 1 } });
        await User.findByIdAndUpdate(opponent.userId, { $inc: { 'battleStats.losses': 1, 'battleStats.totalBattles': 1 } });
        activeRooms.delete(roomId);
      }
    });

    socket.on('leave-battle', ({ roomId }) => {
      const room = activeRooms.get(roomId);
      if (room?.status === 'active') {
        const opp = room.players.find(p => p.socketId !== socket.id);
        if (opp) io.to(roomId).emit('battle-over', { winnerId: opp.userId, forfeit: true });
        activeRooms.delete(roomId);
      }
      const qi = waitingQueue.findIndex(s => s.id === socket.id);
      if (qi !== -1) waitingQueue.splice(qi, 1);
    });

    socket.on('disconnect', () => {
      const qi = waitingQueue.findIndex(s => s.id === socket.id);
      if (qi !== -1) waitingQueue.splice(qi, 1);
    });
  });
};

const getRandomChallenge = async () => {
  const Challenge = (await import('../models/Challenge.js')).default;
  const count = await Challenge.countDocuments({ difficulty: { $in: ['easy','medium'] }, isPublished: true });
  return Challenge.findOne({ difficulty: { $in: ['easy','medium'] }, isPublished: true }).skip(Math.floor(Math.random() * count));
};
