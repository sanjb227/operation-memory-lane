
import React, { useEffect, useState } from 'react';

interface TerminalNotificationProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

const TerminalNotification: React.FC<TerminalNotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          color: '#ff4444',
          background: 'rgba(255, 68, 68, 0.1)',
          borderColor: '#ff4444'
        };
      case 'success':
        return {
          color: '#00ff00',
          background: 'rgba(0, 255, 0, 0.1)',
          borderColor: '#00ff00'
        };
      case 'info':
        return {
          color: '#ffaa00',
          background: 'rgba(255, 170, 0, 0.1)',
          borderColor: '#ffaa00'
        };
      default:
        return {
          color: '#00ff00',
          background: 'rgba(0, 255, 0, 0.1)',
          borderColor: '#00ff00'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div 
      className={`terminal-notification ${isVisible ? 'show' : ''}`}
      style={{
        ...typeStyles,
        border: '1px solid',
        padding: '8px 16px',
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        borderRadius: '4px',
        marginTop: '8px',
        transition: 'all 0.3s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)'
      }}
    >
      {message}
    </div>
  );
};

export default TerminalNotification;
