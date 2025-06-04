
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
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  if (showQR) {
    return (
      <div className="border border-green-400 p-6 bg-black/90 mb-6 text-center">
        <div className="text-green-300 font-bold mb-4">
          📱 CHECKPOINT 5 - DESKTOP REQUIRED
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-green-400 mb-3">
            Scan with desktop/laptop to continue checkpoint 5:
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src={generateQRCodeUrl(sessionUrl)} 
              alt="QR Code for Desktop" 
              className="border border-green-400"
            />
          </div>
          <div className="text-xs text-green-300 mb-4">
            After completing on desktop, return here and click Continue
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 transition-colors"
            style={{ minHeight: '48px', fontSize: '16px' }}
          >
            ✅ Continue (I completed it on desktop)
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
        This checkpoint requires a desktop/laptop screen for optimal experience.
        Choose an option below to continue:
      </div>

      <div className="space-y-4">
        <button
          onClick={handleShowQR}
          className="w-full bg-blue-600 hover:bg-blue-500 text-black font-bold py-3 px-4 transition-colors"
          style={{ minHeight: '48px', fontSize: '16px' }}
        >
          📱 Show QR Code for Desktop
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
