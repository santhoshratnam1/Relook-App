import React from 'react';

interface DevToolsProps {
  onReseed: () => void;
  onGrantXp: () => void;
  onAddItem: () => void;
  onClearData: () => void;
  onClose: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ onReseed, onGrantXp, onAddItem, onClearData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9998] animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[#1a1b1e]/95 backdrop-blur-md border border-yellow-500/30 rounded-2xl shadow-2xl p-4 mx-4 max-w-sm w-full space-y-3 text-xs animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-center text-yellow-400 text-base flex items-center gap-2">
            🧪 Dev Panel
          </h4>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-400 text-center pb-2 border-b border-white/10">Quick actions for testing</p>
        
        <button 
          onClick={() => { onReseed(); onClose(); }}
          className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-3"
        >
          <span className="text-lg">🌱</span>
          <div>
            <div className="font-semibold">Reseed Data</div>
            <div className="text-[10px] text-gray-400">Load fresh mock data</div>
          </div>
        </button>
        
        <button 
          onClick={() => { onGrantXp(); onClose(); }}
          className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-3"
        >
          <span className="text-lg">✨</span>
          <div>
            <div className="font-semibold">Grant 500 XP</div>
            <div className="text-[10px] text-gray-400">Test level progression</div>
          </div>
        </button>
        
        <button 
          onClick={() => { onAddItem(); onClose(); }}
          className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-3"
        >
          <span className="text-lg">📥</span>
          <div>
            <div className="font-semibold">Add Item</div>
            <div className="text-[10px] text-gray-400">Quick test item</div>
          </div>
        </button>
        
        <button 
          onClick={() => { if(window.confirm('Clear all data?')) { onClearData(); } }}
          className="w-full text-left p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300 flex items-center gap-3"
        >
          <span className="text-lg">🗑️</span>
          <div>
            <div className="font-semibold">Clear All Data</div>
            <div className="text-[10px] text-red-400/80">⚠️ Cannot be undone</div>
          </div>
        </button>
        
        <div className="pt-2 border-t border-white/10 text-center text-gray-500 text-[10px]">
          Dev mode is active • Data won't persist
        </div>
      </div>
    </div>
  );
};

export default DevTools;
