
import React, { useState, useRef, useEffect } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Fix input focus and initialization
  useEffect(() => {
    const initializeInput = () => {
      if (inputRef.current) {
        // Ensure input is enabled and focusable
        inputRef.current.disabled = false;
        inputRef.current.readOnly = false;
        inputRef.current.style.pointerEvents = 'auto';
        inputRef.current.style.opacity = '1';
        
        // Force focus after a brief delay
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    };

    initializeInput();
    
    // Re-initialize on checkpoint change
    const timer = setTimeout(initializeInput, 500);
    
    return () => clearTimeout(timer);
  }, [currentCheckpoint]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced mobile detection for Checkpoint 5 (Science Library) with iPhone X optimization
  const isMobileDevice = () => {
    return (
      window.innerWidth < 1024 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      'ontouchstart' in window
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Special handling for Checkpoint 5 (Science Library) - block mobile password entry
    if (currentCheckpoint === 4 && isMobileDevice()) {
      // Show mobile blocked message with iPhone X optimization
      const feedback = document.createElement('div');
      feedback.textContent = '🖥️ DESKTOP ACCESS REQUIRED - This checkpoint must be completed on a desktop computer for security protocols';
      feedback.style.cssText = `
        position: fixed;
        bottom: max(20px, env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 0, 0.2);
        color: #ffff00;
        padding: 12px 16px;
        font-family: monospace;
        font-size: 14px;
        border: 1px solid #ffff00;
        z-index: 1000;
        max-width: calc(90% - ${Math.max(20, parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)')) || 0)}px);
        text-align: center;
        border-radius: 4px;
      `;
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 4000);
      return;
    }
    
    if (inputCode.trim()) {
      console.log('Submitting code:', inputCode);
      onCodeSubmit(inputCode);
      setInputCode('');
      setShowLifeline(false);
      setLifelineData(null);
      
      // Re-focus input after submission
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleLifelineClick = () => {
    console.log('Lifeline requested');
    const wasUsed = onUseLifeline();
    if (wasUsed) {
      const lifeline = getLifelineText(currentCheckpoint);
      setLifelineData(lifeline);
      setShowLifeline(true);
      
      // Show immediate penalty feedback
      const feedback = document.createElement('div');
      feedback.textContent = '🔴 LIFELINE USED: -3 POINTS';
      feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 16px 24px;
        font-family: monospace;
        font-size: 16px;
        border: 2px solid #ff0000;
        z-index: 1000;
        border-radius: 8px;
        text-align: center;
        font-weight: bold;
      `;
      document.body.appendChild(feedback);
      setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
      }, 2000);
    }
  };

  const handleClueSupportClick = () => {
    setShowClueSupport(true);
  };

  // iPhone X optimized copy to clipboard
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback();
      }).catch(() => {
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopyFeedback();
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  };

  const showCopyFeedback = () => {
    const feedback = document.createElement('div');
    feedback.textContent = 'COORDINATES COPIED';
    feedback.style.cssText = `
      position: fixed;
      bottom: max(20px, env(safe-area-inset-bottom));
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 255, 0, 0.2);
      color: #00ff00;
      padding: 8px 12px;
      font-family: monospace;
      font-size: 14px;
      border: 1px solid #00ff00;
      z-index: 1000;
      border-radius: 4px;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1500);
  };

  const clueText = getClueText(currentCheckpoint);
  const isSecondToLast = currentCheckpoint === totalCheckpoints - 2;
  const isCheckpoint5ScienceLibrary = currentCheckpoint === 4; // Science Library at position 4 (0-indexed)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ 
      paddingTop: `max(5rem, env(safe-area-inset-top) + 3rem)`,
      paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
      paddingLeft: `max(1rem, env(safe-area-inset-left))`,
      paddingRight: `max(1rem, env(safe-area-inset-right))`
    }}>
      <div className="max-w-md w-full space-y-4">
        {/* Help Button - iPhone X optimized positioning */}
        <div className="absolute top-20 left-4" style={{
          top: `max(5rem, env(safe-area-inset-top) + 3rem)`,
          left: `max(1rem, env(safe-area-inset-left))`
        }}>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-green-400 border border-green-400 px-3 py-2 text-sm hover:bg-green-400 hover:text-black transition-colors"
            style={{ minHeight: '44px', touchAction: 'manipulation' }}
          >
            HELP
          </button>
        </div>

        {/* Desktop Hint for Checkpoint 5 (Science Library) Only */}
        {isCheckpoint5ScienceLibrary && isDesktop && (
          <div className="bg-green-900/20 border border-green-400 p-3 text-center">
            <div className="text-xs font-bold mb-1 text-green-300">DESKTOP ACCESS GRANTED</div>
            <div className="text-xs text-green-400">PASSWORD: SCI SPY</div>
          </div>
        )}

        {/* Help Popup - iPhone X optimized */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" style={{
            paddingTop: `max(1rem, env(safe-area-inset-top))`,
            paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
            paddingLeft: `max(1rem, env(safe-area-inset-left))`,
            paddingRight: `max(1rem, env(safe-area-inset-right))`
          }}>
            <div className="bg-black border border-green-400 p-6 max-w-sm w-full">
              <div className="text-green-300 font-bold mb-4 text-center">
                HELP - MISSION INTEL
              </div>
              <div className="text-xs leading-relaxed text-green-400 space-y-2">
                <p>Seriously? You Need Help Already, Agent?</p>
                <p>You'll receive a clue at each step—the first clue is given to you directly.</p>
                <p>Most clues are hidden in a small envelope at the location (unless the clue is digital).</p>
                <p>Inside the envelope, you'll find a password.</p>
                <p>Enter the password on the site to unlock your next clue and discover your next location.</p>
                <p>Repeat this process until you reach the final destination, where you'll find one last envelope and enter its password to complete the game and 'graduate.'</p>
                <p className="text-yellow-400 font-bold">P.S. "A wise agent would keep all their envelopes with them."</p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 transition-colors"
                style={{ minHeight: '48px', touchAction: 'manipulation', fontSize: '16px' }}
              >
                [CLOSE]
              </button>
            </div>
          </div>
        )}

        {/* Clue Support Popup - iPhone X optimized */}
        {showClueSupport && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" style={{
            paddingTop: `max(1rem, env(safe-area-inset-top))`,
            paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
            paddingLeft: `max(1rem, env(safe-area-inset-left))`,
            paddingRight: `max(1rem, env(safe-area-inset-right))`
          }}>
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

        {/* Lifeline Popup with navigation back capability */}
        {showLifeline && lifelineData && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" style={{
            paddingTop: `max(1rem, env(safe-area-inset-top))`,
            paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
            paddingLeft: `max(1rem, env(safe-area-inset-left))`,
            paddingRight: `max(1rem, env(safe-area-inset-right))`
          }}>
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
                  className="bg-gray-900 border border-yellow-400 p-3 text-yellow-200 text-sm font-mono cursor-pointer"
                  onClick={() => copyToClipboard(lifelineData.coordinates)}
                  style={{ 
                    minHeight: '44px', 
                    display: 'flex', 
                    alignItems: 'center',
                    touchAction: 'manipulation',
                    userSelect: 'all',
                    WebkitUserSelect: 'all'
                  }}
                  title="Tap to copy coordinates"
                >
                  {lifelineData.coordinates}
                </div>
                <div className="text-xs text-yellow-600 mt-1">Tap to copy coordinates</div>
              </div>

              <div className="mb-4">
                <div className="text-green-300 text-xs font-bold mb-1">Mission Briefing:</div>
                <div className="text-green-200 text-xs leading-relaxed">
                  {lifelineData.briefing}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowLifeline(false)}
                  className="w-full bg-red-600 hover:bg-red-500 text-black font-bold py-2 px-4 transition-colors"
                  style={{ minHeight: '48px', touchAction: 'manipulation', fontSize: '16px' }}
                >
                  [CLOSE LIFELINE]
                </button>
                
                <button
                  onClick={() => setShowLifeline(true)}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white border border-gray-400 py-2 px-4 transition-colors text-sm"
                  style={{ minHeight: '44px', touchAction: 'manipulation' }}
                >
                  [VIEW LIFELINE AGAIN]
                </button>
              </div>
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

        {/* Code Input - Enhanced with better focus management */}
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
              onFocus={(e) => {
                console.log('Input focused');
                e.target.style.backgroundColor = '#000';
                e.target.style.color = '#4ade80';
              }}
              className="w-full bg-black border border-green-600 text-green-400 px-3 py-3 text-sm font-mono focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300/20 mb-4"
              placeholder="TYPE CODE HERE..."
              maxLength={20}
              style={{ 
                fontSize: '16px', 
                minHeight: '48px',
                touchAction: 'manipulation',
                WebkitAppearance: 'none',
                border: '2px solid #16a34a'
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck="false"
              disabled={false}
              readOnly={false}
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

        {/* Lifeline Button - Enhanced with better feedback */}
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

        {/* Show lifeline again button if lifeline was used */}
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

        {/* Clue Missing Support Button - iPhone X optimized */}
        <button
          onClick={handleClueSupportClick}
          className="w-full py-3 px-4 border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black text-sm transition-colors duration-200 mb-6"
          style={{ 
            minHeight: '52px', 
            touchAction: 'manipulation',
            fontSize: '16px'
          }}
        >
          [CLUE MISSING?]
        </button>

        {/* Status Messages */}
        {showError && (
          <div className="border border-red-500 bg-red-900/20 p-3 text-center mb-4">
            <div className="text-red-400 text-sm font-bold">
              ACCESS DENIED - INVALID CODE (-2 POINTS)
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="border border-green-400 bg-green-900/20 p-3 text-center mb-4">
            <div className="text-green-300 text-sm font-bold">
              CODE ACCEPTED - ADVANCING TO NEXT CHECKPOINT
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClueInterface;
