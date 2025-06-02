
import React, { useState, useEffect } from 'react';

interface MysteriousLandingProps {
  onProceed: () => void;
}

const MysteriousLanding: React.FC<MysteriousLandingProps> = ({ onProceed }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const messages = [
    "SECURE CONNECTION ESTABLISHED...",
    "MISSION PARAMETERS LOADING..."
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (currentMessage < messages.length - 1) {
        setCurrentMessage(prev => prev + 1);
      } else {
        clearInterval(messageInterval);
        // Show button after only 2 seconds instead of long delay
        setTimeout(() => setShowButton(true), 2000);
      }
    }, 1500); // Reduced from 2500 to 1500ms

    return () => clearInterval(messageInterval);
  }, [currentMessage, messages.length]);

  const handleProceed = () => {
    document.body.style.transition = 'opacity 1s';
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = '';
      onProceed();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4 overflow-hidden">
      <div className="mysterious-container">
        <div 
          key={currentMessage}
          className="typewriter mb-8"
          style={{
            animation: 'typing 1.5s steps(40, end), blink-caret .75s step-end infinite'
          }}
        >
          {messages[currentMessage]}
        </div>
        
        {showButton && (
          <div className="fade-in">
            <p className="text-xs mb-5 opacity-70">
              CLEARANCE VERIFICATION REQUIRED
            </p>
            <button 
              className="access-btn"
              onClick={handleProceed}
            >
              [ ACCESS GRANTED ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MysteriousLanding;
