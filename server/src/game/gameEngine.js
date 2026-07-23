import { GAME_STATES } from '../constants/gameStates.js';
import { ROLES } from '../constants/roles.js';
import { assignRoles } from './roleManager.js';
import { processVotes } from './voteManager.js';
import { checkWinCondition } from './winCondition.js';
import { roomManager } from './roomManager.js';

class GameEngine {
  startGame(roomCode, playerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');

    if (room.hostPlayerId !== playerId) {
      throw new Error('เฉพาะ Host เท่านั้นที่เริ่มเกมได้');
    }

    if (room.status !== GAME_STATES.LOBBY) {
      throw new Error('เกมได้เริ่มไปแล้ว');
    }

    if (room.players.length < 5 || room.players.length > 6) {
      throw new Error('เกมต้องการผู้เล่น 5 ถึง 6 คน');
    }

    const allReady = room.players.every((p) => p.isReady);
    if (!allReady) {
      throw new Error('ผู้เล่นทุกคนต้องกดพร้อมก่อนเริ่มเกม');
    }

    // Assign Roles
    room.players = assignRoles(room.players);
    room.status = GAME_STATES.ROLE_REVEAL;
    room.day = 0;
    room.nightActions = {};
    room.votes = {};
    room.nightResult = null;
    room.voteResult = null;
    room.winner = null;
    room.winReason = null;
    room.discussionSkips = new Set();

    return room;
  }

  confirmRole(roomCode, playerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.ROLE_REVEAL) throw new Error('ไม่อยู่ในขั้นตอนเปิดเผยบทบาท');

    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error('ไม่พบผู้เล่น');

    player.hasConfirmedRole = true;

    const alivePlayers = room.players.filter((p) => p.isAlive);
    const allConfirmed = alivePlayers.every((p) => p.hasConfirmedRole);

    if (allConfirmed) {
      room.day += 1;
      room.status = GAME_STATES.NIGHT;
      // Reset night submission flags
      room.players.forEach((p) => {
        p.hasSubmittedNightAction = false;
      });
      room.nightActions = {};
    }

