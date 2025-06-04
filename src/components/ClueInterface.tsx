import React, { useState, useRef, useEffect } from 'react';
import { getClueText, getLifelineText } from '../utils/clueData';

interface ClueInterfaceProps {
  currentCheckpoint: number;
  lifelinesRemaining: number;
  onCodeSubmit: (code: string) => boolean;
  onUseLifeline: () => boolean;
  onSkipCheckpoint5: () => void;
  totalCheckpoints: number;
  showSuccessMessage: boolean;
  gameState: any;
}

const ClueInterface: React.FC<ClueInterfaceProps> = ({
  currentCheckpoint,
  lifelinesRemaining,
  onCodeSubmit,
  onUseLifeline,
  onSkipCheckpoint5,
  totalCheckpoints,
  showSuccessMessage,
  gameState
}) => {
  const [inputCode, setInputCode] = useState('');
  const [lifelineData, setLifelineData] = useState<{ coordinates: string; briefing: string } | null>(null);
  const [showLifeline, setShowLifeline] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showClueSupport, setShowClueSupport] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Desktop detection for checkpoint 5 code display
  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Fix input focus and initialization
  useEffect(() => {
    const initializeInput = () => {
      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.readOnly = false;
        inputRef.current.style.pointerEvents = 'auto';
        inputRef.current.style.opacity = '1';
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    };

    initializeInput();
    const timer = setTimeout(initializeInput, 500);
    return () => clearTimeout(timer);
  }, [currentCheckpoint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputCode.trim()) {
      const isCorrect = onCodeSubmit(inputCode);
      if (isCorrect) {
        setInputCode('');
        setShowLifeline(false);
        setLifelineData(null);
      }
      
      // Re-focus input after submission
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
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

  const clueText = getClueText(currentCheckpoint);
  const isSecondToLast = currentCheckpoint === totalCheckpoints - 2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      {/* Desktop Code Display for Checkpoint 5 */}
      {(currentCheckpoint + 1) === 5 && isDesktop && (
        <div 
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg font-mono text-lg border border-green-400 z-50"
          style={{ 
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '18px',
            border: '1px solid #22c55e'
          }}
        >
          SCI SPY
        </div>
      )}

      <div className="max-w-md w-full space-y-4">
        {/* Help Button */}
        <div className="absolute top-20 left-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-green-400 border border-green-400 px-3 py-2 text-sm hover:bg-green-400 hover:text-black transition-colors"
            style={{ minHeight: '44px', touchAction: 'manipulation' }}
          >
            HELP
          </button>
        </div>

        {/* Help Modal with Scoring Table */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-green-400 p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="text-green-300 font-bold mb-4 text-center">
                HELP - MISSION INTEL
              </div>
              
              <div className="text-xs leading-relaxed text-green-400 space-y-2 mb-6">
                <p>You'll receive a clue at each step—the first clue is given to you directly.</p>
                <p>Most clues are hidden in a small envelope at the location (unless the clue is digital).</p>
                <p>Inside the envelope, you'll find a password.</p>
                <p>Enter the password on the site to unlock your next clue and discover your next location.</p>
                <p>Repeat this process until you reach the final destination.</p>
              </div>

              <div className="scoring-system-section">
                <h3 className="text-green-300 font-bold mb-3">SCORING SYSTEM</h3>
                <table className="scoring-table w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr>
                      <th className="border border-green-400 bg-green-900/20 p-2 text-left font-bold">Action / Event</th>
                      <th className="border border-green-400 bg-green-900/20 p-2 text-left font-bold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-green-400 p-2">Complete checkpoint quickly</td>
                      <td className="border border-green-400 p-2">+10 (≤7 min), +7 (≤10 min), +4 ({'>'}10 min)</td>
                    </tr>
                    <tr>
                      <td className="border border-green-400 p-2">Use a Lifeline</td>
                      <td className="border border-green-400 p-2 text-red-400">-3 points per lifeline</td>
                    </tr>
                    <tr>
                      <td className="border border-green-400 p-2">Enter incorrect code</td>
                      <td className="border border-green-400 p-2 text-red-400">-2 points per error</td>
                    </tr>
                    <tr>
                      <td className="border border-green-400 p-2">Complete mission</td>
                      <td className="border border-green-400 p-2 text-green-300">+10 points (bonus)</td>
                    </tr>
                    <tr>
                      <td className="border border-green-400 p-2">Use no Lifelines</td>
                      <td className="border border-green-400 p-2 text-green-300">+10 points (bonus)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 transition-colors"
                style={{ minHeight: '48px', touchAction: 'manipulation', fontSize: '16px' }}
              >
                [CLOSE]
              </button>
            </div>
          </div>
        )}

        {/* Lifeline Modal */}
        {showLifeline && lifelineData && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-red-500 p-6 max-w-sm w-full">
              <div className="text-red-400 font-bold mb-4 text-center">
                🔴 LIFELINE ACTIVATED 🔴
              </div>
              
              <div className="mb-4">
                <div className="text-yellow-300 text-xs font-bold mb-1">Coordinates:</div>
                <div className="bg-gray-900 border border-yellow-400 p-3 text-yellow-200 text-sm font-mono">
                  {lifelineData.coordinates}
                </div>
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
                style={{ minHeight: '48px', touchAction: 'manipulation', fontSize: '16px' }}
              >
                [CLOSE LIFELINE]
              </button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="text-center text-green-300 mb-4">
          <div className="text-sm font-bold">
            CHECKPOINT {currentCheckpoint + 1} OF {totalCheckpoints}
          </div>
          <div className="text-xs mt-1 opacity-60">
            LIFELINES: {lifelinesRemaining}/3
          </div>
        </div>

        {/* Clue Display */}
        <div className="border border-green-400 p-6 bg-black/90 mb-6">
          <div className="text-green-300 font-bold mb-4 text-center">
            {isSecondToLast ? "FINAL TRANSMISSION" : "ENCRYPTED MESSAGE"}
          </div>
          
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {clueText}
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-900/20 border border-green-400 p-3 text-center mb-4">
            <div className="text-green-300 text-sm font-bold">
              ✓ CODE ACCEPTED - ADVANCING TO NEXT CHECKPOINT
            </div>
          </div>
        )}

        {/* Code Input */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="border border-green-400 p-4 bg-black/90">
            <label className="block text-xs font-bold mb-3 text-green-300">
              ENTER CODE:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full bg-black border-2 border-green-600 text-green-400 px-3 py-3 text-sm font-mono focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300/20 mb-4"
              placeholder="TYPE CODE HERE..."
              maxLength={20}
              style={{ 
                fontSize: '16px', 
                minHeight: '48px',
                touchAction: 'manipulation'
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck="false"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 transition-colors duration-200 border border-green-400 disabled:opacity-50 mb-4"
            disabled={!inputCode.trim()}
            style={{ 
              minHeight: '52px', 
              touchAction: 'manipulation',
              fontSize: '16px'
            }}
          >
            [SUBMIT CODE]
          </button>
        </form>

        {/* Lifeline Button */}
        <button
          onClick={handleLifelineClick}
          className={`w-full py-3 px-4 border text-sm transition-colors duration-200 mb-4 ${
            lifelinesRemaining > 0
              ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black'
              : 'border-gray-600 text-gray-600 cursor-not-allowed'
          }`}
          disabled={lifelinesRemaining === 0}
          style={{ 
            minHeight: '52px', 
            touchAction: 'manipulation',
            fontSize: '16px'
          }}
        >
          {lifelinesRemaining > 0 ? '[REQUEST LIFELINE] (-3 POINTS)' : '[NO LIFELINES REMAINING]'}
        </button>

        {/* Show lifeline again button */}
        {lifelineData && !showLifeline && (
          <button
            onClick={() => setShowLifeline(true)}
            className="w-full py-3 px-4 border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black text-sm transition-colors duration-200 mb-4"
            style={{ 
              minHeight: '52px', 
              touchAction: 'manipulation',
              fontSize: '16px'
            }}
          >
            [VIEW LIFELINE AGAIN]
          </button>
        )}

        {/* Clue Missing Support Button */}
        <button
          onClick={() => setShowClueSupport(true)}
          className="w-full py-3 px-4 border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black text-sm transition-colors duration-200 mb-6"
          style={{ 
            minHeight: '52px', 
            touchAction: 'manipulation',
            fontSize: '16px'
          }}
        >
          [CLUE MISSING?]
        </button>

        {/* Clue Support Modal */}
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
                style={{ minHeight: '48px', touchAction: 'manipulation', fontSize: '16px' }}
              >
                [UNDERSTOOD]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClueInterface;
