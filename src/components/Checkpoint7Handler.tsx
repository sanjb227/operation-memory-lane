
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

interface Checkpoint7HandlerProps {
  onContinue: () => void;
}

const Checkpoint7Handler: React.FC<Checkpoint7HandlerProps> = ({ onContinue }) => {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  const handleAudioPlay = () => {
    setHasStartedAudio(true);
  };

  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/checkpoint7-handler.mp3";

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full space-y-6">
        <div className="border border-green-400 p-6 bg-black">
          <div className="text-green-300 font-bold mb-4 text-center">
            HANDLER TRANSMISSION
          </div>
          
          <div className="text-xs leading-relaxed text-green-400 mb-6">
            But first, a message from your handler, Aven.
          </div>

          <AudioPlayer
            src={audioUrl}
            label="HANDLER AVEN - CHECKPOINT 7"
            onPlay={handleAudioPlay}
          />

          <button
            onClick={onContinue}
            disabled={!hasStartedAudio}
            className={`mt-6 w-full font-bold py-3 px-4 transition-colors duration-200 border ${
              hasStartedAudio
                ? 'bg-green-600 hover:bg-green-500 text-black border-green-400'
                : 'border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
          >
            [CONTINUE TO CLUE]
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkpoint7Handler;
