
import React, { useState } from 'react';
import { getClueText } from '../utils/clueData';

interface ClueInterfaceProps {
  currentCheckpoint: number;
  lifelinesRemaining: number;
  onCodeSubmit: (code: string) => void;
  onUseLifeline: () => void;
  showError: boolean;
  showSuccess: boolean;
  totalCheckpoints: number;
}

const ClueInterface: React.FC<ClueInterfaceProps> = ({
  currentCheckpoint,
  lifelinesRemaining,
  onCodeSubmit,
  onUseLifeline,
  showError,
  showSuccess,
  totalCheckpoints
}) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onCodeSubmit(inputCode);
      setInputCode('');
    }
  };

  const clueText = getClueText(currentCheckpoint);
  const isSecondToLast = currentCheckpoint === totalCheckpoints - 2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Progress Indicator */}
        <div className="text-center text-green-300">
          <div className="text-sm font-bold">
            CHECKPOINT {currentCheckpoint + 1} OF {totalCheckpoints}
          </div>
          <div className="text-xs mt-1 opacity-60">
            LIFELINES: {lifelinesRemaining}/3
          </div>
        </div>

        {/* Clue Display */}
        <div className="border border-green-400 p-6 bg-black/90">
          <div className="text-green-300 font-bold mb-4 text-center">
            {isSecondToLast ? "FINAL TRANSMISSION" : "ENCRYPTED MESSAGE"}
          </div>
          
          <div className="text-xs leading-relaxed whitespace-pre-line">
            {clueText}
          </div>
        </div>

        {/* Code Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-green-400 p-4 bg-black/90">
            <label className="block text-xs font-bold mb-2 text-green-300">
              ENTER CODE:
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full bg-black border border-green-600 text-green-400 px-3 py-2 text-sm font-mono focus:outline-none focus:border-green-300"
              placeholder="TYPE CODE HERE..."
              maxLength={20}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 transition-colors duration-200 border border-green-400 disabled:opacity-50"
            disabled={!inputCode.trim()}
          >
            [SUBMIT CODE]
          </button>
        </form>

        {/* Lifeline Button */}
        <button
          onClick={onUseLifeline}
          className={`w-full py-2 px-4 border text-sm transition-colors duration-200 ${
            lifelinesRemaining > 0 && currentCheckpoint > 0
              ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
              : 'border-gray-600 text-gray-600 cursor-not-allowed'
          }`}
          disabled={lifelinesRemaining === 0 || currentCheckpoint === 0}
        >
          {lifelinesRemaining > 0 ? '[REQUEST LIFELINE]' : '[NO LIFELINES REMAINING]'}
        </button>

        {/* Status Messages */}
        {showError && (
          <div className="border border-red-500 bg-red-900/20 p-3 text-center">
            <div className="text-red-400 text-sm font-bold">
              ACCESS DENIED - INVALID CODE
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="border border-green-400 bg-green-900/20 p-3 text-center">
            <div className="text-green-300 text-sm font-bold">
              CODE ACCEPTED - ADVANCING TO NEXT CHECKPOINT
            </div>
          </div>
        )}

        <div className="text-center text-xs opacity-40">
          SECURE CONNECTION ESTABLISHED
        </div>
      </div>
    </div>
  );
};

export default ClueInterface;
