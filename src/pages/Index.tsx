
import React, { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import MissionBriefing from '../components/MissionBriefing';
import ClueInterface from '../components/ClueInterface';
import Checkpoint7Handler from '../components/Checkpoint7Handler';
import PreFinalCheckpointModal from '../components/PreFinalCheckpointModal';
import MissionAccomplished from '../components/MissionAccomplished';
import MysteriousLanding from '../components/MysteriousLanding';
import SystemMessages from '../components/SystemMessages';
import TimerDisplay from '../components/TimerDisplay';
import ScorePopup from '../components/ScorePopup';
import InvalidAttemptPopup from '../components/InvalidAttemptPopup';
import FinalScoreDisplay from '../components/FinalScoreDisplay';
import ScoreHeader from '../components/ScoreHeader';
import { GamePhase } from '../types/game';
import { useGameProgress } from '../hooks/useGameProgress';
import { useTimingSystem } from '../hooks/useTimingSystem';

const correctCodes = [
  "BAGGAGE CLAIMED",  // Checkpoint 1 - Bag
  "STAIRWAY SPY",     // Checkpoint 2 - IOE Stairs
  "READ BETWEEN",     // Checkpoint 3 - Waterstones
  "TAP SECRET",       // Checkpoint 4 - Torrington Place 1-19
  "SCI SPY",          // Checkpoint 5 - Science Library
  "BUDDING GENIUS",   // Checkpoint 6 - Gordon Square Gardens
  "MUFFIN MISSION",   // Checkpoint 7 - Print Room Cafe
  "ARMCHAIR AGENT"    // Checkpoint 8 - Student Centre
];

const Index = () => {
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [lifelinesRemaining, setLifelinesRemaining] = useState(3);
  const [enteredCodes, setEnteredCodes] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('welcome');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckpoint7Handler, setShowCheckpoint7Handler] = useState(false);
  const [showPreFinalModal, setShowPreFinalModal] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [showMysteriousLanding, setShowMysteriousLanding] = useState(true);
  const [scorePopupData, setScorePopupData] = useState<any>(null);
  const [showInvalidAttempt, setShowInvalidAttempt] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);

  const { sessionId, isLoading, saveProgress, loadProgress } = useGameProgress();
  const {
    elapsedTime,
    formatTime,
    isRunning,
    invalidAttempts,
    startCheckpointTimer,
    validateCode,
    completeCheckpoint,
    recordLifelineUse
  } = useTimingSystem(sessionId || '', currentCheckpoint);

  // Load saved progress on component mount (only once)
  useEffect(() => {
    const initializeProgress = async () => {
      if (isLoading || progressLoaded) return;

      console.log('Initializing progress...');
      const savedProgress = await loadProgress();
      
      if (savedProgress) {
        console.log('Restoring saved progress:', savedProgress);
        setCurrentCheckpoint(savedProgress.current_checkpoint);
        setLifelinesRemaining(savedProgress.lifelines_remaining);
        setEnteredCodes(savedProgress.completed_checkpoints);
        
        setShowMysteriousLanding(false);
        
        if (savedProgress.current_checkpoint >= correctCodes.length) {
          setShowFinalScore(true);
        } else if (savedProgress.current_checkpoint > 0) {
          setCurrentPhase('clue');
        } else {
          setCurrentPhase('welcome');
        }
      } else {
        console.log('No saved progress found, starting fresh');
        setCurrentPhase('welcome');
      }
      
      setProgressLoaded(true);
    };

    initializeProgress();
  }, [isLoading, loadProgress, progressLoaded]);

  // Start timer when entering clue phase
  useEffect(() => {
    if (currentPhase === 'clue' && sessionId && progressLoaded) {
      startCheckpointTimer(currentCheckpoint);
    }
  }, [currentPhase, currentCheckpoint, sessionId, progressLoaded, startCheckpointTimer]);

  // Monitor phase changes for debugging
  useEffect(() => {
    console.log('Current phase changed to:', currentPhase);
  }, [currentPhase]);

  // Add agent feedback system
  useEffect(() => {
    const addAgentFeedback = () => {
      document.querySelectorAll('button').forEach(btn => {
        const existingHandler = btn.onclick;
        btn.onclick = (e) => {
          // Brief screen flash
          document.body.style.filter = 'brightness(1.2)';
          setTimeout(() => document.body.style.filter = 'brightness(1)', 100);
          
          // Show command executed feedback
          const feedback = document.createElement('div');
          feedback.textContent = 'COMMAND EXECUTED';
          feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 0, 0.2);
            color: #00ff00;
            padding: 5px 10px;
            font-family: monospace;
            font-size: 14px;
            border: 1px solid #00ff00;
            z-index: 1000;
          `;
          
          document.body.appendChild(feedback);
          setTimeout(() => feedback.remove(), 1500);

          if (existingHandler) {
            existingHandler.call(btn, e);
          }
        };
      });
    };

    // Add feedback to buttons after a short delay to ensure they're rendered
    const timeout = setTimeout(addAgentFeedback, 1000);
    return () => clearTimeout(timeout);
  }, [currentPhase]);

  const handleMysteriousLanding = () => {
    setShowMysteriousLanding(false);
  };

  const handleBeginMission = () => {
    console.log('BEGIN MISSION clicked - current phase:', currentPhase);
    console.log('Setting phase to briefing...');
    setCurrentPhase('briefing');
    
    if (sessionId && progressLoaded) {
      saveProgress(0, 3, []);
    }
  };

  const handleStartClues = () => {
    console.log('START CLUES clicked - setting phase to clue');
    setCurrentPhase('clue');
  };

  const handleBackToWelcome = () => {
    console.log('BACK TO WELCOME clicked - returning to welcome screen');
    setCurrentPhase('welcome');
  };

  const handleCodeSubmit = async (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    
    console.log('Code submitted:', trimmedCode, 'Expected:', correctCodes[currentCheckpoint]);
    
    // Validate code with timing system
    const validation = await validateCode(trimmedCode, correctCodes, currentCheckpoint);
    
    if (!validation.isValid) {
      setShowInvalidAttempt(true);
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // Code is correct
    const newEnteredCodes = [...enteredCodes, trimmedCode];
    setEnteredCodes(newEnteredCodes);
    setShowSuccess(true);
    setShowError(false);
    
    // Complete checkpoint and get score
    const scoreData = await completeCheckpoint(currentCheckpoint, 3 - lifelinesRemaining);
    if (scoreData) {
      setScorePopupData(scoreData);
    }
    
    setTimeout(() => {
      setShowSuccess(false);
      if (currentCheckpoint < correctCodes.length - 1) {
        const nextCheckpoint = currentCheckpoint + 1;
        
        if (nextCheckpoint === 6) {
          setShowCheckpoint7Handler(true);
          if (sessionId && progressLoaded) {
            saveProgress(nextCheckpoint, lifelinesRemaining, newEnteredCodes);
          }
        }
        else if (nextCheckpoint === 7) {
          setShowPreFinalModal(true);
          if (sessionId && progressLoaded) {
            saveProgress(nextCheckpoint, lifelinesRemaining, newEnteredCodes);
          }
        } else {
          setCurrentCheckpoint(nextCheckpoint);
          if (sessionId && progressLoaded) {
            saveProgress(nextCheckpoint, lifelinesRemaining, newEnteredCodes);
          }
        }
      } else {
        setShowFinalScore(true);
        if (sessionId && progressLoaded) {
          saveProgress(correctCodes.length, lifelinesRemaining, newEnteredCodes);
        }
      }
    }, 2000);
  };

  const handleUseLifeline = (): boolean => {
    if (lifelinesRemaining > 0) {
      const newLifelines = lifelinesRemaining - 1;
      setLifelinesRemaining(newLifelines);
      
      // Record lifeline use in background
      if (sessionId && progressLoaded) {
        recordLifelineUse(currentCheckpoint);
        saveProgress(currentCheckpoint, newLifelines, enteredCodes);
      }
      
      return true;
    }
    return false;
  };

  const handleCheckpoint7Continue = () => {
    console.log('Checkpoint 7 handler - continuing to clue');
    setShowCheckpoint7Handler(false);
    setCurrentCheckpoint(6);
  };

  const handlePreFinalContinue = () => {
    console.log('Pre-final checkpoint - continuing to final clue');
    setShowPreFinalModal(false);
    setCurrentCheckpoint(7);
  };

  const handleStartOver = () => {
    // Clear all stored progress and session data
    localStorage.removeItem('treasure_hunt_session');
    localStorage.clear();
    
    // Reset all state
    setCurrentCheckpoint(0);
    setLifelinesRemaining(3);
    setEnteredCodes([]);
    setCurrentPhase('welcome');
    setShowError(false);
    setShowSuccess(false);
    setShowCheckpoint7Handler(false);
    setShowPreFinalModal(false);
    setProgressLoaded(false);
    setShowMysteriousLanding(true);
    setScorePopupData(null);
    setShowInvalidAttempt(false);
    setShowFinalScore(false);
    
    // Force a complete page reload
    window.location.replace('/');
  };

  // Show loading while progress is being loaded
  if (isLoading || !progressLoaded) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-300 text-lg font-bold mb-2">
            INITIALIZING SECURE CONNECTION...
          </div>
          <div className="text-xs opacity-60">
            SESSION ID: {sessionId || 'GENERATING...'}
          </div>
        </div>
      </div>
    );
  }

  // Show final score page
  if (showFinalScore) {
    return <FinalScoreDisplay sessionId={sessionId || ''} onStartOver={handleStartOver} />;
  }

  // Show mysterious landing for new users
  if (showMysteriousLanding) {
    return <MysteriousLanding onProceed={handleMysteriousLanding} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Timer Display */}
      <TimerDisplay elapsedTime={elapsedTime} formatTime={formatTime} isRunning={isRunning} />

      {/* Score Popup */}
      <ScorePopup score={scorePopupData} onClose={() => setScorePopupData(null)} />

      {/* Invalid Attempt Popup */}
      <InvalidAttemptPopup show={showInvalidAttempt} onClose={() => setShowInvalidAttempt(false)} />

      {/* UCL Logo Watermark */}
      <div className="fixed top-4 right-4 opacity-20 text-green-600 text-sm font-bold z-10">
        UCL
      </div>

      {/* System Messages Component */}
      <SystemMessages />

      {/* Mission Timer */}
      <div className="fixed bottom-4 left-4 text-green-400 text-xs font-mono opacity-60 z-10">
        <div>MISSION TIMER: {Math.floor(Date.now() / 1000) % 86400} SEC</div>
        <div>LOCATION: CLASSIFIED</div>
      </div>

      {/* Checkpoint 7 Handler Modal */}
      {showCheckpoint7Handler && (
        <Checkpoint7Handler onContinue={handleCheckpoint7Continue} />
      )}

      {/* Pre-Final Checkpoint Modal */}
      {showPreFinalModal && (
        <PreFinalCheckpointModal onProceed={handlePreFinalContinue} />
      )}

      {currentPhase === 'welcome' && (
        <WelcomeScreen onBeginMission={handleBeginMission} />
      )}
      
      {currentPhase === 'briefing' && (
        <MissionBriefing 
          onStartClues={handleStartClues} 
          onBackToWelcome={handleBackToWelcome}
        />
      )}
      
      {currentPhase === 'clue' && (
        <ClueInterface
          currentCheckpoint={currentCheckpoint}
          lifelinesRemaining={lifelinesRemaining}
          onCodeSubmit={handleCodeSubmit}
          onUseLifeline={handleUseLifeline}
          showError={showError}
          showSuccess={showSuccess}
          totalCheckpoints={correctCodes.length}
        />
      )}

      {currentPhase === 'final' && (
        <MissionAccomplished />
      )}
    </div>
  );
};

export default Index;
