
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

  const handleEmergencySkip = () => {
    console.log('EMERGENCY SKIP - bypassing checkpoint 7 handler');
    onContinue();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      {/* EMERGENCY SKIP BUTTON */}
      <button
        onClick={handleEmergencySkip}
        className="emergency-skip"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: '#dc2626',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        SKIP AUDIO - CONTINUE
      </button>

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
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black border border-green-400 font-bold py-3 px-4 transition-colors duration-200"
            style={{ opacity: 1, pointerEvents: 'auto' }}
          >
            [CONTINUE TO CLUE]
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkpoint7Handler;
