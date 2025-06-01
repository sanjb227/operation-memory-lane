
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
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded');
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleCanPlayThrough = () => {
      console.log('Audio can play through');
      setCanPlay(true);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    const handlePlay = () => {
      console.log('Audio started playing');
      setIsPlaying(true);
      if (!hasPlayed) {
        setHasPlayed(true);
        onPlay?.();
      }
    };

    const handlePause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setCanPlay(false);
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
      setIsLoading(true);
      setCanPlay(false);
    };

    // Add all event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Force load the audio
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onPlay, onEnded, hasPlayed, src]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !canPlay) {
      console.log('Audio not ready for playback');
      return;
    }

    try {
      if (isPlaying) {
        console.log('Pausing audio');
        audio.pause();
      } else {
        console.log('Starting audio playback');
        // Reset if at the end
        if (audio.currentTime >= audio.duration) {
          audio.currentTime = 0;
        }
        await audio.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleReplay = async () => {
    const audio = audioRef.current;
    if (!audio || !canPlay) {
      console.log('Audio not ready for replay');
      return;
    }
    
    try {
      console.log('Replaying audio from start');
      audio.currentTime = 0;
      setCurrentTime(0);
      await audio.play();
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
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Add timestamp for cache busting
  const getAudioUrl = (url: string) => {
    const timestamp = Date.now();
    return `${url}?t=${timestamp}`;
  };

  return (
    <div className="border border-green-400 bg-black/90 p-4 space-y-3">
      <div className="text-green-300 font-bold text-xs text-center">
        {label}
      </div>
      
      <audio 
        ref={audioRef} 
        src={getAudioUrl(src)} 
        preload="auto"
        crossOrigin="anonymous"
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-green-400 text-xs text-center">
          Loading audio...
        </div>
      )}
      
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
          disabled={isLoading || !canPlay}
          className={`font-bold py-1 px-3 text-xs transition-colors border ${
            isLoading || !canPlay
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-black border-green-400'
          }`}
        >
          {isLoading ? '[LOADING]' : isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        
        <button
          onClick={handleReplay}
          disabled={isLoading || !canPlay}
          className={`font-bold py-1 px-3 text-xs transition-colors border ${
            isLoading || !canPlay
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
          }`}
        >
          [REPLAY]
        </button>
        
        <button
          onClick={toggleSpeed}
          disabled={isLoading || !canPlay}
          className={`font-bold py-1 px-3 text-xs transition-colors border ${
            isLoading || !canPlay
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
          }`}
        >
          [{playbackRate}x SPEED]
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
