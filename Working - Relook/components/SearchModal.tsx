import React, { useState, useMemo } from 'react';
import { Item, SourceType } from '../types';
import { XIcon, ScreenshotIcon } from './IconComponents';

interface SearchModalProps {
  items: Item[];
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const SourceIcon = ({ type }: { type: SourceType }) => {
    switch (type) {
        case SourceType.Screenshot:
            return <ScreenshotIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-600 rounded-md" />;
    }
}

const SearchModal: React.FC<SearchModalProps> = ({ items, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerCaseQuery = query.toLowerCase();
    return items.filter(
      item =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.body.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, items]);

  const handleItemClick = (itemId: string) => {
    onNavigate(`/item/${itemId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0C0D0F]/95 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
      <div className="p-4 flex items-center space-x-4 border-b border-white/10">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search your memories..."
          className="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none"
          autoFocus
        />
        <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {query.trim() && filteredItems.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No results found for "{query}"</p>
        )}
        {filteredItems.map(item => (
          <div
            key={item.id}
            role="button"
            onClick={() => handleItemClick(item.id)}
            className="block p-3 rounded-xl bg-[#1a1b1e] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-3">
               <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0 mt-1">
                  <SourceIcon type={item.source_type} />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{item.title}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.body}</p>
                  <span className="mt-2 inline-block text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                    {item.content_type}
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchModal;