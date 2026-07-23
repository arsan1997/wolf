import React from 'react';
import { Crown, CheckCircle2, Clock, WifiOff, User } from 'lucide-react';

export const PlayerList = ({ players, currentUserId, maxPlayers = 6 }) => {
  const emptySlotsCount = maxPlayers - players.length;
  const emptySlots = Array.from({ length: Math.max(0, emptySlotsCount) });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => {
        const isMe = player.id === currentUserId;
        return (
          <div
            key={player.id}
            className={`relative p-5 rounded-2xl border transition-all duration-300 ${
              isMe
                ? 'bg-purple-900/30 border-purple-500/60 shadow-lg shadow-purple-950/50'
                : 'bg-[#16132b] border-purple-900/40 hover:border-purple-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-lg shadow-inner">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{player.name}</span>
                    {isMe && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-medium">
                        คุณ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    {player.isHost && (
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <Crown className="w-3.5 h-3.5" /> Host
                      </span>
                    )}
                    {!player.isConnected && (
                      <span className="flex items-center gap-1 text-red-400 font-medium ml-2">
                        <WifiOff className="w-3.5 h-3.5" /> หลุดการเชื่อมต่อ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {player.isReady ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-semibold shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> พร้อม
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 text-slate-400 border border-slate-700/50 text-xs font-medium">
                    <Clock className="w-4 h-4" /> รอกดพร้อม
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {emptySlots.map((_, idx) => (
        <div
          key={`empty-${idx}`}
          className="p-5 rounded-2xl border border-dashed border-purple-950/60 bg-purple-950/10 flex items-center justify-center gap-3 text-slate-500 min-h-[88px]"
        >
          <User className="w-5 h-5 opacity-40" />
          <span className="text-sm font-medium">รอผู้เล่นเข้าร่วม...</span>
        </div>
      ))}
    </div>
  );
};
