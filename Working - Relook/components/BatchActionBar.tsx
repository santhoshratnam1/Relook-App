import React from 'react';
import { FolderPlusIcon, TrashIcon } from './IconComponents';

interface BatchActionBarProps {
  selectedCount: number;
  onAddToDeck: () => void;
  onDelete: () => void;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({ selectedCount, onAddToDeck, onDelete }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 batch-action-bar safe-area-bottom pb-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-[#2a2b2e] border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg">
          <span className="font-semibold text-white px-2">{selectedCount} selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddToDeck}
              className="flex items-center gap-2 font-semibold text-sm py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FolderPlusIcon className="w-5 h-5" />
              <span>Add to Deck</span>
            </button>
            <button
              onClick={onDelete}
              className="p-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              aria-label="Delete selected items"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchActionBar;