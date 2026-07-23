import { SOCKET_EVENTS } from '../constants/events.js';
import { GAME_STATES } from '../constants/gameStates.js';
import { roomManager } from '../game/roomManager.js';
import { gameEngine } from '../game/gameEngine.js';

export const registerSocketHandlers = (io) => {
  const broadcastRoomUpdate = (room) => {
    if (!room) return;
    room.players.forEach((player) => {
      if (player.socketId && player.isConnected) {
        const publicState = roomManager.getPublicRoomState(room, player.id);
        io.to(player.socketId).emit(SOCKET_EVENTS.ROOM_UPDATED, publicState);
      }
    });
  };

  // Timer loop for Discussion Phase auto-advance
  setInterval(() => {
    roomManager.rooms.forEach((room) => {
      if (room.status === GAME_STATES.DISCUSSION && room.discussionEndTime) {
        if (Date.now() >= room.discussionEndTime) {
          gameEngine.startVoting(room);
          broadcastRoomUpdate(room);
        }
      }
    });
  }, 1000);

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Create Room
    socket.on(SOCKET_EVENTS.CREATE_ROOM, ({ playerId, playerName }) => {
      try {
        const room = roomManager.createRoom(playerId, playerName, socket.id);
        socket.join(room.id);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Join Room
    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomCode, playerId, playerName }) => {
      try {
        const { room, reconnected } = roomManager.joinRoom(roomCode, playerId, playerName, socket.id);
        socket.join(room.id);
        broadcastRoomUpdate(room);

        if (reconnected) {
          socket.emit(SOCKET_EVENTS.PLAYER_RECONNECTED, { message: 'กลับเข้าสู่ห้องเล่นเกมแล้ว' });
        }
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Toggle Ready
    socket.on(SOCKET_EVENTS.TOGGLE_READY, ({ roomCode, playerId }) => {
      try {
        const room = roomManager.toggleReady(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Start Game
    socket.on(SOCKET_EVENTS.START_GAME, ({ roomCode, playerId }) => {
      try {
        const room = gameEngine.startGame(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Confirm Role
    socket.on(SOCKET_EVENTS.CONFIRM_ROLE, ({ roomCode, playerId }) => {
      try {
        const room = gameEngine.confirmRole(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Submit Night Action
    socket.on(SOCKET_EVENTS.SUBMIT_NIGHT_ACTION, ({ roomCode, playerId, targetPlayerId }) => {
      try {
        const { room, seerResult } = gameEngine.submitNightAction(roomCode, playerId, targetPlayerId);
        
        if (seerResult) {
          socket.emit(SOCKET_EVENTS.SEER_RESULT, seerResult);
        }

        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Confirm Day Result
    socket.on(SOCKET_EVENTS.CONFIRM_DAY_RESULT, ({ roomCode, playerId }) => {
      try {
        const room = gameEngine.confirmDayResult(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Skip Discussion
    socket.on(SOCKET_EVENTS.SKIP_DISCUSSION, ({ roomCode, playerId }) => {
      try {
        const room = gameEngine.skipDiscussion(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Submit Vote
    socket.on(SOCKET_EVENTS.SUBMIT_VOTE, ({ roomCode, playerId, targetPlayerId }) => {
      try {
        const room = gameEngine.submitVote(roomCode, playerId, targetPlayerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Confirm Vote Result
    socket.on(SOCKET_EVENTS.CONFIRM_VOTE_RESULT, ({ roomCode, playerId }) => {
      try {
        const room = gameEngine.confirmVoteResult(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Leave Room
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomCode, playerId }) => {
      try {
        const room = roomManager.leaveRoom(roomCode, playerId);
        socket.leave(roomCode);
        if (room) {
          broadcastRoomUpdate(room);
        }
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Play Again
    socket.on(SOCKET_EVENTS.PLAY_AGAIN, ({ roomCode, playerId }) => {
      try {
        const room = gameEngine.playAgain(roomCode, playerId);
        broadcastRoomUpdate(room);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR_MESSAGE, { message: error.message });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      const res = roomManager.handleDisconnect(socket.id, (roomCode) => {
        const r = roomManager.getRoom(roomCode);
        if (r) broadcastRoomUpdate(r);
      });
      if (res && res.room) {
        broadcastRoomUpdate(res.room);
      }
    });
  });
};
