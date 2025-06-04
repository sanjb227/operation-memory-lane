
import { useState, useCallback } from 'react';

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
    type: 'error' | 'success' | 'info';
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

  const completeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameComplete: true
    }));
  }, []);

  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'info') => {
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
    setGameState(initialState);
  }, []);

  return {
    gameState,
    calculateFinalScore,
    startGame,
    startCheckpoint,
    completeCheckpoint,
    useLifeline,
    recordInvalidAttempt,
    completeGame,
    addNotification,
    removeNotification,
    resetGame
  };
};
