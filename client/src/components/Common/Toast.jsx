import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    error: 'bg-red-950/90 border-red-500/50 text-red-200',
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    info: 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-bounce-once">
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${bgColors[toast.type] || bgColors.info}`}>
        {icons[toast.type] || icons.info}
        <p className="flex-1 text-sm font-medium">{toast.message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
