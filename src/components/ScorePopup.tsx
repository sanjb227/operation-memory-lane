
import React, { useEffect } from 'react';

interface ScoreBreakdown {
  timeScore: number;
  lifelinePenalty: number;
  invalidAttemptPenalty: number;
  netScore: number;
  duration: number;
  durationMinutes: number;
}

interface ScorePopupProps {
  score: ScoreBreakdown | null;
  onClose: () => void;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ score, onClose }) => {
  useEffect(() => {
    if (score) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [score, onClose]);

  if (!score) return null;

  return (
    <div className="score-popup">
      <div className="text-center space-y-2">
        <div className="text-green-300 font-bold text-lg">CHECKPOINT COMPLETE</div>
        <div className="text-sm space-y-1">
          <div>⏱️ Time: {Math.floor(score.durationMinutes)}:{String(Math.floor((score.durationMinutes % 1) * 60)).padStart(2, '0')}</div>
          <div className="score-positive">+{score.timeScore} points (Time Score)</div>
          {score.lifelinePenalty > 0 && (
            <div className="score-negative">-{score.lifelinePenalty} points (Lifeline Penalty)</div>
          )}
          {score.invalidAttemptPenalty > 0 && (
            <div className="score-negative">-{score.invalidAttemptPenalty} points (Invalid Attempts)</div>
          )}
          <div className="border-t border-green-400 pt-1 mt-2">
            <div className="font-bold">Total: <span className="score-positive">+{score.netScore} points</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePopup;
