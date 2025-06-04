
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScoreBreakdown {
  timeScore: number;
  lifelinePenalty: number;
  invalidAttemptPenalty: number;
  netScore: number;
  duration: number;
  durationMinutes: number;
}

interface AgentRank {
  min: number;
  max: number;
  title: string;
  color: string;
}

interface FinalScoreData {
  totalScore: number;
  agentRank: AgentRank;
  breakdown: any[];
  totalLifelinesUsed: number;
  totalInvalidAttempts: number;
  noLifelineBonus: number;
  perfectCodeBonus: number;
  completionBonus: number;
}

// Helper function to emit score update events
const emitScoreUpdate = (newScore?: number, points?: number, reason?: string) => {
  const event = new CustomEvent('scoreUpdate', {
    detail: { newScore, points, reason }
  });
  window.dispatchEvent(event);
};

export const useTimingSystem = (sessionId: string, currentCheckpoint: number) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [invalidAttempts, setInvalidAttempts] = useState(0);

  // Timer display with proper typing
  useEffect(() => {
    let interval: number;
    
    if (isRunning && startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCheckpointTimer = useCallback(async (checkpoint: number) => {
    try {
      console.log('Starting checkpoint timer for:', checkpoint);
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/start', {
        body: { checkpoint, sessionId }
      });

      if (error) {
        console.error('Error starting timer:', error);
        throw error;
      }

      if (data.success) {
        const start = new Date(data.startTime);
        setStartTime(start);
        setIsRunning(true);
        setElapsedTime(0);
        setInvalidAttempts(0);
        console.log('Timer started successfully for checkpoint:', checkpoint);
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      // Fallback: start local timer
      setStartTime(new Date());
      setIsRunning(true);
      setElapsedTime(0);
      setInvalidAttempts(0);
    }
  }, [sessionId]);

  const validateCode = useCallback(async (code: string, correctCodes: string[], checkpoint: number) => {
    try {
      console.log('Validating code:', { code, checkpoint });
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/attempt', {
        body: { checkpoint, sessionId, code, correctCodes }
      });

      if (error) {
        console.error('Error validating code:', error);
        throw error;
      }

      if (data.success && !data.correct) {
        setInvalidAttempts(prev => prev + 1);
        console.log('Invalid attempt recorded, penalty applied:', data.penalty);
        
        // Emit score update for penalty
        emitScoreUpdate(undefined, data.penalty, 'Invalid Code');
        
        return { isValid: false, penalty: data.penalty, totalInvalidAttempts: data.totalInvalidAttempts };
      }

      console.log('Code validation result:', data.correct);
      return { isValid: data.correct, penalty: 0 };
    } catch (error) {
      console.error('Error validating code:', error);
      return { isValid: false, penalty: 0 };
    }
  }, [sessionId]);

  const completeCheckpoint = useCallback(async (checkpoint: number, lifelinesUsed: number) => {
    try {
      console.log('Completing checkpoint:', { checkpoint, lifelinesUsed, invalidAttempts });
      setIsRunning(false);
      
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/complete', {
        body: { checkpoint, sessionId, lifelinesUsed, invalidAttempts }
      });

      if (error) {
        console.error('Error completing checkpoint:', error);
        throw error;
      }

      if (data.success) {
        console.log('Checkpoint completed successfully, score:', data.score);
        
        // Emit score update for checkpoint completion
        emitScoreUpdate(undefined, data.score.netScore, `Checkpoint ${checkpoint + 1} Complete`);
        
        return data.score as ScoreBreakdown;
      }
    } catch (error) {
      console.error('Error completing checkpoint:', error);
      // Return fallback score
      return {
        timeScore: 5,
        lifelinePenalty: 0,
        invalidAttemptPenalty: 0,
        netScore: 5,
        duration: elapsedTime,
        durationMinutes: elapsedTime / 60
      } as ScoreBreakdown;
    }
    return null;
  }, [sessionId, invalidAttempts, elapsedTime]);

  const recordLifelineUse = useCallback(async (checkpoint: number) => {
    try {
      console.log('Recording lifeline use for checkpoint:', checkpoint);
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/lifeline', {
        body: { checkpoint, sessionId }
      });

      if (error) {
        console.error('Error recording lifeline use:', error);
        throw error;
      }

      if (data.success) {
        console.log('Lifeline use recorded successfully, penalty:', data.penalty);
        
        // Emit score update for lifeline penalty
        emitScoreUpdate(undefined, data.penalty, 'Lifeline Used');
        
        return data.success;
      }
    } catch (error) {
      console.error('Error recording lifeline use:', error);
    }
    return false;
  }, [sessionId]);

  const getFinalScore = useCallback(async (): Promise<FinalScoreData | null> => {
    try {
      console.log('Getting final score for session:', sessionId);
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/final-score', {
        method: 'GET'
      });

      if (error) {
        console.error('Error getting final score:', error);
        throw error;
      }

      if (data.success) {
        console.log('Final score retrieved successfully:', data);
        return data as FinalScoreData;
      }
    } catch (error) {
      console.error('Error getting final score:', error);
    }
    return null;
  }, [sessionId]);

  return {
    elapsedTime,
    formatTime,
    isRunning,
    invalidAttempts,
    startCheckpointTimer,
    validateCode,
    completeCheckpoint,
    recordLifelineUse,
    getFinalScore
  };
};
