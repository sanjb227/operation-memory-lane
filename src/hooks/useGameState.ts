
import { useState, useCallback, useEffect } from 'react';
import { saveGameState, loadGameState, clearGameState, hasStoredGameState, loadSharedSession } from '../utils/sessionStorage';

interface GameState {
  currentCheckpoint: number;
  totalScore: number;
  checkpointStartTime: number | null;
  gameStartTime: number | null;
  totalLifelinesUsed: number;
  totalInvalidAttempts: number;
  checkpointTimes: number[];
  checkpointScores: number[];
  isGameComplete: boolean;
  notifications: Array<{
    id: number;
    message: string;
    type: 'error' | 'success' | 'info' | 'lifeline';
    timestamp: number;
  }>;
}

const initialState: GameState = {
  currentCheckpoint: 0,
  totalScore: 0,
  checkpointStartTime: null,
  gameStartTime: null,
  totalLifelinesUsed: 0,
  totalInvalidAttempts: 0,
  checkpointTimes: [],
  checkpointScores: [],
  isGameComplete: false,
  notifications: []
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const calculateCheckpointScore = useCallback((timeInSeconds: number): number => {
    const minutes = timeInSeconds / 60;
    if (minutes <= 7) return 10;
    if (minutes <= 10) return 7;
    return 4;
  }, []);

  const calculateFinalScore = useCallback((): number => {
    let finalScore = gameState.totalScore;
    if (gameState.isGameComplete) finalScore += 10; // Completion bonus
    if (gameState.totalLifelinesUsed === 0) finalScore += 10; // No lifeline bonus
    return finalScore;
  }, [gameState.totalScore, gameState.isGameComplete, gameState.totalLifelinesUsed]);

  const persistGameState = useCallback(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.gameStartTime && !gameState.isGameComplete) {
        persistGameState();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [gameState.gameStartTime, gameState.isGameComplete, persistGameState]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState.gameStartTime && !gameState.isGameComplete) {
        persistGameState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState.gameStartTime, gameState.isGameComplete, persistGameState]);

  const initializeGame = useCallback(() => {
    // Check for shared session first
    const sharedSession = loadSharedSession();
    if (sharedSession) {
      setGameState({
        currentCheckpoint: sharedSession.currentCheckpoint,
        totalScore: sharedSession.totalScore,
        checkpointStartTime: sharedSession.checkpointStartTime,
        gameStartTime: sharedSession.gameStartTime,
        totalLifelinesUsed: sharedSession.totalLifelinesUsed,
        totalInvalidAttempts: sharedSession.totalInvalidAttempts,
        checkpointTimes: sharedSession.checkpointTimes,
        checkpointScores: sharedSession.checkpointScores,
        isGameComplete: sharedSession.isGameComplete,
        notifications: []
      });
      addNotification("Game resumed from shared session", "info");
      return;
    }

    // Check for local saved state
    if (hasStoredGameState()) {
      setShowRecoveryModal(true);
    }
  }, []);

  const resumeGame = useCallback(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState({
        currentCheckpoint: savedState.currentCheckpoint,
        totalScore: savedState.totalScore,
        checkpointStartTime: savedState.checkpointStartTime,
        gameStartTime: savedState.gameStartTime,
        totalLifelinesUsed: savedState.totalLifelinesUsed,
        totalInvalidAttempts: savedState.totalInvalidAttempts,
        checkpointTimes: savedState.checkpointTimes,
        checkpointScores: savedState.checkpointScores,
        isGameComplete: savedState.isGameComplete,
        notifications: []
      });
      addNotification("Game resumed from where you left off", "info");
    }
    setShowRecoveryModal(false);
  }, []);

  const startNewGame = useCallback(() => {
    clearGameState();
    setGameState(initialState);
    setShowRecoveryModal(false);
  }, []);

  const startGame = useCallback(() => {
    const now = Date.now();
    setGameState(prev => ({
      ...prev,
      gameStartTime: now,
      checkpointStartTime: now
    }));
  }, []);

  const startCheckpoint = useCallback((checkpoint: number) => {
    setGameState(prev => ({
      ...prev,
      currentCheckpoint: checkpoint,
      checkpointStartTime: Date.now()
    }));
  }, []);

  const completeCheckpoint = useCallback((): number => {
    if (!gameState.checkpointStartTime) return 0;
    
    const elapsedTime = (Date.now() - gameState.checkpointStartTime) / 1000;
    const points = calculateCheckpointScore(elapsedTime);
    
    setGameState(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      checkpointTimes: [...prev.checkpointTimes, elapsedTime],
      checkpointScores: [...prev.checkpointScores, points]
    }));
    
    return points;
  }, [gameState.checkpointStartTime, calculateCheckpointScore]);

  const useLifeline = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalScore: prev.totalScore - 3,
      totalLifelinesUsed: prev.totalLifelinesUsed + 1
    }));
  }, []);

  const recordInvalidAttempt = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalScore: prev.totalScore - 2,
      totalInvalidAttempts: prev.totalInvalidAttempts + 1
    }));
  }, []);

  const skipCheckpoint5 = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalScore: prev.totalScore - 5
    }));
  }, []);

  const completeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameComplete: true
    }));
    persistGameState();
  }, [persistGameState]);

  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'info' | 'lifeline') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now()
    };
    
    setGameState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification]
    }));
  }, []);

  const removeNotification = useCallback((id: number) => {
    setGameState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  }, []);

  const resetGame = useCallback(() => {
    clearGameState();
    setGameState(initialState);
  }, []);

  return {
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
    addNotification,
    removeNotification,
    resetGame,
    persistGameState
  };
};
