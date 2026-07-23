import { GAME_STATES } from '../constants/gameStates.js';
import { generateRoomCode } from '../utils/roomCodeGenerator.js';

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomCode -> room object
    this.playerToRoom = new Map(); // playerId -> roomCode
    this.socketToPlayer = new Map(); // socketId -> playerId
    this.disconnectTimers = new Map(); // playerId -> setTimeout ID
  }

  createRoom(hostPlayerId, hostName, socketId) {
    if (!hostName || hostName.trim() === '') {
      throw new Error('กรุณากรอกชื่อผู้เล่น');
    }

    const roomCode = generateRoomCode(this.rooms);
    const hostPlayer = {
      id: hostPlayerId,
      socketId,
      name: hostName.trim(),
      isHost: true,
      isReady: true,
      isAlive: true,
      isConnected: true,
      role: null,
      hasConfirmedRole: false,
      hasSubmittedNightAction: false,
      hasConfirmedDayResult: false,
      hasVoted: false,
      hasConfirmedVoteResult: false
    };

    const room = {
      id: roomCode,
      hostPlayerId,
      status: GAME_STATES.LOBBY,
      day: 0,
      players: [hostPlayer],
      nightActions: {},
      nightResult: null,
      discussionEndTime: null,
      votes: {},
      voteResult: null,
      winner: null,
      winReason: null,
      createdAt: Date.now()
    };

    this.rooms.set(roomCode, room);
    this.playerToRoom.set(hostPlayerId, roomCode);
    this.socketToPlayer.set(socketId, hostPlayerId);

    return room;
  }

  joinRoom(roomCode, playerId, playerName, socketId) {
    const code = roomCode.toUpperCase().trim();
    const room = this.rooms.get(code);

    if (!room) {
      throw new Error('ไม่พบห้องรหัสนี้');
    }

    if (!playerName || playerName.trim() === '') {
      throw new Error('กรุณากรอกชื่อผู้เล่น');
    }

    const cleanName = playerName.trim();

    // Check if player is reconnecting
    const existingPlayer = room.players.find((p) => p.id === playerId);
    if (existingPlayer) {
      // Clear disconnect timer if present
      if (this.disconnectTimers.has(playerId)) {
        clearTimeout(this.disconnectTimers.get(playerId));
        this.disconnectTimers.delete(playerId);
      }

      existingPlayer.socketId = socketId;
      existingPlayer.isConnected = true;
      this.socketToPlayer.set(socketId, playerId);
      this.playerToRoom.set(playerId, code);

      return { room, reconnected: true };
    }

    // Check game status
    if (room.status !== GAME_STATES.LOBBY) {
      throw new Error('ห้องนี้กำลังอยู่ระหว่างการแข่งขัน ไม่สามารถเข้าร่วมได้');
    }

    if (room.players.length >= 6) {
      throw new Error('ห้องนี้มีผู้เล่นครบ 6 คนแล้ว');
    }

    // Check duplicate name in room
    if (room.players.some((p) => p.name.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error('มีผู้เล่นใช้ชื่อนี้อยู่ในห้องแล้ว');
    }

    const newPlayer = {
      id: playerId,
      socketId,
      name: cleanName,
      isHost: false,
      isReady: false,
      isAlive: true,
      isConnected: true,
      role: null,
      hasConfirmedRole: false,
      hasSubmittedNightAction: false,
      hasConfirmedDayResult: false,
      hasVoted: false,
      hasConfirmedVoteResult: false
    };

    room.players.push(newPlayer);
    this.playerToRoom.set(playerId, code);
    this.socketToPlayer.set(socketId, playerId);

    return { room, reconnected: false };
  }

  toggleReady(roomCode, playerId) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.LOBBY) throw new Error('ไม่สามารถเปลี่ยนสถานะได้ในขณะนี้');

    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error('ไม่พบผู้เล่นในห้อง');

    if (!player.isHost) {
      player.isReady = !player.isReady;
    }
    return room;
  }

  leaveRoom(roomCode, playerId) {
    const room = this.rooms.get(roomCode);
    if (!room) return null;

    // Remove player
    room.players = room.players.filter((p) => p.id !== playerId);
    this.playerToRoom.delete(playerId);

    if (room.players.length === 0) {
      // Room empty -> delete
      this.rooms.delete(roomCode);
      return null;
    }

    // If host left, transfer host status to next player
    if (room.hostPlayerId === playerId) {
      const nextHost = room.players[0];
      nextHost.isHost = true;
      nextHost.isReady = true;
      room.hostPlayerId = nextHost.id;
    }

    return room;
  }

  handleDisconnect(socketId, onPlayerPermanentlyRemoved) {
    const playerId = this.socketToPlayer.get(socketId);
    if (!playerId) return null;

    this.socketToPlayer.delete(socketId);
    const roomCode = this.playerToRoom.get(playerId);
    if (!roomCode) return null;

    const room = this.rooms.get(roomCode);
    if (!room) return null;

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.isConnected = false;

      // Set 60-second grace window for reconnection
      const timer = setTimeout(() => {
        this.disconnectTimers.delete(playerId);
        // If still disconnected and in LOBBY, remove player
        const currentRoom = this.rooms.get(roomCode);
        if (currentRoom) {
          const currentP = currentRoom.players.find((p) => p.id === playerId);
          if (currentP && !currentP.isConnected) {
            if (currentRoom.status === GAME_STATES.LOBBY) {
              this.leaveRoom(roomCode, playerId);
            }
            if (onPlayerPermanentlyRemoved) {
              onPlayerPermanentlyRemoved(roomCode, playerId);
            }
          }
        }
      }, 60000);

      this.disconnectTimers.set(playerId, timer);
    }

    return { room, playerId };
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  getRoomByPlayerId(playerId) {
    const code = this.playerToRoom.get(playerId);
    return code ? this.rooms.get(code) : null;
  }

  getPublicRoomState(room, requestingPlayerId) {
    if (!room) return null;

    const sanitizedPlayers = room.players.map((p) => {
      const isSelf = p.id === requestingPlayerId;
      const isGameOver = room.status === GAME_STATES.GAME_OVER;

      return {
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        isReady: p.isReady,
        isAlive: p.isAlive,
        isConnected: p.isConnected,
        // Only reveal own role unless game over
        role: isSelf || isGameOver ? p.role : null,
        hasConfirmedRole: p.hasConfirmedRole,
        hasSubmittedNightAction: p.hasSubmittedNightAction,
        hasConfirmedDayResult: p.hasConfirmedDayResult,
        hasVoted: p.hasVoted,
        hasConfirmedVoteResult: p.hasConfirmedVoteResult
      };
    });

    return {
      id: room.id,
      hostPlayerId: room.hostPlayerId,
      status: room.status,
      day: room.day,
      players: sanitizedPlayers,
      nightResult: room.nightResult,
      discussionEndTime: room.discussionEndTime,
      voteResult: room.status === GAME_STATES.VOTE_RESULT || room.status === GAME_STATES.GAME_OVER ? room.voteResult : null,
      winner: room.winner,
      winReason: room.winReason,
      createdAt: room.createdAt
    };
  }
}

export const roomManager = new RoomManager();
