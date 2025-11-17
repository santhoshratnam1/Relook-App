
import React from 'react';

interface UndoNotificationProps {
  onUndo: () => void;
}

const UndoNotification: React.FC<UndoNotificationProps> = ({ onUndo }) => {
  return (
    <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-50 animate-slide-in-up">
      <div className="bg-[#2a2b2e] border border-white/10 rounded-full shadow-lg p-2 flex items-center justify-between">
        <p className="text-sm text-gray-200 px-4">Item added to inbox</p>
        <button
          onClick={onUndo}
          className="font-bold text-sm py-2 px-4 rounded-full bg-[#E6F0C6] text-black hover:opacity-90 transition-opacity"
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default UndoNotification;