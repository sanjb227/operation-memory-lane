
import React from 'react';

interface GameRecoveryModalProps {
  onResume: () => void;
  onNewGame: () => void;
  savedCheckpoint: number;
  savedScore: number;
}

const GameRecoveryModal: React.FC<GameRecoveryModalProps> = ({
  onResume,
  onNewGame,
  savedCheckpoint,
  savedScore
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-green-400 p-6 max-w-md w-full">
        <div className="text-green-300 font-bold mb-4 text-center">
          🔄 GAME STATE DETECTED
        </div>
        
        <div className="text-sm text-green-400 mb-6 text-center">
          <p className="mb-2">You have a saved game in progress:</p>
          <div className="bg-gray-900 border border-green-600 p-3 rounded">
            <div>Checkpoint: {savedCheckpoint + 1} of 8</div>
            <div>Current Score: {savedScore}</div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 transition-colors"
            style={{ minHeight: '48px', fontSize: '16px' }}
          >
            ▶️ Resume Game
          </button>
          
          <button
            onClick={onNewGame}
            className="w-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-black py-3 px-4 transition-colors"
            style={{ minHeight: '48px', fontSize: '16px' }}
          >
            🔄 Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRecoveryModal;
