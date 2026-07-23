import React from 'react';
import { Vote, Skull, CheckCircle2, AlertCircle } from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';

export const VoteResultPhase = ({ voteResult, players, me, onConfirm }) => {
  const isConfirmed = me?.hasConfirmedVoteResult;
  const { tally, isTie, eliminatedPlayer, message } = voteResult || {};

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="p-8 rounded-3xl bg-[#131124] border border-purple-900/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold mb-4">
          <Vote className="w-4 h-4 text-red-400" /> สรุปผลการโหวต
        </div>

        <h2 className="text-3xl font-black text-slate-100 mb-2">มติชาวบ้านยามกลางวัน</h2>

        {/* Tally Breakdown */}
        <div className="my-6 p-6 rounded-2xl bg-black/40 border border-white/5 text-left">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
            คะแนนโหวตของผู้เล่นแต่ละคน
          </h4>
          <div className="space-y-3">
            {players.filter((p) => p.isAlive || p.id === eliminatedPlayer?.id).map((p) => {
              const voteCount = tally?.[p.id] || 0;
              const isEliminated = p.id === eliminatedPlayer?.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isEliminated
                      ? 'bg-red-950/60 border-red-500/50 text-red-200'
                      : 'bg-purple-950/20 border-purple-900/30 text-slate-200'
                  }`}
                >
                  <span className="font-semibold text-sm">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded-lg border border-white/10">
                      {voteCount} คะแนน
                    </span>
                    {isEliminated && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md font-bold">
                        ถูกกำจัด
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcome Announcement */}
        <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-700">
          {isTie ? (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-950 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-amber-300">ผลคะแนนเสมอ!</h3>
              <p className="text-sm text-slate-300 mt-1">{message}</p>
            </div>
          ) : eliminatedPlayer ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center mb-3 text-red-400">
                <Skull className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-red-400">{eliminatedPlayer.name} ถูกกำจัด!</h3>
              <p className="text-sm text-slate-300 mt-2">
                เปิดเผยบทบาทจริง: <strong className="text-amber-300">{ROLE_DETAILS[eliminatedPlayer.role]?.name || eliminatedPlayer.role}</strong>
              </p>
            </div>
          ) : null}
        </div>

        <div>
          {isConfirmed ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" /> รอดำเนินการต่อ (รอผู้เล่นอื่น)
            </div>
          ) : (
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-purple-950/50 transition-all active:scale-95"
            >
              ดำเนินการต่อเข้าสู่คืนถัดไป &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
