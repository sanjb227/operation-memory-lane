
import React, { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import MissionBriefing from '../components/MissionBriefing';
import ClueInterface from '../components/ClueInterface';
import Checkpoint7Handler from '../components/Checkpoint7Handler';
import PreFinalCheckpointModal from '../components/PreFinalCheckpointModal';
import MysteriousLanding from '../components/MysteriousLanding';
import SystemMessages from '../components/SystemMessages';
import TimerDisplay from '../components/TimerDisplay';
import ScoreDisplay from '../components/ScoreDisplay';
import FinalScoreDisplay from '../components/FinalScoreDisplay';
import GameRecoveryModal from '../components/GameRecoveryModal';
import AutoFadeNotification, { useNotifications } from '../components/AutoFadeNotification';
import { GamePhase } from '../types/game';
import { useGameState } from '../hooks/useGameState';

const correctCodes = [
  "BAGGAGE CLAIMED",  // Checkpoint 1
  "STAIRWAY SPY",     // Checkpoint 2
  "READ BETWEEN",     // Checkpoint 3
  "TAP SECRET",       // Checkpoint 4
  "SCI SPY",          // Checkpoint 5 - now allowed on mobile
  "BUDDING GENIUS",   // Checkpoint 6
  "MUFFIN MISSION",   // Checkpoint 7
  "ARMCHAIR AGENT"    // Checkpoint 8
];

const Index = () => {
  const [lifelinesRemaining, setLifelinesRemaining] = useState(3);
  const [enteredCodes, setEnteredCodes] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('welcome');
  const [showCheckpoint7Handler, setShowCheckpoint7Handler] = useState(false);
  const [showPreFinalModal, setShowPreFinalModal] = useState(false);
  const [showMysteriousLanding, setShowMysteriousLanding] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const {
    gameState,
    showRecoveryModal,
    calculateFinalScore,
    initializeGame,
    resumeGame,
    startNewGame,
    startGame,
    startCheckpoint,
    completeCheckpoint,
    useLifeline,
    recordInvalidAttempt,
    skipCheckpoint5,
    completeGame,
    resetGame,
    persistGameState
  } = useGameState();

  const { notifications, addNotification, removeNotification, clearAllNotifications } = useNotifications();

  // Initialize game and check for saved state
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer logic
  useEffect(() => {
    let interval: number;
    
    if (isTimerRunning && gameState.checkpointStartTime) {
      interval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.checkpointStartTime!) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isTimerRunning, gameState.checkpointStartTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer when entering clue phase
  useEffect(() => {
    if (currentPhase === 'clue') {
      startCheckpoint(gameState.currentCheckpoint);
      setIsTimerRunning(true);
      setElapsedTime(0);
    } else {
      setIsTimerRunning(false);
    }
  }, [currentPhase, gameState.currentCheckpoint, startCheckpoint]);

  // Auto-save on significant game state changes
  useEffect(() => {
    if (gameState.gameStartTime) {
      persistGameState();
    }
  }, [gameState.currentCheckpoint, gameState.totalScore, gameState.totalLifelinesUsed, persistGameState]);

  const handleMysteriousLanding = () => {
    setShowMysteriousLanding(false);
  };

  const handleBeginMission = () => {
    setCurrentPhase('briefing');
    startGame();
  };

  const handleStartClues = () => {
    setCurrentPhase('clue');
  };

  const handleBackToWelcome = () => {
    setCurrentPhase('welcome');
  };

  const handleCodeSubmit = (code: string): boolean => {
    const trimmedCode = code.trim().toUpperCase();
    const correctCode = correctCodes[gameState.currentCheckpoint];
    
    if (trimmedCode !== correctCode) {
      recordInvalidAttempt();
      addNotification("Invalid Code! -2 points", "error", 2500);
      return false;
    }
    
    // Code is correct
    const points = completeCheckpoint();
    const newEnteredCodes = [...enteredCodes, trimmedCode];
    setEnteredCodes(newEnteredCodes);
    
    setShowSuccessMessage(true);
    addNotification(`+${points} points earned!`, "success", 2500);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
      
      if (gameState.currentCheckpoint < correctCodes.length - 1) {
        const nextCheckpoint = gameState.currentCheckpoint + 1;
        
        if (nextCheckpoint === 6) {
          setShowCheckpoint7Handler(true);
        } else if (nextCheckpoint === 7) {
          setShowPreFinalModal(true);
        } else {
          startCheckpoint(nextCheckpoint);
          setElapsedTime(0);
        }
      } else {
        completeGame();
        setIsTimerRunning(false);
        setCurrentPhase('final');
      }
    }, 2000);
    
    return true;
  };

  const handleUseLifeline = (): boolean => {
    if (lifelinesRemaining > 0) {
      const newLifelines = lifelinesRemaining - 1;
      setLifelinesRemaining(newLifelines);
      useLifeline();
      addNotification("Lifeline used! -3 points", "warning", 2500);
      return true;
    }
    return false;
  };

  const handleSkipCheckpoint5 = () => {
    skipCheckpoint5();
    addNotification("Checkpoint 5 skipped! -5 points", "warning", 2500);
    
    setTimeout(() => {
      const nextCheckpoint = gameState.currentCheckpoint + 1;
      startCheckpoint(nextCheckpoint);
      setElapsedTime(0);
    }, 2000);
  };

  const handleCheckpoint7Continue = () => {
    setShowCheckpoint7Handler(false);
    startCheckpoint(6);
    setElapsedTime(0);
  };

  const handlePreFinalContinue = () => {
    setShowPreFinalModal(false);
    startCheckpoint(7);
    setElapsedTime(0);
  };

  const handleStartOver = () => {
    resetGame();
    setLifelinesRemaining(3);
    setEnteredCodes([]);
    setCurrentPhase('welcome');
    setShowCheckpoint7Handler(false);
    setShowPreFinalModal(false);
    setShowMysteriousLanding(true);
    setShowSuccessMessage(false);
    setElapsedTime(0);
    setIsTimerRunning(false);
    clearAllNotifications();
  };

  const handleResumeGame = () => {
    resumeGame();
    setLifelinesRemaining(3 - gameState.totalLifelinesUsed);
    setCurrentPhase('clue');
    // Don't add the persistent "Game resumed" notification
  };

  const handleStartNewGameFromRecovery = () => {
    startNewGame();
    setLifelinesRemaining(3);
    setEnteredCodes([]);
    setCurrentPhase('welcome');
    setShowCheckpoint7Handler(false);
    setShowPreFinalModal(false);
    setShowMysteriousLanding(true);
    setShowSuccessMessage(false);
    setElapsedTime(0);
    setIsTimerRunning(false);
    clearAllNotifications();
  };

  // Show game recovery modal
  if (showRecoveryModal) {
    return (
      <GameRecoveryModal
        onResume={handleResumeGame}
        onNewGame={handleStartNewGameFromRecovery}
        savedCheckpoint={gameState.currentCheckpoint}
        savedScore={gameState.totalScore}
      />
    );
  }

  // Show final score page
  if (currentPhase === 'final') {
    return (
      <FinalScoreDisplay 
        totalScore={gameState.totalScore}
        totalLifelinesUsed={gameState.totalLifelinesUsed}
        totalInvalidAttempts={gameState.totalInvalidAttempts}
        checkpointScores={gameState.checkpointScores}
        checkpointTimes={gameState.checkpointTimes}
        onStartOver={handleStartOver}
      />
    );
  }

  // Show mysterious landing for new users
  if (showMysteriousLanding) {
    return <MysteriousLanding onProceed={handleMysteriousLanding} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Notification System */}
      <AutoFadeNotification 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      {/* Timer Display */}
      <TimerDisplay elapsedTime={elapsedTime} formatTime={formatTime} isRunning={isTimerRunning} />

      {/* Score Display */}
      <ScoreDisplay 
        currentScore={gameState.totalScore} 
        isVisible={currentPhase === 'clue'} 
      />

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
          currentCheckpoint={gameState.currentCheckpoint}
          lifelinesRemaining={lifelinesRemaining}
          onCodeSubmit={handleCodeSubmit}
          onUseLifeline={handleUseLifeline}
          onSkipCheckpoint5={handleSkipCheckpoint5}
          totalCheckpoints={correctCodes.length}
          showSuccessMessage={showSuccessMessage}
          gameState={gameState}
        />
      )}
    </div>
  );
};

export default Index;
