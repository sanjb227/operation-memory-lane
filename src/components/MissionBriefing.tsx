
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

interface MissionBriefingProps {
  onStartClues: () => void;
  onBackToWelcome?: () => void;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ onStartClues, onBackToWelcome }) => {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-briefing-aven.mp3";

  const handleAudioPlay = () => {
    setHasStartedAudio(true);
  };

  const handleProceed = () => {
    onStartClues();
  };

  const handleBackClick = () => {
    if (onBackToWelcome) {
      onBackToWelcome();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Back Button */}
      {onBackToWelcome && (
        <button
          onClick={handleBackClick}
          className="fixed top-5 left-5 bg-green-900/30 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-4 py-2 text-sm font-mono transition-colors z-50"
        >
          ← BACK TO CLASSIFIED
        </button>
      )}

      <div className="max-w-md w-full space-y-6">
        <div className="border border-green-400 p-6 bg-black/90">
          <div className="text-lg font-bold mb-4 text-green-300">
            MISSION BRIEFING - HANDLER AVEN
          </div>
          
          <div className="text-xs leading-relaxed space-y-3 mb-6">
            <p>Incoming transmission from Handler Aven...</p>
          </div>

          <div className="mt-6">
            <AudioPlayer
              src={audioUrl}
              label="MISSION BRIEFING - HANDLER AVEN"
              onPlay={handleAudioPlay}
            />
          </div>
          
          <button
            onClick={handleProceed}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black border border-green-400 font-bold py-3 px-4 transition-colors duration-200"
            style={{ opacity: 1, pointerEvents: 'auto' }}
          >
            [PROCEED TO FIRST CLUE]
          </button>
        </div>
        
        <div className="text-center text-xs opacity-60">
          HANDLER: AVEN • CLEARANCE: ALPHA
        </div>
      </div>
    </div>
  );
};

export default MissionBriefing;
