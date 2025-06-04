
import React, { useState } from 'react';
import { shareSessionAcrossDevices } from '../utils/sessionStorage';

interface Checkpoint5MobileHandlerProps {
  gameState: any;
  onSkip: () => void;
  onContinue: () => void;
}

const Checkpoint5MobileHandler: React.FC<Checkpoint5MobileHandlerProps> = ({
  gameState,
  onSkip,
  onContinue
}) => {
  const [showQR, setShowQR] = useState(false);
  const [sessionUrl, setSessionUrl] = useState('');

  const handleShowQR = () => {
    const url = shareSessionAcrossDevices(gameState);
    setSessionUrl(url);
    setShowQR(true);
  };

  const generateQRCodeUrl = (url: string) => {
    // Using QR Server API for QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
  };

  if (showQR) {
    return (
      <div className="border border-green-400 p-6 bg-black/90 mb-6 text-center">
        <div className="text-green-300 font-bold mb-4">
          📱 CHECKPOINT 5 - DESKTOP ACCESS
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-green-400 mb-3">
            1. Scan QR code with desktop/laptop camera or QR scanner
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src={generateQRCodeUrl(sessionUrl)} 
              alt="QR Code for Desktop Access" 
              className="border border-green-400 bg-white p-2"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
          <div className="text-xs text-green-400 mb-4 space-y-1">
            <div>2. Look for the code "SCI SPY" on desktop screen</div>
            <div>3. Return here and enter that code to continue</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 transition-colors"
            style={{ minHeight: '48px', fontSize: '16px' }}
          >
            ✅ I found the desktop code
          </button>
          
          <button
            onClick={() => setShowQR(false)}
            className="w-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black py-2 px-4 transition-colors"
            style={{ minHeight: '44px', fontSize: '14px' }}
          >
            ← Back to Options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-green-400 p-6 bg-black/90 mb-6 text-center">
      <div className="text-green-300 font-bold mb-4">
        📱 CHECKPOINT 5 - DESKTOP REQUIRED
      </div>
      
      <div className="text-sm text-green-400 mb-6 leading-relaxed">
        This checkpoint requires viewing on a desktop/laptop to find the hidden code.
        Choose an option below:
      </div>

      <div className="space-y-4">
        <button
          onClick={handleShowQR}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 transition-colors"
          style={{ minHeight: '48px', fontSize: '16px' }}
        >
          📱 Get QR Code for Desktop
        </button>
        
        <button
          onClick={onSkip}
          className="w-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-black py-3 px-4 transition-colors"
          style={{ minHeight: '48px', fontSize: '16px' }}
        >
          ⏭️ Skip Checkpoint 5 (-5 points)
        </button>
      </div>
    </div>
  );
};

export default Checkpoint5MobileHandler;
