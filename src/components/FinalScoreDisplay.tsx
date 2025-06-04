
import React, { useEffect, useState } from 'react';

interface FinalScoreDisplayProps {
  totalScore: number;
  totalLifelinesUsed: number;
  totalInvalidAttempts: number;
  checkpointScores: number[];
  checkpointTimes: number[];
  onStartOver: () => void;
}

const FinalScoreDisplay: React.FC<FinalScoreDisplayProps> = ({ 
  totalScore,
  totalLifelinesUsed,
  totalInvalidAttempts,
  checkpointScores,
  checkpointTimes,
  onStartOver 
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateFinalScore = () => {
    let finalScore = totalScore;
    finalScore += 10; // Completion bonus
    if (totalLifelinesUsed === 0) finalScore += 10; // No lifeline bonus
    return finalScore;
  };

  const getAgentRank = (score: number) => {
    if (score >= 95) return { title: "The Spy Who Scored Me", color: "#FFD700" };
    if (score >= 80) return { title: "Undercover Overachiever", color: "#C0C0C0" };
    if (score >= 65) return { title: "Secret Agent...ish", color: "#CD7F32" };
    if (score >= 45) return { title: "Agent Almost-There", color: "#87CEEB" };
    return { title: "Operation: Whoopsie", color: "#FF6B6B" };
  };

  const finalScore = calculateFinalScore();
  const agentRank = getAgentRank(finalScore);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-play final audio
  useEffect(() => {
    const playFinalAudio = () => {
      try {
        const audioUrl = "https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3";
        const audio = new Audio(audioUrl);
        audio.volume = 0.7;
        audio.play().catch(error => {
          console.log('Audio autoplay blocked:', error);
        });
      } catch (error) {
        console.error('Error playing final audio:', error);
      }
    };

    const audioTimer = setTimeout(playFinalAudio, 2000);
    return () => clearTimeout(audioTimer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-green-400">
      <div className="max-w-2xl w-full space-y-6">
        {/* Agent Rank Display */}
        <div className="text-center mb-8">
          <div 
            className="text-4xl font-bold mb-4 animate-pulse"
            style={{ color: agentRank.color }}
          >
            🎖️ AGENT RANK: {agentRank.title.toUpperCase()}
          </div>
          <div className="text-2xl text-green-300 font-bold">
            FINAL SCORE: {finalScore} POINTS
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="border border-green-400 bg-black/90">
          <div className="text-green-300 font-bold text-center py-3 border-b border-green-400">
            🎯 MISSION DEBRIEF
          </div>
          
          <div className="p-4">
            {checkpointScores.length > 0 ? (
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-green-400">
                    <th className="text-left py-2">Checkpoint</th>
                    <th className="text-center py-2">Time</th>
                    <th className="text-center py-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {checkpointScores.map((score, index) => (
                    <tr key={index} className="border-b border-green-400/30">
                      <td className="py-2">{index + 1}</td>
                      <td className="text-center py-2">{formatDuration(checkpointTimes[index] || 0)}</td>
                      <td className="text-center py-2 text-green-400">+{score}</td>
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

            {/* Bonuses and Penalties */}
            <div className="mt-4 pt-4 border-t border-green-400">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-300 font-bold">🏆 Completion Bonus:</div>
                  <div className="text-green-400">+10 points</div>
                </div>
                {totalLifelinesUsed === 0 && (
                  <div>
                    <div className="text-green-300 font-bold">💪 No Lifeline Bonus:</div>
                    <div className="text-green-400">+10 points</div>
                  </div>
                )}
                <div>
                  <div className="text-green-300 font-bold">🔄 Total Lifelines Used:</div>
                  <div className="text-yellow-400">{totalLifelinesUsed} (-{totalLifelinesUsed * 3} points)</div>
                </div>
                <div>
                  <div className="text-green-300 font-bold">❌ Invalid Attempts:</div>
                  <div className="text-red-400">{totalInvalidAttempts} (-{totalInvalidAttempts * 2} points)</div>
                </div>
              </div>
            </div>

            {/* Final Score */}
            <div className="mt-6 pt-4 border-t border-green-400 text-center">
              <div className="text-xl font-bold text-green-300 mb-4">
                🏆 FINAL SCORE: {finalScore} POINTS
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ color: agentRank.color }}
              >
                {agentRank.title.toUpperCase()}
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
