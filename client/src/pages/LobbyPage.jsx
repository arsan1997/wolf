import React, { useState } from 'react';
import { Copy, Check, Play, LogOut, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PlayerList } from '../components/Lobby/PlayerList';

export const LobbyPage = ({ room, me, onToggleReady, onStartGame, onLeaveRoom, onShowToast }) => {
  const [copied, setCopied] = useState(false);

  const players = room?.players || [];
  const isHost = me?.isHost;
  const isReady = me?.isReady;

  const playerCount = players.length;
  const canStart = isHost && playerCount >= 5 && playerCount <= 6 && players.every((p) => p.isReady);

  const handleCopyCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      if (onShowToast) onShowToast('คัดลอกรหัสห้องแล้ว', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto flex flex-col justify-between">
      <div>
        {/* Top Room Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#131124]/90 border border-purple-900/40 shadow-2xl backdrop-blur-xl mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-950 border border-purple-500/30 text-purple-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">รหัสห้อง</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 font-mono border border-purple-800">
                  {playerCount}/6 ผู้เล่น
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black font-mono tracking-widest text-slate-100">{room?.id}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-purple-300 hover:text-white transition-all"
                  title="คัดลอกรหัสห้อง"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onLeaveRoom}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-red-900/50 bg-red-950/30 hover:bg-red-900/40 text-red-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> ออกจากห้อง
            </button>
          </div>
        </div>

        {/* Requirements Notification */}
        {playerCount < 5 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>เกมต้องการผู้เล่นอย่างน้อย 5 คนเพื่อเริ่มเล่น (ปัจจุบันมี {playerCount} คน)</span>
          </div>
        )}

        {/* Players Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            รายชื่อผู้เล่นในห้อง
          </h3>
          <PlayerList players={players} currentUserId={me?.id} maxPlayers={6} />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-6 rounded-3xl bg-[#131124]/90 border border-purple-900/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-xs text-slate-400">
          {isHost ? (
            <span>คุณเป็น Host: ควบคุมการเริ่มเกมเมื่อผู้เล่นทุกคนกดพร้อม</span>
          ) : (
            <span>กดปุ่ม "พร้อม" เมื่อคุณเตรียมตัวเสร็จสิ้น</span>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {!isHost && (
            <button
              onClick={onToggleReady}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isReady
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/50'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isReady ? 'พร้อมแล้ว (กดอีกครั้งเพื่อยกเลิก)' : 'กดพร้อมเล่น'}
            </button>
          )}

          {isHost && (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                canStart
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white shadow-purple-950/50 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              เริ่มเกม (Start Game)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
