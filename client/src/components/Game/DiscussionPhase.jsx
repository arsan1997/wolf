import React from 'react';
import { MessageSquare, FastForward, Skull, Heart } from 'lucide-react';
import { Timer } from '../Common/Timer';

export const DiscussionPhase = ({ discussionEndTime, players, me, onSkipDiscussion }) => {
  const alivePlayers = players.filter((p) => p.isAlive);
  const deadPlayers = players.filter((p) => !p.isAlive);
  const isDead = me && !me.isAlive;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Discussion Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#131124] p-6 rounded-3xl border border-purple-900/50 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold mb-2">
            <MessageSquare className="w-4 h-4" /> ช่วงเวลาพูดคุยอภิปราย (Discussion)
          </div>
          <h2 className="text-2xl font-black text-slate-100">ปรึกษาและหาตัวมนุษย์หมาป่า</h2>
          <p className="text-xs text-slate-400 mt-1">
            พูดคุย แลกเปลี่ยนข้อมูล หรือตั้งข้อสงสัยก่อนที่จะลงคะแนนโหวตกำจัด
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Timer targetTime={discussionEndTime} />

          {!isDead && (
            <button
              onClick={onSkipDiscussion}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40 font-semibold text-sm transition-all"
            >
              <FastForward className="w-4 h-4" /> ข้ามช่วงพูดคุย
            </button>
          )}
        </div>
      </div>

      {/* Players Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alive Players */}
        <div className="p-6 rounded-3xl bg-[#131124] border border-purple-900/40">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-base border-b border-emerald-950/60 pb-3">
            <Heart className="w-5 h-5 text-emerald-400" />
            <span>ผู้เล่นที่ยังมีชีวิต ({alivePlayers.length})</span>
          </div>
          <div className="space-y-3">
            {alivePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-200 text-sm">{player.name}</span>
                  {player.id === me?.id && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      คุณ
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-400 font-medium">มีสิทธิ์โหวต</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Players */}
        <div className="p-6 rounded-3xl bg-[#131124] border border-red-900/20">
          <div className="flex items-center gap-2 mb-4 text-red-400 font-bold text-base border-b border-red-950/60 pb-3">
            <Skull className="w-5 h-5 text-red-400" />
            <span>ผู้เสียชีวิต ({deadPlayers.length})</span>
          </div>
          {deadPlayers.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">ยังไม่มีผู้เล่นเสียชีวิต</p>
          ) : (
            <div className="space-y-3">
              {deadPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-red-950/20 border border-red-950/40 opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center text-red-400 font-bold text-xs">
                      <Skull className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-400 line-through text-sm">{player.name}</span>
                  </div>
                  <span className="text-xs text-red-400/80 font-medium">ไม่มีสิทธิ์โหวต</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
