
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GameProgress {
  session_id: string;
  current_checkpoint: number;
  lifelines_remaining: number;
  completed_checkpoints: string[];
}

export const useGameProgress = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Generate or retrieve session ID
  useEffect(() => {
    const getOrCreateSessionId = () => {
      let storedSessionId = localStorage.getItem('treasure_hunt_session');
      
      if (!storedSessionId) {
        storedSessionId = crypto.randomUUID();
        localStorage.setItem('treasure_hunt_session', storedSessionId);
      }
      
      setSessionId(storedSessionId);
      setIsLoading(false);
    };

    getOrCreateSessionId();
  }, []);

  // Save progress to Supabase
  const saveProgress = async (
    currentCheckpoint: number, 
    lifelinesRemaining: number, 
    completedCheckpoints: string[] = []
  ) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('game_progress')
        .upsert({
          session_id: sessionId,
          current_checkpoint: currentCheckpoint,
          lifelines_remaining: lifelinesRemaining,
          completed_checkpoints: completedCheckpoints,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving progress:', error);
      } else {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Load progress from Supabase
  const loadProgress = async (): Promise<GameProgress | null> => {
    if (!sessionId) return null;

    try {
      const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('Error loading progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  };

  // Clear progress (for testing or reset)
  const clearProgress = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('game_progress')
        .delete()
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error clearing progress:', error);
      } else {
        localStorage.removeItem('treasure_hunt_session');
        console.log('Progress cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  };

  return {
    sessionId,
    isLoading,
    saveProgress,
    loadProgress,
    clearProgress
  };
};
