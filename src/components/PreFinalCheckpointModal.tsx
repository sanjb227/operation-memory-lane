
import React, { useState } from 'react';

interface PreFinalCheckpointModalProps {
  onProceed: () => void;
}

const PreFinalCheckpointModal: React.FC<PreFinalCheckpointModalProps> = ({ onProceed }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleProceed = () => {
    if (confirmed) {
      onProceed();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full border-2 border-red-500 bg-black/95 p-6 terminal-glow">
        <div className="text-red-400 font-bold text-lg mb-4 text-center blink-text">
          ⚠️ MISSION CRITICAL ⚠️
        </div>
        
        <div className="text-red-300 text-sm leading-relaxed mb-6 space-y-3">
          <p className="font-bold">FINAL CHECKPOINT PROTOCOL</p>
          <p>Contact Agent San before proceeding to the final checkpoint.</p>
          <p>Await further instructions before continuing your mission.</p>
          <p className="text-yellow-400">This is a mandatory security checkpoint.</p>
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 text-red-500 bg-black border-2 border-red-500 rounded focus:ring-red-500"
            />
            <span className="text-green-400 text-sm">
              Mission Control Contacted - Clearance Granted
            </span>
          </label>
        </div>

        <button
          onClick={handleProceed}
          disabled={!confirmed}
          className={`w-full py-3 px-4 font-bold transition-all duration-200 border-2 ${
            confirmed
              ? 'border-red-500 bg-red-600 text-black hover:bg-red-500'
              : 'border-gray-600 bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {confirmed ? '[PROCEED TO FINAL CHECKPOINT]' : '[AWAITING CLEARANCE]'}
        </button>
      </div>
    </div>
  );
};

export default PreFinalCheckpointModal;
