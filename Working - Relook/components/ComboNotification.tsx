import React, { useState, useEffect } from 'react';

interface ComboNotificationProps {
  comboCount: number;
}

const ComboNotification: React.FC<ComboNotificationProps> = ({ comboCount }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (comboCount > 1) {
      setDisplayCount(comboCount);
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [comboCount]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      key={displayCount} 
      className="fixed top-28 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none"
      style={{ animation: `combo-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), floatUpFadeOut 1s ease-out 1s forwards` }}
    >
      <div className="flex flex-col items-center">
        <span 
          className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300"
          style={{ WebkitTextStroke: '2px black', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}
        >
          x{displayCount}
        </span>
        <span 
          className="text-2xl font-bold text-white uppercase tracking-widest"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          Combo
        </span>
      </div>
    </div>
  );
};

export default ComboNotification;