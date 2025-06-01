
import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  label: string;
  onPlay?: () => void;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  label, 
  onPlay, 
  onEnded 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const playbackSpeeds = [0.5, 1, 1.25, 1.5, 2];
  const currentSpeedIndex = playbackSpeeds.indexOf(playbackRate);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasPlayed) {
        setHasPlayed(true);
        onPlay?.();
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('canplay', handleCanPlay);

    // Force enable controls after timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('canplay', handleCanPlay);
      clearTimeout(timeout);
    };
  }, [onPlay, onEnded, hasPlayed]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        if (audio.currentTime >= audio.duration) {
          audio.currentTime = 0;
        }
        await audio.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsLoading(false);
      if (!hasPlayed) {
        setHasPlayed(true);
        onPlay?.();
      }
    }
  };

  const handleReplay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      audio.currentTime = 0;
      setCurrentTime(0);
      await audio.play();
    } catch (error) {
      console.error('Audio replay error:', error);
    }
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = audio.duration * percentage;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = () => {
    const nextIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
    const newRate = playbackSpeeds[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border border-green-400 bg-black/90 p-4 space-y-3">
      <div className="text-green-300 font-bold text-xs text-center">
        {label}
      </div>
      
      <audio 
        ref={audioRef} 
        src={src} 
        preload="auto"
        crossOrigin="anonymous"
      />
      
      {/* Enhanced Progress Bar - Clickable for seeking */}
      <div 
        ref={progressBarRef}
        className="w-full bg-green-900/30 border border-green-600 h-3 cursor-pointer relative hover:bg-green-900/50"
        onClick={handleProgressBarClick}
      >
        <div 
          className="bg-green-400 h-full transition-all duration-200"
          style={{ width: `${progressPercentage}%` }}
        />
        {/* Current position indicator */}
        <div 
          className="absolute top-0 w-1 h-full bg-green-200"
          style={{ left: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Time Display */}
      <div className="text-green-400 text-xs text-center font-mono">
        {isLoading ? 'Loading audio...' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </div>
      
      {/* Enhanced Controls */}
      <div className="flex justify-center space-x-1 flex-wrap">
        {/* Skip backward 10s */}
        <button
          onClick={() => handleSkip(-10)}
          disabled={isLoading}
          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold py-1 px-2 text-xs transition-colors border"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          [{'<<10s'}]
        </button>
        
        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-500 text-black border border-green-400 font-bold py-1 px-3 text-xs transition-colors"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          {isLoading ? '[LOADING]' : isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        
        {/* Skip forward 10s */}
        <button
          onClick={() => handleSkip(10)}
          disabled={isLoading}
          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold py-1 px-2 text-xs transition-colors border"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          [10s{'>>'}]
        </button>
        
        {/* Replay */}
        <button
          onClick={handleReplay}
          disabled={isLoading}
          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold py-1 px-3 text-xs transition-colors border"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          [REPLAY]
        </button>
        
        {/* Enhanced Speed Control */}
        <button
          onClick={handleSpeedChange}
          disabled={isLoading}
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-1 px-3 text-xs transition-colors border"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          [{playbackRate}x]
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
