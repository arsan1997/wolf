import React from 'react';
import { GAME_STATES } from '../constants/gameStates';
import { RoleCard } from '../components/Game/RoleCard';
import { NightPhase } from '../components/Game/NightPhase';
import { DayResultPhase } from '../components/Game/DayResultPhase';
import { DiscussionPhase } from '../components/Game/DiscussionPhase';
import { VotePhase } from '../components/Game/VotePhase';
import { VoteResultPhase } from '../components/Game/VoteResultPhase';
import { GameOverPhase } from '../components/Game/GameOverPhase';
import { Moon, Heart, Skull } from 'lucide-react';

export const GamePage = ({
  room,
  me,
  seerResult,
  onConfirmRole,
  onSubmitNightAction,
  onClearSeerResult,
  onConfirmDayResult,
  onSkipDiscussion,
  onSubmitVote,
  onConfirmVoteResult,
  onPlayAgain,
  onLeaveRoom
}) => {
  if (!room || !me) return null;

  const renderPhaseComponent = () => {
    switch (room.status) {
      case GAME_STATES.ROLE_REVEAL:
        return (
          <RoleCard
            role={me.role}
            isConfirmed={me.hasConfirmedRole}
            onConfirm={onConfirmRole}
          />
        );

      case GAME_STATES.NIGHT:
        return (
          <NightPhase
            me={me}
            players={room.players}
            seerResult={seerResult}
            onSubmitAction={onSubmitNightAction}
            onClearSeerResult={onClearSeerResult}
          />
        );

      case GAME_STATES.DAY_RESULT:
        return (
          <DayResultPhase
            day={room.day}
            nightResult={room.nightResult}
            me={me}
            onConfirm={onConfirmDayResult}
          />
        );

      case GAME_STATES.DISCUSSION:
        return (
          <DiscussionPhase
            discussionEndTime={room.discussionEndTime}
            players={room.players}
            me={me}
            onSkipDiscussion={onSkipDiscussion}
          />
        );

      case GAME_STATES.VOTING:
        return (
          <VotePhase
            players={room.players}
            me={me}
            onSubmitVote={onSubmitVote}
          />
        );

      case GAME_STATES.VOTE_RESULT:
        return (
          <VoteResultPhase
            voteResult={room.voteResult}
            players={room.players}
            me={me}
            onConfirm={onConfirmVoteResult}
          />
        );

      case GAME_STATES.GAME_OVER:
        return (
          <GameOverPhase
            winner={room.winner}
            winReason={room.winReason}
            players={room.players}
            me={me}
            onPlayAgain={onPlayAgain}
            onLeave={onLeaveRoom}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#131124]/90 border border-purple-900/40 shadow-xl backdrop-blur-xl mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">ห้อง: {room.id}</div>
            <div className="text-sm font-extrabold text-slate-100">วันที่ {room.day}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/40 text-xs font-semibold text-purple-200">
            <span>ผู้เล่น: {me.name}</span>
            {me.isAlive ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold ml-1">
                <Heart className="w-3.5 h-3.5 fill-current" /> มีชีวิต
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 font-bold ml-1">
                <Skull className="w-3.5 h-3.5" /> เสียชีวิต
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Phase View */}
      <div className="flex-1 flex items-center justify-center">
        {renderPhaseComponent()}
      </div>
    </div>
  );
};
