
const GAME_STORAGE_KEY = 'treasureHunt_gameState';
const SESSION_PREFIX = 'session_';

export interface StoredGameState {
  currentCheckpoint: number;
  totalScore: number;
  checkpointStartTime: number | null;
  gameStartTime: number | null;
  totalLifelinesUsed: number;
  totalInvalidAttempts: number;
  checkpointTimes: number[];
  checkpointScores: number[];
  lifelinesRemaining: number;
  isGameComplete: boolean;
  gameTimer: number;
  sessionId: string;
}

export const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const saveGameState = (gameState: any): void => {
  try {
    const stateToSave: StoredGameState = {
      currentCheckpoint: gameState.currentCheckpoint,
      totalScore: gameState.totalScore,
      checkpointStartTime: gameState.checkpointStartTime,
      gameStartTime: gameState.gameStartTime,
      totalLifelinesUsed: gameState.totalLifelinesUsed,
      totalInvalidAttempts: gameState.totalInvalidAttempts,
      checkpointTimes: gameState.checkpointTimes,
      checkpointScores: gameState.checkpointScores,
      lifelinesRemaining: 3 - gameState.totalLifelinesUsed,
      isGameComplete: gameState.isGameComplete,
      gameTimer: gameState.gameStartTime ? Date.now() - gameState.gameStartTime : 0,
      sessionId: generateSessionId()
    };
    
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(stateToSave));
    console.log('Game state saved successfully');
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const loadGameState = (): StoredGameState | null => {
  try {
    const saved = localStorage.getItem(GAME_STORAGE_KEY);
    if (saved) {
      const gameState = JSON.parse(saved);
      console.log('Game state loaded successfully');
      return gameState;
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
  return null;
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(GAME_STORAGE_KEY);
    console.log('Game state cleared');
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};

export const hasStoredGameState = (): boolean => {
  return localStorage.getItem(GAME_STORAGE_KEY) !== null;
};

export const loadSharedSession = (): StoredGameState | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');
  
  if (sessionId) {
    try {
      const sharedState = localStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
      if (sharedState) {
        return JSON.parse(sharedState);
      }
    } catch (error) {
      console.error('Error loading shared session:', error);
    }
  }
  return null;
};

export const shareSessionAcrossDevices = (gameState: any): string => {
  const sessionId = generateSessionId();
  const stateToShare: StoredGameState = {
    currentCheckpoint: gameState.currentCheckpoint,
    totalScore: gameState.totalScore,
    checkpointStartTime: gameState.checkpointStartTime,
    gameStartTime: gameState.gameStartTime,
    totalLifelinesUsed: gameState.totalLifelinesUsed,
    totalInvalidAttempts: gameState.totalInvalidAttempts,
    checkpointTimes: gameState.checkpointTimes,
    checkpointScores: gameState.checkpointScores,
    lifelinesRemaining: 3 - gameState.totalLifelinesUsed,
    isGameComplete: gameState.isGameComplete,
    gameTimer: gameState.gameStartTime ? Date.now() - gameState.gameStartTime : 0,
    sessionId
  };
  
  try {
    localStorage.setItem(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(stateToShare));
    return `${window.location.origin}?session=${sessionId}`;
  } catch (error) {
    console.error('Error sharing session:', error);
    return window.location.origin;
  }
};
