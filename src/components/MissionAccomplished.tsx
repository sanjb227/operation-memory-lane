
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

const MissionAccomplished: React.FC = () => {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3";

  const handleAudioPlay = () => {
    setHasStartedAudio(true);
  };

  const celebrateMissionComplete = () => {
    // Create confetti effect
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#00ff00', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 4)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
      `;
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    setTimeout(() => confettiContainer.remove(), 5000);

    setTimeout(() => {
      setShowCelebration(true);
    }, 2000);

    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF4');
    audio.play().catch(() => {}); 

    document.body.style.filter = 'brightness(1.2)';
    setTimeout(() => document.body.style.filter = 'brightness(1)', 100);
  };

  const handleCompleteClick = () => {
    console.log('Mission completed - all objectives achieved');
    celebrateMissionComplete();
  };

  const closeCelebration = () => {
    setShowCelebration(false);
  };

  const handleStartOver = () => {
    // Clear all stored progress and session data
    localStorage.removeItem('treasure_hunt_session');
    
    // Clear any other stored data
    localStorage.clear();
    
    // Reset the page completely
    setShowCelebration(false);
    
    // Force a complete page reload to reset all state
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Agent Info Display */}
      <div className="fixed top-4 left-4 text-green-400 text-xs font-mono opacity-60 z-10 agent-info-bar">
        <div>AGENT: AISHU</div>
        <div>CLEARANCE: ALPHA</div>
        <div>ENCRYPTION: AES-256 ACTIVE</div>
      </div>

      {/* Mission Info Display */}
      <div className="fixed top-4 right-4 text-green-400 text-xs font-mono opacity-60 z-10 agent-info-bar">
        <div>OPERATION: MEMORY LANE</div>
        <div>HANDLER: ONLINE • SECURE CHANNEL</div>
        <div>STATUS: MISSION COMPLETE</div>
      </div>

      <div className="max-w-md w-full space-y-6 page-container">
        <div className="border border-green-400 p-6 bg-black/90 terminal-glow terminal-box">
          <div className="text-lg font-bold mb-4 text-green-300 terminal-text mission-title">
            MISSION ACCOMPLISHED
          </div>
          
          <div className="text-xs leading-relaxed mb-6 terminal-text">
            Transmission from HQ...
          </div>

          <div className="audio-container">
            <AudioPlayer
              src={audioUrl}
              label="MISSION ACCOMPLISHED"
              onPlay={handleAudioPlay}
            />
          </div>

          <button
            onClick={handleCompleteClick}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black border border-green-400 font-bold py-3 px-4 transition-all duration-200 agent-button"
            style={{ opacity: 1, pointerEvents: 'auto' }}
          >
            [COMPLETE MISSION]
          </button>
        </div>
      </div>

      {/* Success Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="text-center border-2 border-green-400 p-8 bg-black/90 terminal-glow success-container">
            <h1 className="success-title font-bold mb-6 text-green-300 glow-text animate-pulse">
              MISSION ACCOMPLISHED
            </h1>
            <p className="success-message mb-4 text-green-400">
              EXCELLENT WORK, AGENT AISHU
            </p>
            <p className="success-message mb-8 text-green-400">
              CONGRATULATIONS ON YOUR GRADUATION!
            </p>
            <div className="button-row">
              <button 
                onClick={closeCelebration}
                className="bg-green-600 hover:bg-green-500 text-black border border-green-400 px-8 py-4 text-lg font-bold font-mono transition-all duration-200 agent-button mr-4"
              >
                MISSION COMPLETE
              </button>
              <button 
                onClick={handleStartOver}
                className="start-over-btn"
              >
                ↻ START OVER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionAccomplished;
