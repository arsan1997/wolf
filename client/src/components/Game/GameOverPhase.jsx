import React from 'react';
import { Trophy, RotateCcw, Home, Skull, Heart } from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';

export const GameOverPhase = ({ winner, winReason, players, me, onPlayAgain, onLeave }) => {
  const isHost = me?.isHost;
  const isVillagerWin = winner === 'VILLAGER';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-8 rounded-3xl bg-[#131124] border border-purple-900/50 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
        {/* Glow ambient */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isVillagerWin ? 'bg-indigo-500/20' : 'bg-red-500/20'
        }`}></div>

        <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Trophy className={`w-10 h-10 ${isVillagerWin ? 'text-amber-400' : 'text-red-500'}`} />
        </div>

        <h2 className={`text-4xl font-black tracking-tight ${isVillagerWin ? 'text-indigo-300' : 'text-red-400'}`}>
          {isVillagerWin ? 'ฝ่ายชาวบ้านเป็นผู้ชนะ!' : 'ฝ่ายมนุษย์หมาป่าเป็นผู้ชนะ!'}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto bg-black/30 p-3 rounded-xl border border-white/5">
          {winReason}
        </p>

        {/* Full Roles Table */}
        <div className="my-8 p-6 rounded-2xl bg-black/40 border border-white/5 text-left">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
            เปิดเผยบทบาทของผู้เล่นทุกคน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((p) => {
              const roleInfo = ROLE_DETAILS[p.role];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-purple-950/20 border border-purple-900/30"
                >
                  <div className="flex items-center gap-3">
                    {p.isAlive ? (
                      <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400" title="รอดชีวิต">
                        <Heart className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400" title="เสียชีวิต">
                        <Skull className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <div className="font-semibold text-slate-200 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.isAlive ? 'รอดชีวิต' : 'เสียชีวิต'}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${roleInfo?.badge}`}>
                    {roleInfo?.name || p.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          {isHost ? (
            <button
              onClick={onPlayAgain}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> เล่นใหม่อีกครั้ง (ห้องเดิม)
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic">
              กำลังรอ Host สั่งเริ่มเล่นใหม่อีกครั้ง...
            </div>
          )}

          <button
            onClick={onLeave}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" /> กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};
