import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScoreHeaderProps {
  sessionId: string;
  currentCheckpoint: number;
}

const ScoreHeader: React.FC<ScoreHeaderProps> = ({ sessionId, currentCheckpoint }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);

  const loadCurrentScore = async () => {
    if (!sessionId) return;

    try {
      console.log('Loading current score for session:', sessionId);
      const { data, error } = await supabase.functions.invoke('checkpoint-timing/current-score', {
        method: 'GET'
      });

      if (error) {
        console.error('Error loading current score:', error);
        return;
      }

      if (data.success) {
        console.log('Current score loaded:', data.currentScore);
        setCurrentScore(data.currentScore);
        setCheckpoints(data.checkpoints || []);
      }
    } catch (error) {
      console.error('Error fetching current score:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentScore();
    
    // Reload score every 5 seconds to keep it fresh
    const interval = setInterval(loadCurrentScore, 5000);
    
    return () => clearInterval(interval);
  }, [sessionId]);

  // Listen for score updates via custom events
  useEffect(() => {
    const handleScoreUpdate = (event: any) => {
      console.log('Score update event received:', event.detail);
      if (event.detail.newScore !== undefined) {
        setCurrentScore(event.detail.newScore);
      } else {
        loadCurrentScore(); // Refresh from backend
      }
    };

    window.addEventListener('scoreUpdate', handleScoreUpdate);
    return () => window.removeEventListener('scoreUpdate', handleScoreUpdate);
  }, []);

  if (loading && currentScore === 0) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-black/90 border-b border-green-400 p-3 z-40">
        <div className="text-green-400 text-sm font-mono text-center">
          LOADING MISSION SCORE...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 border-b border-green-400 p-3 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-green-300 font-bold text-sm">
            MISSION SCORE:
          </div>
          <div className="text-green-400 font-mono text-lg font-bold">
            {currentScore}
          </div>
          <div className="text-green-600 text-xs">
            CHECKPOINT {currentCheckpoint + 1}/8
          </div>
        </div>
        
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-green-400 text-xs hover:text-green-300 transition-colors"
        >
          {showBreakdown ? 'HIDE' : 'DETAILS'}
        </button>
      </div>

      {showBreakdown && checkpoints.length > 0 && (
        <div className="mt-3 border-t border-green-400/30 pt-3">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {checkpoints.map((checkpoint, index) => (
                <div key={index} className="bg-green-900/20 border border-green-400/30 p-2 rounded">
                  <div className="text-green-300 font-bold">CP {checkpoint.checkpoint_number + 1}</div>
                  <div className="text-green-400">+{checkpoint.net_score || 0} pts</div>
                  {checkpoint.duration_seconds && (
                    <div className="text-green-600">{Math.floor(checkpoint.duration_seconds / 60)}:{(checkpoint.duration_seconds % 60).toString().padStart(2, '0')}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreHeader;
