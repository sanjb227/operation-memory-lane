
import React from 'react';

interface TimerDisplayProps {
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedTime, formatTime, isRunning }) => {
  if (!isRunning) return null;

  return (
    <div className="fixed top-4 right-4 text-green-400 text-sm font-mono z-50 timer-display" style={{
      top: `max(1rem, env(safe-area-inset-top))`,
      right: `max(1rem, env(safe-area-inset-right))`
    }}>
      <div className="bg-black/80 border border-green-400 px-2 py-1 rounded">
        ⏱️ {formatTime(elapsedTime)}
      </div>
    </div>
  );
};

export default TimerDisplay;
