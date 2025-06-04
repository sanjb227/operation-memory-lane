
import React from 'react';

interface ScoreDisplayProps {
  currentScore: number;
  isVisible: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-20 text-green-400 text-sm font-mono z-50" style={{
      top: `max(1rem, env(safe-area-inset-top))`,
      right: `max(5rem, env(safe-area-inset-right) + 4rem)`
    }}>
      <div className="bg-black/80 border border-green-400 px-2 py-1 rounded">
        SCORE: {currentScore}
      </div>
    </div>
  );
};

export default ScoreDisplay;