    return room;
  }

  submitNightAction(roomCode, playerId, targetPlayerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.NIGHT) throw new Error('ไม่อยู่ในระดับกลางคืน');

    const player = room.players.find((p) => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('ผู้เล่นที่เสียชีวิตแล้วไม่สามารถทำคำสั่งได้');

    if (player.hasSubmittedNightAction) {
      throw new Error('คุณได้ส่งคำสั่งประจำคืนนี้ไปแล้ว');
    }

    const targetPlayer = room.players.find((p) => p.id === targetPlayerId);
    if (!targetPlayer || !targetPlayer.isAlive) {
      throw new Error('เป้าหมายไม่ถูกต้องหรือเสียชีวิตไปแล้ว');
    }

    let seerResult = null;

    // Action validation per role
    switch (player.role) {
      case ROLES.WEREWOLF:
        if (targetPlayerId === playerId) {
          throw new Error('มนุษย์หมาป่าห้ามเลือกตัวเอง');
        }
        room.nightActions[ROLES.WEREWOLF] = targetPlayerId;
        break;

      case ROLES.SEER:
        if (targetPlayerId === playerId) {
          throw new Error('ผู้ทำนายห้ามเลือกตรวจสอบตัวเอง');
        }
        room.nightActions[ROLES.SEER] = targetPlayerId;
        seerResult = {
          targetId: targetPlayer.id,
          targetName: targetPlayer.name,
          isWerewolf: targetPlayer.role === ROLES.WEREWOLF
        };
        break;

      case ROLES.DOCTOR:
        room.nightActions[ROLES.DOCTOR] = targetPlayerId;
        break;

      case ROLES.VILLAGER:
        throw new Error('ชาวบ้านไม่มีคำสั่งกลางคืน');

      default:
        break;
    }

    player.hasSubmittedNightAction = true;

    // Check if all active night roles who are alive have submitted
    const aliveRoles = room.players
      .filter((p) => p.isAlive && [ROLES.WEREWOLF, ROLES.SEER, ROLES.DOCTOR].includes(p.role))
      .map((p) => p.role);

    const allSubmitted = aliveRoles.every((role) => room.nightActions[role] !== undefined);

    if (allSubmitted) {
      this.resolveNight(room);
    }

    return { room, seerResult };
  }

  resolveNight(room) {
    const werewolfTarget = room.nightActions[ROLES.WEREWOLF];
    const doctorTarget = room.nightActions[ROLES.DOCTOR];

    let killedPlayer = null;

    if (werewolfTarget && werewolfTarget !== doctorTarget) {
      killedPlayer = room.players.find((p) => p.id === werewolfTarget);
      if (killedPlayer) {
        killedPlayer.isAlive = false;
      }
    }

    room.nightResult = {
      killedPlayer: killedPlayer
        ? {
            id: killedPlayer.id,
            name: killedPlayer.name
          }
        : null,
      saved: Boolean(werewolfTarget && werewolfTarget === doctorTarget)
    };

    room.status = GAME_STATES.DAY_RESULT;
    room.players.forEach((p) => {
      p.hasConfirmedDayResult = false;
    });

    // Check win condition after night death
    const winCheck = checkWinCondition(room.players);
    if (winCheck) {
      room.winner = winCheck.winner;
      room.winReason = winCheck.reason;
    }
  }

  confirmDayResult(roomCode, playerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.DAY_RESULT) throw new Error('ไม่อยู่ในขั้นตอนผลกลางคืน');

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.hasConfirmedDayResult = true;
    }

    const alivePlayers = room.players.filter((p) => p.isAlive);
    const allConfirmed = alivePlayers.every((p) => p.hasConfirmedDayResult);

    if (allConfirmed) {
      if (room.winner) {
        room.status = GAME_STATES.GAME_OVER;
      } else {
        room.status = GAME_STATES.DISCUSSION;
        room.discussionEndTime = Date.now() + 90000; // 90 seconds
        room.discussionSkips = new Set();
      }
    }

    return room;
  }

  skipDiscussion(roomCode, playerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.DISCUSSION) throw new Error('ไม่อยู่ในขั้นตอนพูดคุย');

    const player = room.players.find((p) => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('เฉพาะผู้เล่นที่ยังมีชีวิตเท่านั้น');

    if (!room.discussionSkips) room.discussionSkips = new Set();
    room.discussionSkips.add(playerId);

    const alivePlayers = room.players.filter((p) => p.isAlive);
    if (room.discussionSkips.size >= alivePlayers.length) {
      this.startVoting(room);
    }

    return room;
  }

  startVoting(room) {
    room.status = GAME_STATES.VOTING;
    room.votes = {};
    room.players.forEach((p) => {
      p.hasVoted = false;
    });
  }

  submitVote(roomCode, playerId, targetPlayerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.VOTING) throw new Error('ไม่อยู่ในขั้นตอนการโหวต');

    const player = room.players.find((p) => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('ผู้เล่นที่เสียชีวิตแล้วไม่สามารถโหวตได้');

    if (player.hasVoted) throw new Error('คุณได้ลงคะแนนโหวตไปแล้ว');

    if (targetPlayerId === playerId) throw new Error('ห้ามโหวตตัวเอง');

    const targetPlayer = room.players.find((p) => p.id === targetPlayerId);
    if (!targetPlayer || !targetPlayer.isAlive) throw new Error('เป้าหมายไม่ถูกต้องหรือเสียชีวิตแล้ว');

    room.votes[playerId] = targetPlayerId;
    player.hasVoted = true;

    const alivePlayers = room.players.filter((p) => p.isAlive);
    const allVoted = alivePlayers.every((p) => p.hasVoted);

    if (allVoted) {
      const result = processVotes(room);
      room.voteResult = result;
      room.status = GAME_STATES.VOTE_RESULT;

      // Check win condition after vote execution
      const winCheck = checkWinCondition(room.players);
      if (winCheck) {
        room.winner = winCheck.winner;
        room.winReason = winCheck.reason;
      }
    }

    return room;
  }

  confirmVoteResult(roomCode, playerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.status !== GAME_STATES.VOTE_RESULT) throw new Error('ไม่อยู่ในขั้นตอนผลโหวต');

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.hasConfirmedVoteResult = true;
    }

    const alivePlayers = room.players.filter((p) => p.isAlive);
    const allConfirmed = alivePlayers.every((p) => p.hasConfirmedVoteResult);

    if (allConfirmed) {
      if (room.winner) {
        room.status = GAME_STATES.GAME_OVER;
      } else {
        room.day += 1;
        room.status = GAME_STATES.NIGHT;
        room.players.forEach((p) => {
          p.hasSubmittedNightAction = false;
          p.hasConfirmedVoteResult = false;
        });
        room.nightActions = {};
      }
    }

    return room;
  }

  playAgain(roomCode, playerId) {
    const room = roomManager.getRoom(roomCode);
    if (!room) throw new Error('ไม่พบห้อง');
    if (room.hostPlayerId !== playerId) throw new Error('เฉพาะ Host เท่านั้นที่สั่งเล่นใหม่ได้');

    room.status = GAME_STATES.LOBBY;
    room.day = 0;
    room.nightActions = {};
    room.nightResult = null;
    room.votes = {};
    room.voteResult = null;
    room.winner = null;
    room.winReason = null;
    room.discussionEndTime = null;

    room.players.forEach((p) => {
      p.role = null;
      p.isAlive = true;
      p.isReady = p.isHost;
      p.hasConfirmedRole = false;
      p.hasSubmittedNightAction = false;
      p.hasConfirmedDayResult = false;
      p.hasVoted = false;
      p.hasConfirmedVoteResult = false;
    });

    return room;
  }
}

export const gameEngine = new GameEngine();
