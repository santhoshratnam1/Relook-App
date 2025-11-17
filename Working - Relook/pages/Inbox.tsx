

import React, { useState, useMemo } from 'react';
import { Item, SourceType, Deck, ContentType } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ScreenshotIcon, BellIcon, LinkIcon, EditIcon, DocumentIcon, MicrophoneIcon, InboxIcon } from '../components/IconComponents';
import SwipeableItemCard from '../components/SwipeableItemCard';
import ImageLoader from '../components/ImageLoader';
import BatchActionBar from '../components/BatchActionBar';
import BulkAddToDeckModal from '../components/BulkAddToDeckModal';

interface InboxProps {
  items: Item[];
  decks: Deck[];
  onAutoAddItemToDeck: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  onNavigate: (path: string) => void;
  isSelectMode: boolean;
  onToggleSelectMode: () => void;
  selectedItemIds: string[];
  onSelectItem: (itemId: string) => void;
  onBulkDelete: () => void;
  onBulkAddToDeck: (deckId: string) => void;
  onCreateDeck: (deckData: { title: string; description: string; }) => Deck;
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
        case SourceType.VoiceMemo:
            return <MicrophoneIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-600 rounded-md" />;
    }
}

const Inbox: React.FC<InboxProps> = ({ 
    items, decks, onAutoAddItemToDeck, onDeleteItem, onNavigate,
    isSelectMode, onToggleSelectMode, selectedItemIds, onSelectItem,
    onBulkDelete, onBulkAddToDeck, onCreateDeck
}) => {
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unorganized'>('all');
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);

  const decksById = new Map<string, Deck>(decks.map(d => [d.id, d]));

  const filteredItems = useMemo(() => {
    if (filter === 'unorganized') {
      return items.filter(item => !item.deck_ids || item.deck_ids.length === 0);
    }
    return items;
  }, [items, filter]);

  const handleDeleteWithAnimation = (itemId: string) => {
    setDeletingItemId(itemId);
    setTimeout(() => {
      onDeleteItem(itemId);
      setDeletingItemId(null);
    }, 300); // Corresponds to animation duration
  };

  const handleItemClick = (item: Item) => {
    if (isSelectMode) {
        onSelectItem(item.id);
    } else {
        onNavigate(`/item/${item.id}`);
    }
  };

  return (
    <>
      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 150px)' }}>
          <div className="px-4 pt-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">Inbox</h2>
                  <div className="flex items-center gap-2">
                      <button
                          onClick={() => setFilter(filter === 'all' ? 'unorganized' : 'all')}
                          className="font-semibold text-sm py-2 px-4 rounded-full bg-[#1F1F23] border border-white/10 text-gray-300 hover:border-white/30 transition-colors"
                      >
                          {filter === 'all' ? 'All Items' : 'Unorganized'}
                      </button>
                      <button 
                          onClick={onToggleSelectMode} 
                          className={`font-semibold text-sm py-2 px-4 rounded-full transition-colors ${isSelectMode ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black' : 'bg-[#1F1F23] border border-white/10 text-gray-300 hover:border-white/30'}`}
                      >
                          {isSelectMode ? 'Cancel' : 'Select'}
                      </button>
                  </div>
              </div>
          </div>

          {filteredItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center px-4 text-gray-500 animate-fade-in">
                  <InboxIcon className="w-16 h-16 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-300">
                      All Caught Up!
                  </h3>
                  <p className="text-base mt-2 max-w-xs mx-auto">
                      Your inbox is clear. New items you save will appear here.
                  </p>
              </div>
          ) : (
              <div className={`px-4 space-y-4 py-4 overflow-y-auto ${isSelectMode ? 'pb-28' : 'pb-6'}`}>
                  {filteredItems.map((item) => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                          <div 
                              key={item.id} 
                              className={`${deletingItemId === item.id ? 'item-deleting' : ''} ${isSelectMode ? `item-card-selectable ${isSelected ? 'item-card-selected' : ''}` : ''}`}
                              onClick={() => handleItemClick(item)}
                          >
                              <SwipeableItemCard
                                  item={item}
                                  onDelete={handleDeleteWithAnimation}
                                  onAddToDeck={onAutoAddItemToDeck}
                                  disabled={isSelectMode}
                              >
                                  <div className="cursor-pointer">
                                      <DashboardCard>
                                          <div className="flex items-start space-x-4">
                                              {isSelectMode && (
                                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 self-center ${isSelected ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] border-[#E6F0C6]' : 'border-gray-500'}`}>
                                                      {isSelected && <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                  </div>
                                              )}
                                              {item.thumbnail_url ? (
                                                  <ImageLoader src={item.thumbnail_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                                              ) : (
                                                  <div className="w-16 h-16 rounded-xl bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                                                      <SourceIcon type={item.source_type} />
                                                  </div>
                                              )}
                                              <div className="flex-1 min-w-0">
                                                  <p className="font-bold text-white line-clamp-2">{item.title}</p>
                                                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">{item.summary}</p>
                                                  <div className="mt-2 flex items-center flex-wrap gap-2">
                                                      <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                                          {item.content_type.replace('_', ' ')}
                                                      </span>
                                                      {item.deck_ids?.map(deckId => {
                                                          const deck = decksById.get(deckId);
                                                          return deck ? <span key={deckId} className="text-xs px-2 py-1 rounded-full bg-slate-600 text-slate-200">{deck.title}</span> : null;
                                                      })}
                                                  </div>
                                              </div>
                                              {!isSelectMode && (
                                                  <div className="text-xs text-gray-500 self-center">
                                                      Swipe
                                                  </div>
                                              )}
                                          </div>
                                      </DashboardCard>
                                  </div>
                              </SwipeableItemCard>
                          </div>
                      )
                  })}
              </div>
          )}
      </div>
      {isSelectMode && selectedItemIds.length > 0 && (
        <BatchActionBar 
            selectedCount={selectedItemIds.length}
            onAddToDeck={() => setIsBulkAddModalOpen(true)}
            onDelete={onBulkDelete}
        />
      )}
      {isBulkAddModalOpen && (
        <BulkAddToDeckModal
            decks={decks}
            onClose={() => setIsBulkAddModalOpen(false)}
            onAdd={onBulkAddToDeck}
            onCreateDeck={onCreateDeck}
        />
      )}
    </>
  );
};

export default Inbox;