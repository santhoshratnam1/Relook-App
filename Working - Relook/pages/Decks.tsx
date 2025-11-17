import React, { useState } from 'react';
import { Deck, Item } from '../types';
import { PlusIcon, BookOpenIcon } from '../components/IconComponents';
import CreateDeckModal from '../components/CreateDeckModal';
import DashboardCard from '../components/DashboardCard';

interface DecksPageProps {
  decks: Deck[];
  items: Item[];
  onCreateDeck: (deckData: { title: string; description: string; }) => void;
  onNavigate: (path: string) => void;
}

const DecksPage: React.FC<DecksPageProps> = ({ decks, items, onCreateDeck, onNavigate }) => {
  const [isCreating, setIsCreating] = useState(false);

  const getItemCountForDeck = (deckId: string) => {
    return items.filter(item => item.deck_ids?.includes(deckId)).length;
  };

  return (
    <>
      <div className="px-6 space-y-4">
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-2xl font-bold text-white">Decks</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 font-semibold py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Deck</span>
          </button>
        </div>
        
        {decks.length === 0 && (
          <div className="text-center py-16 text-gray-400 animate-fade-in">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
                <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-500 relative" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mt-4">Create Your First Deck</h3>
              <p className="text-sm mt-1 max-w-xs mx-auto">Decks are collections for your saved items. Get started by creating one!</p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-6 font-bold py-3 px-6 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all"
              >
                Create Deck
              </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {decks.map((deck) => (
            <div role="button" onClick={() => onNavigate(`/decks/${deck.id}`)} key={deck.id} className="block cursor-pointer">
              <DashboardCard className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white truncate">{deck.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{deck.description}</p>
                </div>
                <p className="text-xs text-gray-500 mt-3">{getItemCountForDeck(deck.id)} items</p>
              </DashboardCard>
            </div>
          ))}
        </div>
      </div>
      {isCreating && <CreateDeckModal onClose={() => setIsCreating(false)} onCreateDeck={onCreateDeck} />}
    </>
  );
};

export default DecksPage;