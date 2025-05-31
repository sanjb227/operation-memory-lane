
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

interface MissionBriefingProps {
  onStartClues: () => void;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ onStartClues }) => {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-briefing-aven.mp3";

  const handleAudioPlay = () => {
    setHasStartedAudio(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
            onClick={onStartClues}
            disabled={!hasStartedAudio}
            className={`mt-6 w-full font-bold py-3 px-4 transition-colors duration-200 border ${
              hasStartedAudio
                ? 'bg-green-600 hover:bg-green-500 text-black border-green-400'
                : 'border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
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
