import { useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket';
import { SOCKET_EVENTS } from '../constants/events';
import { getStoredPlayerId } from '../utils/storage';

export const useGameState = () => {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [seerResult, setSeerResult] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(false);

  const playerId = getStoredPlayerId();

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    // Synchronize initial socket connection state immediately
    if (socket.connected) {
      setIsConnected(true);
    }

    const onConnect = () => {
      setIsConnected(true);
      setIsLoading(false);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (err) => {
      setIsConnected(false);
      setIsLoading(false);
    };

    const handleRoomUpdated = (updatedRoom) => {
      setRoom(updatedRoom);
      setIsLoading(false);
    };

    const handleSeerResult = (result) => {
      setSeerResult(result);
    };

    const handleErrorMessage = ({ message }) => {
      setError(message);
      setIsLoading(false);
      showToast(message, 'error');
    };

    const handlePlayerReconnected = ({ message }) => {
      showToast(message, 'success');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on(SOCKET_EVENTS.ROOM_UPDATED, handleRoomUpdated);
    socket.on(SOCKET_EVENTS.SEER_RESULT, handleSeerResult);
    socket.on(SOCKET_EVENTS.ERROR_MESSAGE, handleErrorMessage);
    socket.on(SOCKET_EVENTS.PLAYER_RECONNECTED, handlePlayerReconnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off(SOCKET_EVENTS.ROOM_UPDATED, handleRoomUpdated);
      socket.off(SOCKET_EVENTS.SEER_RESULT, handleSeerResult);
      socket.off(SOCKET_EVENTS.ERROR_MESSAGE, handleErrorMessage);
      socket.off(SOCKET_EVENTS.PLAYER_RECONNECTED, handlePlayerReconnected);
    };
  }, [showToast]);

  const createRoom = (playerName) => {
    setIsLoading(true);
    socket.emit(SOCKET_EVENTS.CREATE_ROOM, { playerId, playerName });
  };

  const joinRoom = (roomCode, playerName) => {
    setIsLoading(true);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomCode, playerId, playerName });
  };

  const toggleReady = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.TOGGLE_READY, { roomCode: room.id, playerId });
    }
  };

  const startGame = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.START_GAME, { roomCode: room.id, playerId });
    }
  };

  const confirmRole = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.CONFIRM_ROLE, { roomCode: room.id, playerId });
    }
  };

  const submitNightAction = (targetPlayerId) => {
    if (room) {
      socket.emit(SOCKET_EVENTS.SUBMIT_NIGHT_ACTION, { roomCode: room.id, playerId, targetPlayerId });
    }
  };

  const confirmDayResult = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.CONFIRM_DAY_RESULT, { roomCode: room.id, playerId });
    }
  };

  const skipDiscussion = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.SKIP_DISCUSSION, { roomCode: room.id, playerId });
    }
  };

  const submitVote = (targetPlayerId) => {
    if (room) {
      socket.emit(SOCKET_EVENTS.SUBMIT_VOTE, { roomCode: room.id, playerId, targetPlayerId });
    }
  };

  const confirmVoteResult = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.CONFIRM_VOTE_RESULT, { roomCode: room.id, playerId });
    }
  };

  const leaveRoom = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomCode: room.id, playerId });
      setRoom(null);
    }
  };

  const playAgain = () => {
    if (room) {
      socket.emit(SOCKET_EVENTS.PLAY_AGAIN, { roomCode: room.id, playerId });
    }
  };

  const me = room?.players?.find((p) => p.id === playerId) || null;

  return {
    room,
    me,
    playerId,
    error,
    toast,
    seerResult,
    isConnected,
    isLoading,
    clearSeerResult: () => setSeerResult(null),
    showToast,
    clearToast,
    createRoom,
    joinRoom,
    toggleReady,
    startGame,
    confirmRole,
    submitNightAction,
    confirmDayResult,
    skipDiscussion,
    submitVote,
    confirmVoteResult,
    leaveRoom,
    playAgain
  };
};
