import React from 'react';

interface DevToolsProps {
  onReseed: () => void;
  onGrantXp: () => void;
  onAddItem: () => void;
  onClearData: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ onReseed, onGrantXp, onAddItem, onClearData }) => {
  return (
    <div className="fixed bottom-24 right-4 z-50 bg-[#1a1b1e]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-2 space-y-2 text-xs animate-fade-in">
      <h4 className="font-bold text-center text-white px-2">Dev Panel</h4>
      <button 
        onClick={onReseed}
        className="w-full text-left p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        🌱 Reseed Data
      </button>
      <button 
        onClick={onGrantXp}
        className="w-full text-left p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        ✨ Grant 500 XP
      </button>
      <button 
        onClick={onAddItem}
        className="w-full text-left p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        📥 Add Item
      </button>
       <button 
        onClick={onClearData}
        className="w-full text-left p-2 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300"
      >
        🗑️ Clear All Data
      </button>
    </div>
  );
};

export default DevTools;