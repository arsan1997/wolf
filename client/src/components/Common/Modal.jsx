import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const Modal = ({ isOpen, title, description, onConfirm, onCancel, confirmText = 'ยืนยัน', cancelText = 'ยกเลิก', danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131124] border border-purple-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border shrink-0 ${danger ? 'bg-red-950/60 border-red-500/40 text-red-400' : 'bg-purple-950/60 border-purple-500/40 text-purple-300'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-purple-900/40">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all ${
              danger
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
