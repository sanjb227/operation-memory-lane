
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

  useEffect(() => {
    const loadFinalScore = async () => {
      try {
        const data = await getFinalScore();
        if (data) {
          setScoreData(data);
          setTimeout(() => setShowCelebration(true), 1000);
        }
      } catch (error) {
        console.error('Error loading final score:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFinalScore();
  }, [getFinalScore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-green-400 text-lg font-mono">
          CALCULATING FINAL SCORE...
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-red-400 text-lg font-mono">
          ERROR LOADING SCORE DATA
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Agent Rank Display */}
        <div className="text-center mb-8">
          <div 
            className="text-4xl font-bold mb-4 animate-pulse"
            style={{ color: scoreData.agentRank.color }}
          >
            AGENT RANK: {scoreData.agentRank.title.toUpperCase()}
          </div>
          <div className="text-2xl text-green-300 font-bold">
            FINAL SCORE: {scoreData.totalScore} POINTS
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="border border-green-400 bg-black/90">
          <div className="text-green-300 font-bold text-center py-3 border-b border-green-400">
            MISSION DEBRIEF
          </div>
          
          <div className="p-4">
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

            {/* Bonuses */}
            <div className="mt-4 pt-4 border-t border-green-400">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-300 font-bold">Completion Bonus:</div>
                  <div className="text-green-400">+{scoreData.completionBonus} points</div>
                </div>
                {scoreData.noLifelineBonus > 0 && (
                  <div>
                    <div className="text-green-300 font-bold">No Lifeline Bonus:</div>
                    <div className="text-green-400">+{scoreData.noLifelineBonus} points</div>
                  </div>
                )}
                {scoreData.perfectCodeBonus > 0 && (
                  <div>
                    <div className="text-green-300 font-bold">Perfect Code Bonus:</div>
                    <div className="text-green-400">+{scoreData.perfectCodeBonus} points</div>
                  </div>
                )}
                <div>
                  <div className="text-green-300 font-bold">Total Lifelines Used:</div>
                  <div className="text-yellow-400">{scoreData.totalLifelinesUsed}</div>
                </div>
                <div>
                  <div className="text-green-300 font-bold">Invalid Attempts:</div>
                  <div className="text-red-400">{scoreData.totalInvalidAttempts}</div>
                </div>
              </div>
            </div>

            {/* Final Score */}
            <div className="mt-6 pt-4 border-t border-green-400 text-center">
              <div className="text-xl font-bold text-green-300 mb-4">
                FINAL SCORE: {scoreData.totalScore} POINTS
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
            MISSION COMPLETE
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
              MISSION ACCOMPLISHED
            </h1>
            <p className="text-green-400 mb-4">
              EXCELLENT WORK, AGENT AISHU
            </p>
            <p className="text-green-400 mb-8">
              CONGRATULATIONS ON YOUR GRADUATION!
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full bg-green-600 hover:bg-green-500 text-black border border-green-400 px-8 py-4 text-lg font-bold transition-all duration-200"
              >
                MISSION COMPLETE
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
