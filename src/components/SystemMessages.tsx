
import React, { useEffect } from 'react';

const SystemMessages: React.FC = () => {
  useEffect(() => {
    const systemMessages = [
      "SECURE CONNECTION ESTABLISHED",
      "ENCRYPTION LEVEL: MAXIMUM", 
      "SURVEILLANCE: OFFLINE",
      "MISSION STATUS: ACTIVE",
      "HANDLER ONLINE",
      "CLEARANCE VERIFIED",
      "PERIMETER SECURE",
      "COMMS ENCRYPTED"
    ];

    const showRandomSystemMessage = () => {
      const msg = systemMessages[Math.floor(Math.random() * systemMessages.length)];
      const element = document.createElement('div');
      element.className = 'system-message';
      element.textContent = msg;
      element.style.cssText = `
        position: fixed;
        top: 10px;
        right: 120px;
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff00;
        color: #00ff00;
        padding: 5px 10px;
        font-size: 12px;
        font-family: monospace;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s;
      `;
      
      document.body.appendChild(element);
      setTimeout(() => element.style.opacity = '1', 100);
      setTimeout(() => {
        element.style.opacity = '0';
        setTimeout(() => element.remove(), 500);
      }, 3000);
    };

    // Show random messages occasionally
    const interval = setInterval(showRandomSystemMessage, 20000);
    
    // Show first message after 5 seconds
    setTimeout(showRandomSystemMessage, 5000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component only creates DOM elements, no JSX
};

export default SystemMessages;
