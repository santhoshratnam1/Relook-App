import React from 'react';
import { Deck, Item, SourceType } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ScreenshotIcon } from '../components/IconComponents';

interface DeckDetailProps {
  deckId: string;
  decks: Deck[];
  items: Item[];
}

const SourceIcon = ({ type }: { type: SourceType }) => {
    switch (type) {
        case SourceType.Screenshot:
            return <ScreenshotIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-600 rounded-md" />;
    }
}

const DeckDetail: React.FC<DeckDetailProps> = ({ deckId, decks, items }) => {
  const deck = decks.find(d => d.id === deckId);
  const deckItems = items
    .filter(item => item.deck_ids?.includes(deckId))
    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (!deck) {
    return (
      <div className="px-6 text-center py-10">
        <h2 className="text-2xl font-bold text-white mt-4">Deck not found</h2>
        <a href="#/decks" className="text-sm text-[#E6F0C6] hover:underline mt-2">Go back to all decks</a>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-4">
      <div className="mt-4">
        <a href="#/decks" className="text-sm text-gray-400 hover:text-white transition-colors">&larr; All Decks</a>
        <h2 className="text-3xl font-bold text-white mt-2">{deck.title}</h2>
        <p className="text-gray-300 mt-1">{deck.description}</p>
      </div>

      <div className="space-y-4">
        {deckItems.length === 0 && (
            <p className="text-gray-400 text-center py-8">This deck is empty. Add items from your Inbox.</p>
        )}
        {deckItems.map((item) => (
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
                        <div className="mt-2">
                             <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                {item.content_type}
                            </span>
                        </div>
                    </div>
                </div>
            </DashboardCard>
        ))}
      </div>
    </div>
  );
};

export default DeckDetail;