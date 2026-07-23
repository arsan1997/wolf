import React, { useState } from 'react';
import { Moon, LogIn, PlusCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { getStoredPlayerName, setStoredPlayerName } from '../utils/storage';

export const Home = ({ onCreateRoom, onJoinRoom, isConnected, isLoading }) => {
  const [playerName, setPlayerName] = useState(getStoredPlayerName());
  const [roomCode, setRoomCode] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setFormError('กรุณากรอกชื่อผู้เล่น');
      return;
    }
    setFormError('');
    setStoredPlayerName(playerName);
    onCreateRoom(playerName);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setFormError('กรุณากรอกชื่อผู้เล่น');
      return;
    }
    if (!roomCode.trim()) {
      setFormError('กรุณากรอกรหัสห้อง');
      return;
    }
    setFormError('');
    setStoredPlayerName(playerName);
    onJoinRoom(roomCode.toUpperCase(), playerName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900 border-2 border-purple-500/40 flex items-center justify-center shadow-2xl animate-moon-glow mx-auto">
              <Moon className="w-12 h-12 text-purple-300" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-wider bg-gradient-to-r from-purple-300 via-indigo-200 to-red-400 bg-clip-text text-transparent">
            WEREWOLF
          </h1>
          <p className="text-xs tracking-widest text-slate-400 mt-1 uppercase font-semibold">
            Real-Time Online Browser Game
          </p>

          {/* Connection Status Badge */}
          <div className="mt-3 flex items-center justify-center">
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" /> พร้อม เชื่อมต่อเซิร์ฟเวอร์เรียบร้อย
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" /> กำลังเชื่อมต่อเซิร์ฟเวอร์...
              </span>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="p-8 rounded-3xl bg-[#131124]/90 border border-purple-900/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>

          {formError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-medium text-center">
              {formError}
            </div>
          )}

          {/* Player Name Input */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
              ชื่อผู้เล่นของคุณ
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="เช่น หมาป่าเดียวดาย"
              maxLength={15}
              className="w-full px-4 py-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm font-medium transition-all"
            />
          </div>

          <div className="space-y-4 pt-2">
            {/* Create Room Button */}
            <button
              onClick={handleCreate}
              disabled={!isConnected || isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 group ${
                isConnected && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/50 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> กำลังสร้างห้อง...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  สร้างห้องใหม่ (Create Room)
                </>
              )}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-purple-900/50"></div>
              <span className="px-3 text-xs text-slate-500 uppercase tracking-wider">หรือเข้าร่วมห้อง</span>
              <div className="flex-1 border-t border-purple-900/50"></div>
            </div>

            {/* Join Room Input & Button */}
            <form onSubmit={handleJoin} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="กรอกรหัสห้อง 6 หลัก (เช่น A7K9XZ)"
                  maxLength={6}
                  className="w-full px-4 py-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-slate-100 uppercase tracking-widest placeholder-slate-500 placeholder:normal-case focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-center font-mono font-bold text-lg transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!isConnected || isLoading}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isConnected && !isLoading
                    ? 'bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-800/50 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> กำลังเข้าร่วมห้อง...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> เข้าร่วมห้อง (Join Room)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>เกมรองรับผู้เล่น 5–6 คนออนไลน์พร้อมกันในเบราว์เซอร์</p>
        </div>
      </div>
    </div>
  );
};
