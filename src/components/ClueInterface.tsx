
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
  const [lifelineData, setLifelineData] = useState<{ coordinates: string; briefing: string } | null>(null);
  const [showLifeline, setShowLifeline] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showClueSupport, setShowClueSupport] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onCodeSubmit(inputCode);
      setInputCode('');
      setShowLifeline(false);
      setLifelineData(null);
    }
  };

  const handleLifelineClick = () => {
    const wasUsed = onUseLifeline();
    if (wasUsed) {
      const lifeline = getLifelineText(currentCheckpoint);
      setLifelineData(lifeline);
      setShowLifeline(true);
    }
  };

  const handleClueSupportClick = () => {
    setShowClueSupport(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Brief feedback
      const feedback = document.createElement('div');
      feedback.textContent = 'COORDINATES COPIED';
      feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 0, 0.2);
        color: #00ff00;
        padding: 5px 10px;
        font-family: monospace;
        font-size: 12px;
        border: 1px solid #00ff00;
        z-index: 1000;
      `;
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 1500);
    });
  };

  const clueText = getClueText(currentCheckpoint);
  const isSecondToLast = currentCheckpoint === totalCheckpoints - 2;
  const isCheckpoint4 = currentCheckpoint === 3;

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
        {isCheckpoint4 && isDesktop && (
          <div className="desktop-hint">
            <div className="text-xs font-bold mb-1">DESKTOP ACCESS GRANTED</div>
            <div className="text-xs">PASSWORD: SCI SPY</div>
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

        {/* Clue Support Popup */}
        {showClueSupport && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-yellow-400 p-6 max-w-sm w-full">
              <div className="text-yellow-300 font-bold mb-4 text-center">
                ⚠️ CLUE SUPPORT REQUEST
              </div>
              <div className="text-xs leading-relaxed text-yellow-400 space-y-2">
                <p>If you suspect a clue has been moved or is missing, message Agent San immediately.</p>
                <p>Be prepared to join a video call to resolve the issue.</p>
                <p className="text-red-400 font-bold">DO NOT PROCEED without confirming with Agent San first.</p>
              </div>
              <button
                onClick={() => setShowClueSupport(false)}
                className="mt-4 w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 transition-colors"
              >
                [UNDERSTOOD]
              </button>
            </div>
          </div>
        )}

        {/* Lifeline Popup */}
        {showLifeline && lifelineData && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-red-500 p-6 max-w-sm w-full">
              <div className="text-red-400 font-bold mb-4 text-center">
                🔴 LIFELINE ACTIVATED 🔴
              </div>
              <div className="text-red-300 text-sm font-bold mb-2">
                Agent Support Deployed
              </div>
              
              <div className="mb-4">
                <div className="text-yellow-300 text-xs font-bold mb-1">Coordinates:</div>
                <div 
                  className="bg-gray-900 border border-yellow-400 p-2 text-yellow-200 text-xs font-mono select-all cursor-pointer"
                  onClick={() => copyToClipboard(lifelineData.coordinates)}
                  title="Click to copy coordinates"
                >
                  {lifelineData.coordinates}
                </div>
                <div className="text-xs text-yellow-600 mt-1">Click to copy coordinates</div>
              </div>

              <div className="mb-4">
                <div className="text-green-300 text-xs font-bold mb-1">Mission Briefing:</div>
                <div className="text-green-200 text-xs leading-relaxed">
                  {lifelineData.briefing}
                </div>
              </div>

              <button
                onClick={() => setShowLifeline(false)}
                className="w-full bg-red-600 hover:bg-red-500 text-black font-bold py-2 px-4 transition-colors"
              >
                [CLOSE LIFELINE]
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
          
          {isCheckpoint4 && !isDesktop ? (
            <div className="text-center text-yellow-400">
              <div className="text-lg mb-4">🖥️</div>
              <div className="text-sm font-bold mb-2">DESKTOP ACCESS REQUIRED</div>
              <div className="text-xs leading-relaxed">
                This checkpoint requires a larger screen for security protocols. 
                Access from a desktop or tablet device to continue your mission.
              </div>
            </div>
          ) : (
            <div className="text-xs leading-relaxed whitespace-pre-line">
              {clueText}
            </div>
          )}
        </div>

        {/* Code Input */}
        {(!isCheckpoint4 || isDesktop) && (
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
        )}

        {/* Lifeline Button */}
        <button
          onClick={handleLifelineClick}
          className={`w-full py-2 px-4 border text-sm transition-colors duration-200 ${
            lifelinesRemaining > 0
              ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black'
              : 'border-gray-600 text-gray-600 cursor-not-allowed'
          }`}
          disabled={lifelinesRemaining === 0}
        >
          {lifelinesRemaining > 0 ? '[REQUEST LIFELINE]' : '[NO LIFELINES REMAINING]'}
        </button>

        {/* Clue Missing Support Button */}
        <button
          onClick={handleClueSupportClick}
          className="w-full py-2 px-4 border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black text-sm transition-colors duration-200"
        >
          [CLUE MISSING?]
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
