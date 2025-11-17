import React, { useState } from 'react';
import { Item, SourceType, Deck, ContentType } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ScreenshotIcon, BellIcon, LinkIcon, EditIcon, DocumentIcon, MicrophoneIcon, InboxIcon as InboxEmptyIcon } from '../components/IconComponents';
import SwipeableItemCard from '../components/SwipeableItemCard';
import ImageLoader from '../components/ImageLoader';

interface InboxProps {
  items: Item[];
  decks: Deck[];
  onAutoAddItemToDeck: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
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
        case SourceType.VoiceMemo:
            return <MicrophoneIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-600 rounded-md" />;
    }
}

const Inbox: React.FC<InboxProps> = ({ items, decks, onAutoAddItemToDeck, onDeleteItem, onNavigate }) => {
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // FIX: Explicitly type the Map to ensure correct type inference for `deck`.
  const decksById = new Map<string, Deck>(decks.map(d => [d.id, d]));

  const handleDeleteWithAnimation = (itemId: string) => {
    setDeletingItemId(itemId);
    setTimeout(() => {
      onDeleteItem(itemId);
      setDeletingItemId(null);
    }, 300); // Corresponds to animation duration
  };

  return (
    <>
      <div className="px-6 space-y-4 pb-6">
          <h2 className="text-2xl font-bold text-white mt-4">Inbox</h2>
          {items.length === 0 && (
              <div className="text-center py-16 text-gray-400 animate-fade-in">
                <InboxEmptyIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-300">All caught up!</h3>
                <p className="text-sm mt-1">Your inbox is clear. New items you save will appear here.</p>
              </div>
          )}
          {items.map((item) => (
            <div key={item.id} className={deletingItemId === item.id ? 'item-deleting' : ''}>
              <SwipeableItemCard
                item={item}
                onDelete={handleDeleteWithAnimation}
                onAddToDeck={onAutoAddItemToDeck}
              >
                <div onClick={() => onNavigate(`/item/${item.id}`)} className="cursor-pointer">
                  <DashboardCard>
                      <div className="flex items-start space-x-4">
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
                                      {item.content_type}
                                  </span>
                                  {item.recipe_data && (
                                      <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 flex items-center gap-1">
                                        🍳 {item.recipe_data.ingredients.length} ingredients
                                      </span>
                                  )}
                                  {item.tags?.slice(0, 2).map((tag, i) => (
                                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-600/70 text-slate-300">
                                          {tag}
                                      </span>
                                  ))}
                                  {item.reminder_id && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center gap-1">
                                      <BellIcon className="w-3 h-3" />
                                      <span>Reminder</span>
                                    </span>
                                  )}
                                  {item.deck_ids?.map(deckId => {
                                    const deck = decksById.get(deckId);
                                    return deck ? <span key={deckId} className="text-xs px-2 py-1 rounded-full bg-slate-600 text-slate-200">{deck.title}</span> : null;
                                  })}
                              </div>
                          </div>
                          <div className="text-xs text-gray-500 self-center">
                            Swipe
                          </div>
                      </div>
                  </DashboardCard>
                </div>
              </SwipeableItemCard>
            </div>
          ))}
      </div>
    </>
  );
};

export default Inbox;