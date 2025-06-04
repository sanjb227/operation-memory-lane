
import React from 'react';
import { detectDevice } from '../utils/deviceDetection';

interface DesktopCodeDisplayProps {
  checkpoint: number;
  code: string;
}

const DesktopCodeDisplay: React.FC<DesktopCodeDisplayProps> = ({ checkpoint, code }) => {
  const device = detectDevice();
  
  // Only show on checkpoint 5 and only on desktop devices
  if (checkpoint !== 4 || !device.isDesktop) { // checkpoint 5 is index 4
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className="bg-black border-2 border-green-400 px-4 py-2 text-green-300 font-mono text-sm"
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)'
        }}
      >
        <div className="text-xs text-green-600 mb-1">DESKTOP CODE:</div>
        <div className="text-lg font-bold text-green-300 tracking-wider">
          {code}
        </div>
      </div>
    </div>
  );
};

export default DesktopCodeDisplay;
