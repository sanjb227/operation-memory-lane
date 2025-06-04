
import React, { useEffect } from 'react';

interface InvalidAttemptPopupProps {
  show: boolean;
  onClose: () => void;
}

const InvalidAttemptPopup: React.FC<InvalidAttemptPopupProps> = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="invalid-attempt-popup">
      <div className="text-center">
        <div className="text-lg font-bold">❌ Invalid Code!</div>
        <div className="text-sm">-2 points</div>
      </div>
    </div>
  );
};

export default InvalidAttemptPopup;
