
import React, { useState } from 'react';
import { getClueText, getLifelineText } from '../utils/clueData';

interface ClueInterfaceProps {
  currentCheckpoint: number;
  lifelinesRemaining: number;
  onCodeSubmit: (code: string) => void;
  onUseLifeline: () => boolean;
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
  const [lifelineText, setLifelineText] = useState('');
  const [showLifeline, setShowLifeline] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onCodeSubmit(inputCode);
      setInputCode('');
      // Clear lifeline text when moving to next checkpoint
      setShowLifeline(false);
      setLifelineText('');
    }
  };

  const handleLifelineClick = () => {
    const wasUsed = onUseLifeline();
    if (wasUsed) {
      const lifeline = getLifelineText(currentCheckpoint);
      setLifelineText(lifeline);
      setShowLifeline(true);
      // No timer - lifeline text stays visible permanently
    }
  };

  const clueText = getClueText(currentCheckpoint);
  const isSecondToLast = currentCheckpoint === totalCheckpoints - 2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Help Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-green-400 border border-green-400 px-2 py-1 text-xs hover:bg-green-400 hover:text-black transition-colors"
          >
            HELP
          </button>
        </div>

        {/* Desktop Hint for Checkpoint 4 Only */}
        {currentCheckpoint === 3 && (
          <div className="desktop-hint">
            <div className="text-xs font-bold mb-1">DESKTOP ACCESS GRANTED</div>
            <div className="text-xs">PASSWORD: LABCOAT</div>
          </div>
        )}

        {/* Help Popup */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-green-400 p-6 max-w-sm w-full">
              <div className="text-green-300 font-bold mb-4 text-center">
                HELP - MISSION INTEL
              </div>
              <div className="text-xs leading-relaxed text-green-400 space-y-2">
                <p>Seriously? You Need Help Already, Agent?</p>
                <p>You'll receive a clue at each step—the first clue is given to you directly.</p>
                <p>Each clue is based on an inside joke or shared memory.</p>
                <p>Most clues are hidden in a small envelope at the location (unless the clue is digital).</p>
                <p>Inside the envelope, you'll find a password.</p>
                <p>Enter the password on the site to unlock your next clue and discover your next location.</p>
                <p>Repeat this process until you reach the final destination, where you'll find one last envelope and enter its password to complete the game and 'graduate.'</p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 transition-colors"
              >
                [CLOSE]
              </button>
            </div>
          </div>
        )}

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
          onClick={handleLifelineClick}
          className={`w-full py-2 px-4 border text-sm transition-colors duration-200 ${
            lifelinesRemaining > 0
              ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
              : 'border-gray-600 text-gray-600 cursor-not-allowed'
          }`}
          disabled={lifelinesRemaining === 0}
        >
          {lifelinesRemaining > 0 ? '[REQUEST LIFELINE]' : '[NO LIFELINES REMAINING]'}
        </button>

        {/* Persistent Lifeline Display */}
        {showLifeline && lifelineText && (
          <div className="border border-yellow-400 bg-yellow-900/20 p-4">
            <div className="text-yellow-300 text-sm font-bold mb-2 text-center">
              LIFELINE ACTIVATED
            </div>
            <div className="text-yellow-200 text-xs leading-relaxed">
              {lifelineText}
            </div>
          </div>
        )}

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
