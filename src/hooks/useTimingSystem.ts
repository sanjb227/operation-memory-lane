
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

export const useTimingSystem = (sessionId: string, currentCheckpoint: number) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [invalidAttempts, setInvalidAttempts] = useState(0);

  // Timer display
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
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/start', {
        body: { checkpoint, sessionId }
      });

      if (error) throw error;

      if (data.success) {
        const start = new Date(data.startTime);
        setStartTime(start);
        setIsRunning(true);
        setElapsedTime(0);
        setInvalidAttempts(0);
        console.log('Timer started for checkpoint:', checkpoint);
      }
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  }, [sessionId]);

  const validateCode = useCallback(async (code: string, correctCodes: string[], checkpoint: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/attempt', {
        body: { checkpoint, sessionId, code, correctCodes }
      });

      if (error) throw error;

      if (data.success && !data.correct) {
        setInvalidAttempts(prev => prev + 1);
        return { isValid: false, penalty: data.penalty, totalInvalidAttempts: data.totalInvalidAttempts };
      }

      return { isValid: data.correct, penalty: 0 };
    } catch (error) {
      console.error('Error validating code:', error);
      return { isValid: false, penalty: 0 };
    }
  }, [sessionId]);

  const completeCheckpoint = useCallback(async (checkpoint: number, lifelinesUsed: number) => {
    try {
      setIsRunning(false);
      
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/complete', {
        body: { checkpoint, sessionId, lifelinesUsed, invalidAttempts }
      });

      if (error) throw error;

      if (data.success) {
        return data.score as ScoreBreakdown;
      }
    } catch (error) {
      console.error('Error completing checkpoint:', error);
    }
    return null;
  }, [sessionId, invalidAttempts]);

  const recordLifelineUse = useCallback(async (checkpoint: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/lifeline', {
        body: { checkpoint, sessionId }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Error recording lifeline use:', error);
      return false;
    }
  }, [sessionId]);

  const getFinalScore = useCallback(async (): Promise<FinalScoreData | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/final-score', {
        method: 'GET'
      });

      if (error) throw error;

      if (data.success) {
        return data as FinalScoreData;
      }
    } catch (error) {
      console.error('Error getting final score:', error);
    }
    return null;
  }, []);

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
