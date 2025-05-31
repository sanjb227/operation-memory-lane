
import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  label: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  label, 
  autoPlay = false, 
  onPlay, 
  onEnded 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
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

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [onPlay, onEnded, hasPlayed]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      // Auto-play with user interaction required
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.log('Auto-play prevented, user interaction required');
        }
      };
      playAudio();
    }
  }, [autoPlay]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleReplay = async () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error('Audio replay error:', error);
    }
  };

  const toggleSpeed = () => {
    const newRate = playbackRate === 1 ? 1.5 : 1;
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (time: number) => {
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
      
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Progress Bar */}
      <div className="w-full bg-green-900/30 border border-green-600 h-1">
        <div 
          className="bg-green-400 h-full transition-all duration-200"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Time Display */}
      <div className="text-green-400 text-xs text-center font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={handlePlayPause}
          className="bg-green-600 hover:bg-green-500 text-black font-bold py-1 px-3 text-xs transition-colors border border-green-400"
        >
          {isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        
        <button
          onClick={handleReplay}
          className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold py-1 px-3 text-xs transition-colors"
        >
          [REPLAY]
        </button>
        
        <button
          onClick={toggleSpeed}
          className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-1 px-3 text-xs transition-colors"
        >
          [{playbackRate}x SPEED]
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
