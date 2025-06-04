
import React, { useEffect, useState } from 'react';

interface AutoFadeNotificationProps {
  message: string;
  type: 'error' | 'success' | 'info' | 'lifeline';
  duration?: number;
  onComplete: () => void;
}

const AutoFadeNotification: React.FC<AutoFadeNotificationProps> = ({ 
  message, 
  type, 
  duration = 4000,
  onComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 100);
    
    // Fade out and complete
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          background: 'rgba(255, 68, 68, 0.15)',
          borderColor: '#ff4444',
          color: '#ff4444'
        };
      case 'success':
        return {
          background: 'rgba(0, 255, 0, 0.15)',
          borderColor: '#00ff00',
          color: '#00ff00'
        };
      case 'lifeline':
        return {
          background: 'rgba(255, 165, 0, 0.15)',
          borderColor: '#ffa500',
          color: '#ffa500'
        };
      case 'info':
        return {
          background: 'rgba(0, 255, 255, 0.15)',
          borderColor: '#00ffff',
          color: '#00ffff'
        };
      default:
        return {
          background: 'rgba(0, 255, 0, 0.15)',
          borderColor: '#00ff00',
          color: '#00ff00'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div 
      className="notification"
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: '12px 24px',
        borderRadius: '6px',
        fontFamily: "'Courier New', monospace",
        fontSize: '14px',
        border: '1px solid',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        ...typeStyles
      }}
    >
      {message}
    </div>
  );
};

export default AutoFadeNotification;
