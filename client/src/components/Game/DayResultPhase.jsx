import React from 'react';
import { Sun, Skull, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DayResultPhase = ({ day, nightResult, me, onConfirm }) => {
  const killedPlayer = nightResult?.killedPlayer;
  const saved = nightResult?.saved;
  const isConfirmed = me?.hasConfirmedDayResult;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="p-8 rounded-3xl bg-[#131124] border border-purple-900/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-4">
          <Sun className="w-4 h-4 text-amber-400" /> รุ่งเช้าวันที่ {day}
        </div>

        <h2 className="text-3xl font-black text-slate-100">ประกาศผลการไล่ล่าเมื่อคืนนี้</h2>

        <div className="my-8 p-6 rounded-2xl bg-black/40 border border-white/5">
          {killedPlayer ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center mb-4 text-red-400 animate-bounce-once">
                <Skull className="w-10 h-10" />
              </div>
              <p className="text-slate-400 text-sm">เมื่อคืนนี้มีผู้ถูกสังหาร</p>
              <h3 className="text-2xl font-bold text-red-400 mt-1">{killedPlayer.name}</h3>
              <p className="text-xs text-red-400/80 mt-2 bg-red-950/50 px-3 py-1 rounded-full border border-red-900/50">
                เสียชีวิตและถอนตัวจากการเล่นเกม
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mb-4 text-emerald-400">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-300">ไม่มีผู้เสียชีวิตเมื่อคืนนี้!</h3>
              <p className="text-sm text-emerald-400/80 mt-2">
                {saved ? 'หมอช่วยชีวิตเป้าหมายไว้ได้ทันเวลาพอดี' : 'ทุกคนในหมู่บ้านปลอดภัยดี'}
              </p>
            </div>
          )}
        </div>

        <div>
          {isConfirmed ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" /> รอดำเนินการต่อ (รอผู้เล่นอื่น)
            </div>
          ) : (
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-purple-950/50 transition-all active:scale-95"
            >
              ดำเนินการต่อเข้าสู่ช่วงพูดคุย &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
