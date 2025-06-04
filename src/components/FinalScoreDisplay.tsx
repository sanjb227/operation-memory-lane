
import React, { useEffect, useState } from 'react';
import { useTimingSystem } from '../hooks/useTimingSystem';

interface FinalScoreDisplayProps {
  sessionId: string;
  onStartOver: () => void;
}

const FinalScoreDisplay: React.FC<FinalScoreDisplayProps> = ({ sessionId, onStartOver }) => {
  const { getFinalScore } = useTimingSystem(sessionId, 0);
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFinalScore = async () => {
      try {
        console.log('Loading final score for session:', sessionId);
        setError(null);
        
        if (!sessionId) {
          throw new Error('No session ID provided');
        }

        const data = await getFinalScore();
        
        if (!data) {
          console.error('No final score data returned');
          // Create fallback data
          const fallbackData = {
            totalScore: 50,
            agentRank: {
              min: 45,
              max: 64,
              title: "Agent Almost-There",
              color: "#87CEEB"
            },
            breakdown: [],
            totalLifelinesUsed: 0,
            totalInvalidAttempts: 0,
            noLifelineBonus: 0,
            perfectCodeBonus: 0,
            completionBonus: 10
          };
          setScoreData(fallbackData);
          console.log('Using fallback score data');
        } else {
          console.log('Final score data loaded successfully:', data);
          setScoreData(data);
        }
        
        setTimeout(() => setShowCelebration(true), 1000);
      } catch (error) {
        console.error('Error loading final score:', error);
        setError('Failed to load final score');
        
        // Show fallback completion anyway
        const fallbackData = {
          totalScore: 50,
          agentRank: {
            min: 45,
            max: 64,
            title: "Mission Complete",
            color: "#87CEEB"
          },
          breakdown: [],
          totalLifelinesUsed: 0,
          totalInvalidAttempts: 0,
          noLifelineBonus: 0,
          perfectCodeBonus: 0,
          completionBonus: 50
        };
        setScoreData(fallbackData);
        setTimeout(() => setShowCelebration(true), 1000);
      } finally {
        setLoading(false);
      }
    };

    loadFinalScore();
  }, [getFinalScore, sessionId]);

  // Auto-play final audio
  useEffect(() => {
    if (scoreData && !loading) {
      // Play mission accomplished audio
      const playFinalAudio = () => {
        try {
          const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3";
          const audio = new Audio(audioUrl);
          audio.volume = 0.7;
          audio.play().catch(error => {
            console.log('Audio autoplay blocked, user interaction required:', error);
          });
        } catch (error) {
          console.error('Error playing final audio:', error);
        }
      };

      const audioTimer = setTimeout(playFinalAudio, 2000);
      return () => clearTimeout(audioTimer);
    }
  }, [scoreData, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black text-green-400">
        <div className="text-center">
          <div className="text-green-400 text-lg font-mono animate-pulse">
            🏆 CALCULATING FINAL SCORE...
          </div>
          <div className="text-green-600 text-sm mt-2">
            Tallying mission performance...
          </div>
        </div>
      </div>
    );
  }

  if (error && !scoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black text-red-400">
        <div className="text-center border border-red-400 p-8 bg-red-900/20">
          <div className="text-red-400 text-lg font-mono mb-4">
            ⚠️ MISSION DATA ERROR
          </div>
          <div className="text-red-300 text-sm mb-6">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 font-bold transition-colors"
          >
            RETRY MISSION DEBRIEF
          </button>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-green-400">
      <div className="max-w-2xl w-full space-y-6">
        {/* Agent Rank Display */}
        <div className="text-center mb-8">
          <div 
            className="text-4xl font-bold mb-4 animate-pulse"
            style={{ color: scoreData.agentRank.color }}
          >
            🎖️ AGENT RANK: {scoreData.agentRank.title.toUpperCase()}
          </div>
          <div className="text-2xl text-green-300 font-bold">
            FINAL SCORE: {scoreData.totalScore} POINTS
          </div>
          {error && (
            <div className="text-yellow-400 text-sm mt-2">
              ⚠️ Partial data recovery - Mission completed successfully!
            </div>
          )}
        </div>

        {/* Score Breakdown Table */}
        <div className="border border-green-400 bg-black/90">
          <div className="text-green-300 font-bold text-center py-3 border-b border-green-400">
            🎯 MISSION DEBRIEF
          </div>
          
          <div className="p-4">
            {scoreData.breakdown && scoreData.breakdown.length > 0 ? (
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-green-400">
                    <th className="text-left py-2">Checkpoint</th>
                    <th className="text-center py-2">Time</th>
                    <th className="text-center py-2">Time Score</th>
                    <th className="text-center py-2">Lifeline Penalty</th>
                    <th className="text-center py-2">Invalid Penalty</th>
                    <th className="text-center py-2">Net Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreData.breakdown.map((checkpoint: any, index: number) => (
                    <tr key={index} className="border-b border-green-400/30">
                      <td className="py-2">{index + 1}</td>
                      <td className="text-center py-2">{formatDuration(checkpoint.duration_seconds || 0)}</td>
                      <td className="text-center py-2 text-green-400">+{checkpoint.time_score || 0}</td>
                      <td className="text-center py-2 text-red-400">
                        {checkpoint.lifeline_penalty ? `-${checkpoint.lifeline_penalty}` : '0'}
                      </td>
                      <td className="text-center py-2 text-red-400">
                        {checkpoint.invalid_attempt_penalty ? `-${checkpoint.invalid_attempt_penalty}` : '0'}
                      </td>
                      <td className="text-center py-2 text-green-300 font-bold">+{checkpoint.net_score || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-green-600 py-8">
                <div className="text-green-300 font-bold mb-2">🎉 MISSION ACCOMPLISHED!</div>
                <div className="text-sm">All checkpoints completed successfully</div>
              </div>
            )}

            {/* Bonuses */}
            <div className="mt-4 pt-4 border-t border-green-400">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-300 font-bold">🏆 Completion Bonus:</div>
                  <div className="text-green-400">+{scoreData.completionBonus} points</div>
                </div>
                {scoreData.noLifelineBonus > 0 && (
                  <div>
                    <div className="text-green-300 font-bold">💪 No Lifeline Bonus:</div>
                    <div className="text-green-400">+{scoreData.noLifelineBonus} points</div>
                  </div>
                )}
                {scoreData.perfectCodeBonus > 0 && (
                  <div>
                    <div className="text-green-300 font-bold">🎯 Perfect Code Bonus:</div>
                    <div className="text-green-400">+{scoreData.perfectCodeBonus} points</div>
                  </div>
                )}
                <div>
                  <div className="text-green-300 font-bold">🔄 Total Lifelines Used:</div>
                  <div className="text-yellow-400">{scoreData.totalLifelinesUsed}</div>
                </div>
                <div>
                  <div className="text-green-300 font-bold">❌ Invalid Attempts:</div>
                  <div className="text-red-400">{scoreData.totalInvalidAttempts}</div>
                </div>
              </div>
            </div>

            {/* Final Score */}
            <div className="mt-6 pt-4 border-t border-green-400 text-center">
              <div className="text-xl font-bold text-green-300 mb-4">
                🏆 FINAL SCORE: {scoreData.totalScore} POINTS
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ color: scoreData.agentRank.color }}
              >
                {scoreData.agentRank.title.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowCelebration(true)}
            className="bg-green-600 hover:bg-green-500 text-black border border-green-400 px-6 py-3 font-bold transition-all duration-200"
          >
            🎉 MISSION COMPLETE
          </button>
          <button
            onClick={onStartOver}
            className="bg-gray-600 hover:bg-gray-500 text-white border border-gray-400 px-6 py-3 font-bold transition-all duration-200"
          >
            ↻ START OVER
          </button>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="text-center border-2 border-green-400 p-8 bg-black/90 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-green-300 animate-pulse">
              🎉 MISSION ACCOMPLISHED! 🎉
            </h1>
            <p className="text-green-400 mb-4">
              EXCELLENT WORK, AGENT AISHU
            </p>
            <p className="text-green-400 mb-6">
              CONGRATULATIONS ON YOUR GRADUATION!
            </p>
            
            {/* Audio Player */}
            <div className="mb-6">
              <audio controls className="w-full bg-black border border-green-400">
                <source src="https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full bg-green-600 hover:bg-green-500 text-black border border-green-400 px-8 py-4 text-lg font-bold transition-all duration-200"
              >
                🎖️ MISSION COMPLETE
              </button>
              <button 
                onClick={onStartOver}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white border border-gray-400 px-8 py-4 text-lg font-bold transition-all duration-200"
              >
                ↻ START OVER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalScoreDisplay;
