
import React, { useEffect, useState, useRef } from 'react';

interface FinalScoreDisplayProps {
  totalScore: number;
  totalLifelinesUsed: number;
  totalInvalidAttempts: number;
  checkpointScores: number[];
  checkpointTimes: number[];
  onStartOver: () => void;
}

const MissionAccomplishedAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(25); // 25 seconds default
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-play after 2 seconds (only once)
  useEffect(() => {
    if (!hasAutoPlayed) {
      const autoPlayTimer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = 0.7;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            setHasAutoPlayed(true);
          }).catch(error => {
            console.log('Audio autoplay blocked:', error);
            setHasAutoPlayed(true);
          });
        }
      }, 2000);

      return () => clearTimeout(autoPlayTimer);
    }
  }, [hasAutoPlayed]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseInt(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const jumpTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  return (
    <div className="bg-black border-2 border-green-500 p-6 rounded-lg w-full max-w-2xl mx-auto mb-8">
      <h3 className="text-green-400 text-xl font-bold text-center mb-4">CLASSIFIED TRANSMISSION</h3>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100}
          onChange={handleProgressChange}
          className="w-full h-2 bg-green-800 rounded-lg appearance-none slider"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(currentTime/duration)*100}%, #166534 ${(currentTime/duration)*100}%, #166534 100%)`
          }}
        />
      </div>

      {/* Time Display */}
      <div className="text-green-400 text-center text-lg font-mono mb-4">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => jumpTime(-10)}
          className="bg-black border border-green-500 text-green-400 px-3 py-1 rounded font-mono hover:bg-green-900"
        >
          [&lt;&lt;10s]
        </button>
        
        <button
          onClick={handlePlayPause}
          className="bg-green-600 text-black px-6 py-1 rounded font-mono font-bold hover:bg-green-500"
        >
          {isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        
        <button
          onClick={() => jumpTime(10)}
          className="bg-black border border-green-500 text-green-400 px-3 py-1 rounded font-mono hover:bg-green-900"
        >
          [10s&gt;&gt;]
        </button>
        
        <button
          onClick={() => {setCurrentTime(0); if(audioRef.current) audioRef.current.currentTime = 0;}}
          className="bg-black border border-yellow-500 text-yellow-400 px-3 py-1 rounded font-mono hover:bg-yellow-900"
        >
          [REPLAY]
        </button>
      </div>

      {/* Speed Control */}
      <div className="text-center">
        <button
          onClick={() => handleSpeedChange(playbackRate === 1 ? 1.5 : 1)}
          className="bg-black border border-yellow-500 text-yellow-400 px-4 py-1 rounded font-mono hover:bg-yellow-900"
        >
          [{playbackRate}x]
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 25)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src="https://epukqhdfdoxvowyflral.supabase.co/storage/v1/object/public/audio-files/mission-accomplished.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-green-400">
      <div className="max-w-2xl w-full space-y-6">
        {/* Mission Accomplished Audio Player */}
        <MissionAccomplishedAudio />

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
