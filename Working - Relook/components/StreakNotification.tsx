import React, { useState, useEffect } from 'react';

interface StreakNotificationProps {
  streakCount: number;
}

const StreakNotification: React.FC<StreakNotificationProps> = ({ streakCount }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (streakCount > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Notification visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [streakCount]);

  if (!isVisible) {
    return null;
  }

  // Subtle notification for day 1 streak
  if (streakCount === 1) {
    return (
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-50 animate-slide-in-up">
        <div className="bg-[#2a2b2e] border border-white/10 rounded-full shadow-lg p-3 flex items-center justify-center">
          <p className="text-sm text-gray-200 font-semibold">🔥 Daily streak started! Keep it going tomorrow.</p>
        </div>
      </div>
    );
  }

  // Big celebration for streaks > 1 day
  return (
    <div 
      key={streakCount} 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50 pointer-events-none"
      style={{ animation: `streak-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), floatUpFadeOut 1s ease-out 2s forwards` }}
    >
      <div className="flex flex-col items-center p-8 bg-black/50 backdrop-blur-md rounded-3xl">
        <div className="text-8xl" style={{ filter: 'drop-shadow(0 0 20px #ef4444)' }}>
            🔥
        </div>
        <span 
          className="text-3xl font-bold text-white uppercase tracking-widest mt-4"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          {streakCount} Day Streak!
        </span>
         <span className="text-lg font-medium text-gray-300 mt-1">Keep it up!</span>
      </div>
    </div>
  );
};

export default StreakNotification;