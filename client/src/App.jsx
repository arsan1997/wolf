import React from 'react';
import { useGameState } from './hooks/useGameState';
import { GAME_STATES } from './constants/gameStates';
import { Home } from './pages/Home';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { Toast } from './components/Common/Toast';

export const App = () => {
  const {
    room,
    me,
    toast,
    seerResult,
    isConnected,
    isLoading,
    clearSeerResult,
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
  } = useGameState();

  return (
    <>
      <Toast toast={toast} onClose={clearToast} />

      {!room ? (
        <Home
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          isConnected={isConnected}
          isLoading={isLoading}
        />
      ) : room.status === GAME_STATES.LOBBY ? (
        <LobbyPage
          room={room}
          me={me}
          onToggleReady={toggleReady}
          onStartGame={startGame}
          onLeaveRoom={leaveRoom}
          onShowToast={showToast}
        />
      ) : (
        <GamePage
          room={room}
          me={me}
          seerResult={seerResult}
          onConfirmRole={confirmRole}
          onSubmitNightAction={submitNightAction}
          onClearSeerResult={clearSeerResult}
          onConfirmDayResult={confirmDayResult}
          onSkipDiscussion={skipDiscussion}
          onSubmitVote={submitVote}
          onConfirmVoteResult={confirmVoteResult}
          onPlayAgain={playAgain}
          onLeaveRoom={leaveRoom}
        />
      )}
    </>
  );
};

export default App;
