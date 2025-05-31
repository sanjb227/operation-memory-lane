
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

const MissionAccomplished: React.FC = () => {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3";

  const handleAudioPlay = () => {
    setHasStartedAudio(true);
  };

  const handleCompleteClick = () => {
    console.log('Mission completed - all objectives achieved');
    // Could add additional completion logic here if needed
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="border border-green-400 p-6 bg-black/90">
          <div className="text-lg font-bold mb-4 text-green-300">
            MISSION ACCOMPLISHED
          </div>
          
          <div className="text-xs leading-relaxed mb-6">
            Transmission from HQ...
          </div>

          <AudioPlayer
            src={audioUrl}
            label="MISSION ACCOMPLISHED"
            onPlay={handleAudioPlay}
          />

          <button
            onClick={handleCompleteClick}
            disabled={!hasStartedAudio}
            className={`mt-6 w-full font-bold py-3 px-4 transition-colors duration-200 border ${
              hasStartedAudio
                ? 'bg-green-600 hover:bg-green-500 text-black border-green-400'
                : 'border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
          >
            [COMPLETE MISSION]
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionAccomplished;
