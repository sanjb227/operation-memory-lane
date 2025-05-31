
import React from 'react';

interface WelcomeScreenProps {
  onBeginMission: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBeginMission }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="border border-green-400 p-8 bg-black/90">
          <div className="text-xl font-bold mb-6 text-green-300">
            CLASSIFIED TRANSMISSION
          </div>
          
          <div className="text-left space-y-4 text-sm leading-relaxed">
            <p>Welcome, Agent Aishu.</p>
            
            <p>We have a situation. Someone's stolen your graduation diploma, and without it, you're officially stuck in university limbo. The only way to get it back? Complete this mission.</p>
            
            <p>No pressure, but… graduation depends on you.</p>
            
            <p>Get ready. Operation Memory Lane is in progress.</p>
          </div>
          
          <button
            onClick={onBeginMission}
            className="mt-8 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-6 transition-colors duration-200 border border-green-400"
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
