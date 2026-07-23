import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const Timer = ({ targetTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!targetTime) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 15;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md transition-all ${
      isUrgent
        ? 'bg-red-950/60 border-red-500/50 text-red-400 animate-pulse'
        : 'bg-purple-950/50 border-purple-500/30 text-purple-200'
    }`}>
      <Clock className="w-5 h-5 shrink-0" />
      <span className="font-mono text-lg font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
