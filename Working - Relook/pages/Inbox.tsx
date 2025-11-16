import React, { useState } from 'react';
import { Item, SourceType, Deck } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ScreenshotIcon, DotsVerticalIcon } from '../components/IconComponents';
import AddToDeckModal from '../components/AddToDeckModal';

interface InboxProps {
  items: Item[];
  decks: Deck[];
  onAddItemToDeck: (itemId: string, deckId: string) => void;
  onCreateDeck: (deckData: { title: string; description: string }) => void;
}

const SourceIcon = ({ type }: { type: SourceType }) => {
    switch (type) {
        case SourceType.Screenshot:
            return <ScreenshotIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-600 rounded-md" />;
    }
}

const Inbox: React.FC<InboxProps> = ({ items, decks, onAddItemToDeck, onCreateDeck }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const decksById = new Map(decks.map(d => [d.id, d]));

  return (
    <>
      <div className="px-6 space-y-4">
          <h2 className="text-2xl font-bold text-white mt-4">Inbox</h2>
          {items.length === 0 && (
              <p className="text-gray-400 text-center py-8">Your inbox is empty. Add items from the Home screen.</p>
          )}
          {items.map((item) => (
              <DashboardCard key={item.id} className="hover:scale-[1.01]">
                  <div className="flex items-start space-x-4">
                      {item.thumbnail_url ? (
                          <img src={item.thumbnail_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                             <SourceIcon type={item.source_type} />
                          </div>
                      )}
                      <div className="flex-1 min-w-0">
                          <p className="font-bold text-white line-clamp-2">{item.title}</p>
                          <p className="text-sm text-gray-400 line-clamp-2 mt-1">{item.body}</p>
                          <div className="mt-2 flex items-center flex-wrap gap-2">
                               <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                  {item.content_type}
                              </span>
                              {item.deck_ids?.map(deckId => {
                                const deck = decksById.get(deckId);
                                return deck ? <span key={deckId} className="text-xs px-2 py-1 rounded-full bg-slate-600 text-slate-200">{deck.title}</span> : null;
                              })}
                          </div>
                      </div>
                      <button onClick={() => setSelectedItem(item)} className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                        <DotsVerticalIcon />
                      </button>
                  </div>
              </DashboardCard>
          ))}
      </div>
      {selectedItem && (
        <AddToDeckModal 
          item={selectedItem}
          decks={decks}
          onClose={() => setSelectedItem(null)}
          onAddItemToDeck={onAddItemToDeck}
          onCreateDeck={onCreateDeck}
        />
      )}
    </>
  );
};

export default Inbox;