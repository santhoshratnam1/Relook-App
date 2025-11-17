
import React, { useState, useMemo, useEffect } from 'react';
import { Item, SourceType, ContentType } from '../types';
import { XIcon, ScreenshotIcon, LinkIcon, EditIcon, DocumentIcon } from './IconComponents';

interface SearchModalProps {
  items: Item[];
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const SourceIcon = ({ type }: { type: SourceType }) => {
    switch (type) {
        case SourceType.Screenshot:
            return <ScreenshotIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.Bookmark:
            return <LinkIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.Manual:
            return <EditIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.FileUpload:
            return <DocumentIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-600 rounded-md" />;
    }
}

const SearchModal: React.FC<SearchModalProps> = ({ items, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<'all' | 'today' | '7d' | '30d'>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredItems = useMemo(() => {
    let results = [...items].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 1. Filter by text query
    if (debouncedQuery.trim()) {
      const lowerCaseQuery = debouncedQuery.toLowerCase();
      results = results.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerCaseQuery);
        const bodyMatch = item.body.toLowerCase().includes(lowerCaseQuery);
        const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
        return titleMatch || bodyMatch || tagsMatch;
      });
    }

    // 2. Filter by content type
    if (selectedType !== 'all') {
      results = results.filter(item => item.content_type === selectedType);
    }

    // 3. Filter by date range
    if (selectedDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      results = results.filter(item => {
        const itemDate = new Date(item.created_at);
        if (selectedDate === 'today') {
          return itemDate >= today;
        }
        if (selectedDate === '7d') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return itemDate >= sevenDaysAgo;
        }
        if (selectedDate === '30d') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return itemDate >= thirtyDaysAgo;
        }
        return true;
      });
    }
    
    // If no query and no filters, show recent 5.
    if (!debouncedQuery.trim() && selectedType === 'all' && selectedDate === 'all') {
      return results.slice(0, 5);
    }
    
    return results;
  }, [debouncedQuery, items, selectedType, selectedDate]);


  const handleItemClick = (itemId: string) => {
    onNavigate(`/item/${itemId}`);
    onClose();
  };

  const isShowingRecents = !debouncedQuery.trim() && selectedType === 'all' && selectedDate === 'all';

  const contentTypeFilters: {id: ContentType | 'all', label: string}[] = [
    { id: 'all', label: 'All' },
    { id: ContentType.Event, label: 'Event' },
    { id: ContentType.Job, label: 'Job' },
    { id: ContentType.Recipe, label: 'Recipe' },
    { id: ContentType.Portfolio, label: 'Portfolio' },
    { id: ContentType.Tutorial, label: 'Tutorial' },
    { id: ContentType.Offer, label: 'Offer' },
    { id: ContentType.Product, label: 'Product' },
  ];

  const dateFilters = [
    { id: 'all', label: 'Any time' },
    { id: 'today', label: 'Today' },
    { id: '7d', label: 'Last 7 days' },
    { id: '30d', label: 'Last 30 days' },
  ];

  return (
    <div className="fixed inset-0 bg-[#0C0D0F]/95 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
      <div className="p-4 flex items-center space-x-4 border-b border-white/10 safe-area-top">
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

      <div className="p-4 border-b border-white/10">
        <div className="space-y-3">
            <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 px-1">CONTENT TYPE</h4>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-2 pb-1 min-w-max">
                    {contentTypeFilters.map(filter => (
                      <button key={filter.id} onClick={() => setSelectedType(filter.id)} className={`px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${selectedType === filter.id ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                          {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
            </div>
             <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 px-1">DATE SAVED</h4>
                 <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-2 pb-1 min-w-max">
                    {dateFilters.map(filter => (
                      <button key={filter.id} onClick={() => setSelectedDate(filter.id as any)} className={`px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${selectedDate === filter.id ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                          {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isShowingRecents && filteredItems.length > 0 && (
          <h3 className="text-sm font-bold text-gray-500 px-3 pb-2">RECENT SAVES</h3>
        )}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No results found.</p>
        )}
        {filteredItems.map(item => {
          const urlMatch = item.body.match(/https?:\/\/[^\s]+/);
          return (
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
                    <p className="text-sm text-gray-400 line-clamp-2">{item.summary}</p>
                    {urlMatch && (
                      <a 
                        href={urlMatch[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline mt-1 block truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 {urlMatch[0]}
                      </a>
                    )}
                    <span className="mt-2 inline-block text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                      {item.content_type.replace('_', ' ')}
                    </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchModal;