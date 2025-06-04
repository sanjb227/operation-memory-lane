
import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface AutoFadeNotificationProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const AutoFadeNotification: React.FC<AutoFadeNotificationProps> = ({ 
  notifications, 
  onRemove 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Add new notifications to visible list
    notifications.forEach(notification => {
      if (!visibleNotifications.find(n => n.id === notification.id)) {
        setVisibleNotifications(prev => [...prev, notification]);
        
        // Auto-remove after duration (default 2.5 seconds)
        const duration = notification.duration || 2500;
        setTimeout(() => {
          setVisibleNotifications(prev => prev.filter(n => n.id !== notification.id));
          onRemove(notification.id);
        }, duration);
      }
    });
  }, [notifications, onRemove, visibleNotifications]);

  const getNotificationStyle = (type: string) => {
    const baseStyle = "fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-semibold text-white z-50 transition-all duration-300 ease-in-out shadow-lg max-w-sm text-center";
    
    switch (type) {
      case 'success':
        return `${baseStyle} bg-green-600 border border-green-500`;
      case 'error':
        return `${baseStyle} bg-red-600 border border-red-500`;
      case 'warning':
        return `${baseStyle} bg-yellow-600 border border-yellow-500`;
      case 'info':
      default:
        return `${baseStyle} bg-blue-600 border border-blue-500`;
    }
  };

  return (
    <>
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className={getNotificationStyle(notification.type)}
          style={{
            top: `${1 + index * 4}rem`, // Stack notifications with spacing
            zIndex: 1000 + index
          }}
        >
          {notification.message}
        </div>
      ))}
    </>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

export default AutoFadeNotification;
