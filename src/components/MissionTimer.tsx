
import React, { useState, useEffect } from 'react';

interface MissionTimerProps {
  sessionStartTime?: number;
  currentCheckpoint?: number;
}

const MissionTimer: React.FC<MissionTimerProps> = ({ 
  sessionStartTime, 
  currentCheckpoint = 1 
}) => {
  const [totalTime, setTotalTime] = useState(0);
  const [systemTime, setSystemTime] = useState(Math.floor(Date.now() / 1000) % 86400);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update total mission time
      if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        setTotalTime(elapsed);
      }
      
      // Update system time (like original)
      setSystemTime(Math.floor(Date.now() / 1000) % 86400);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mission-timer-display">
      <div>
        MISSION TIMER: {sessionStartTime ? formatTime(totalTime) : formatTime(systemTime)} 
        {sessionStartTime && ` | CP ${currentCheckpoint}`}
      </div>
      <div>
        LOCATION: CLASSIFIED
      </div>
    </div>
  );
};

export default MissionTimer;
