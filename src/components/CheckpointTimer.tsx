
import React, { useState, useEffect, useRef } from 'react';

interface CheckpointTimerProps {
  checkpointNumber: number;
  isActive: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onComplete?: (finalTime: number) => void;
}

const CheckpointTimer: React.FC<CheckpointTimerProps> = ({
  checkpointNumber,
  isActive,
  onTimeUpdate,
  onComplete
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Start timer when component becomes active
  useEffect(() => {
    if (isActive && !isRunning) {
      startTimer();
    } else if (!isActive && isRunning) {
      stopTimer();
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (isRunning) return;
    
    startTimeRef.current = Date.now() - (seconds * 1000);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const newSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSeconds(newSeconds);
        onTimeUpdate?.(newSeconds);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    onComplete?.(seconds);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = (): string => {
    const minutes = Math.floor(seconds / 60);
    const PAR_TIME = 7; // 7 minutes par time
    
    if (minutes <= PAR_TIME) return 'timer-excellent';
    if (minutes <= PAR_TIME + 3) return 'timer-good';
    return 'timer-over-par';
  };

  const getPerformanceLabel = (): string => {
    const minutes = Math.floor(seconds / 60);
    const PAR_TIME = 7;
    
    if (minutes <= PAR_TIME) return 'On Pace';
    if (minutes <= PAR_TIME + 3) return 'Good Time';
    return 'Over Par';
  };

  return (
    <div className="checkpoint-timer-widget">
      <div className="timer-label">
        CP {checkpointNumber} • {getPerformanceLabel()}
      </div>
      <div className={`timer-display ${getTimerClass()}`}>
        {formatTime(seconds)}
      </div>
      <div className="timer-par">
        Par: 07:00
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="timer-controls" style={{ marginTop: '8px', fontSize: '10px' }}>
          <button onClick={startTimer} disabled={isRunning} style={{ marginRight: '4px', fontSize: '8px' }}>▶</button>
          <button onClick={stopTimer} disabled={!isRunning} style={{ marginRight: '4px', fontSize: '8px' }}>⏸</button>
          <button onClick={resetTimer} style={{ fontSize: '8px' }}>↻</button>
        </div>
      )}
    </div>
  );
};

export default CheckpointTimer;
