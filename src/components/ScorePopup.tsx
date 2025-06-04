
import React, { useEffect, useState } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (score) {
      console.log('Score popup received score data:', score);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300); // Allow fade out animation
      }, 4000); // Show for 4 seconds instead of 3
      
      return () => clearTimeout(timer);
    }
  }, [score, onClose]);

  // Enhanced score popup for all scenarios
  useEffect(() => {
    const handleScoreUpdate = (event: any) => {
      console.log('Score popup received score update event:', event.detail);
      
      if (event.detail.points !== undefined && event.detail.reason) {
        // Show immediate feedback popup
        showImmediateScorePopup(event.detail.points, event.detail.reason);
      }
    };

    window.addEventListener('scoreUpdate', handleScoreUpdate);
    return () => window.removeEventListener('scoreUpdate', handleScoreUpdate);
  }, []);

  const showImmediateScorePopup = (points: number, reason: string) => {
    const popup = document.createElement('div');
    popup.className = `fixed top-20 right-4 z-50 transition-all duration-300 transform translate-x-full`;
    
    let colorClass = 'bg-green-900/90 border-green-400 text-green-300';
    if (points < 0) {
      colorClass = 'bg-red-900/90 border-red-400 text-red-300';
    } else if (points === 0) {
      colorClass = 'bg-yellow-900/90 border-yellow-400 text-yellow-300';
    }
    
    popup.innerHTML = `
      <div class="border p-3 rounded ${colorClass}">
        <div class="font-bold text-lg">${points > 0 ? '+' : ''}${points} POINTS</div>
        <div class="text-xs">${reason.toUpperCase()}</div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Animate in
    setTimeout(() => {
      popup.style.transform = 'translate-x-0';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
      popup.style.transform = 'translate-x-full';
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 300);
    }, 2500);
  };

  if (!score) return null;

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="bg-black/95 border-2 border-green-400 p-6 rounded max-w-sm w-full mx-4">
        <div className="text-center space-y-3">
          <div className="text-green-300 font-bold text-xl animate-pulse">
            ✅ CHECKPOINT COMPLETE
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>⏱️ Time:</span>
              <span>{Math.floor(score.durationMinutes)}:{String(Math.floor((score.durationMinutes % 1) * 60)).padStart(2, '0')}</span>
            </div>
            
            <div className="flex justify-between text-green-400">
              <span>Time Score:</span>
              <span>+{score.timeScore} points</span>
            </div>
            
            {score.lifelinePenalty > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Lifeline Penalty:</span>
                <span>-{score.lifelinePenalty} points</span>
              </div>
            )}
            
            {score.invalidAttemptPenalty > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Invalid Attempts:</span>
                <span>-{score.invalidAttemptPenalty} points</span>
              </div>
            )}
            
            <div className="border-t border-green-400 pt-2 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Net Score:</span>
                <span className="text-green-300">+{score.netScore} points</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-green-600 mt-4">
            Advancing to next checkpoint...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePopup;
