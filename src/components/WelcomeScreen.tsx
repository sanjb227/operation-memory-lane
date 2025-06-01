
import React from 'react';
import AudioPlayer from './AudioPlayer';

interface WelcomeScreenProps {
  onBeginMission: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBeginMission }) => {
  const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/welcome-transmission.mp3";

  const handleBeginClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Welcome screen - BEGIN MISSION button clicked');
    onBeginMission();
  };

  const handleEmergencySkip = () => {
    console.log('EMERGENCY SKIP - bypassing welcome screen');
    onBeginMission();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
        SKIP AUDIO - START HUNT
      </button>

      <div className="max-w-md w-full text-center space-y-8">
        <div className="border border-green-400 p-8 bg-black/90">
          <div className="text-xl font-bold mb-6 text-green-300">
            CLASSIFIED TRANSMISSION
          </div>
          
          <div className="text-left space-y-4 text-sm leading-relaxed mb-6">
            <p>Welcome, Agent Aishu.</p>
          </div>
          
          <div className="mt-6">
            <AudioPlayer
              src={audioUrl}
              label="CLASSIFIED TRANSMISSION"
            />
          </div>
          
          <button
            onClick={handleBeginClick}
            className="mt-8 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-6 transition-colors duration-200 border border-green-400"
            style={{ opacity: 1, pointerEvents: 'auto' }}
          >
            [BEGIN MISSION]
          </button>
        </div>
        
        <div className="text-xs opacity-60">
          ENCRYPTION LEVEL: MAXIMUM
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
