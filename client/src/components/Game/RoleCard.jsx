import React, { useState } from 'react';
import { Moon, Eye, Shield, User, Lock, Unlock, CheckCircle } from 'lucide-react';
import { ROLE_DETAILS, ROLES } from '../../constants/roles';

export const RoleCard = ({ role, isConfirmed, onConfirm }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const roleInfo = ROLE_DETAILS[role] || ROLE_DETAILS[ROLES.VILLAGER];

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case ROLES.WEREWOLF:
        return <Moon className="w-12 h-12 text-red-400" />;
      case ROLES.SEER:
        return <Eye className="w-12 h-12 text-indigo-300" />;
      case ROLES.DOCTOR:
        return <Shield className="w-12 h-12 text-emerald-300" />;
      default:
        return <User className="w-12 h-12 text-slate-300" />;
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-100">บทบาทของคุณ</h2>
        <p className="text-sm text-slate-400 mt-1">บทบาทนี้เป็นความลับเฉพาะคุณเท่านั้น</p>
      </div>

      <div className={`relative p-8 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all duration-500 bg-gradient-to-b ${roleInfo.color}`}>
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-4">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-black/60 transition-all"
            >
              {isRevealed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {isRevealed ? 'ซ่อนบทบาท' : 'แตะเพื่อเปิดเผยบทบาท'}
            </button>
          </div>

          {isRevealed ? (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner mb-4">
                {getRoleIcon(role)}
              </div>
              <h3 className="text-2xl font-bold tracking-wide">{roleInfo.name}</h3>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.badge}`}>
                {roleInfo.teamName}
              </span>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                {roleInfo.description}
              </p>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">กดปุ่มด้านบนเพื่อแอบดูบทบาทของคุณ</p>
            </div>
          )}

          <div className="mt-8 w-full">
            {isConfirmed ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
                <CheckCircle className="w-5 h-5" /> ยืนยันรับทราบบทบาทแล้ว (รอผู้เล่นอื่น)
              </div>
            ) : (
              <button
                onClick={onConfirm}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-purple-950/50 active:scale-95 transition-all"
              >
                ฉันเข้าใจบทบาทนี้แล้ว
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
