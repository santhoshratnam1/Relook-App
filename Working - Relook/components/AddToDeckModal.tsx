import React, { useState } from 'react';
import { Item, Deck } from '../types';
import Modal from './Modal';
import { BookOpenIcon, PlusIcon } from './IconComponents';
import CreateDeckModal from './CreateDeckModal';

interface AddToDeckModalProps {
  item: Item;
  decks: Deck[];
  onClose: () => void;
  onAddItemToDeck: (itemId: string, deckId: string) => void;
  onCreateDeck: (deckData: { title: string; description: string }) => void;
}

const AddToDeckModal: React.FC<AddToDeckModalProps> = ({ item, decks, onClose, onAddItemToDeck, onCreateDeck }) => {
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  
  const handleAddToDeck = (deckId: string) => {
    onAddItemToDeck(item.id, deckId);
    onClose();
  }

  const handleDeckCreated = (deckData: { title: string; description: string }) => {
    onCreateDeck(deckData);
    setIsCreatingDeck(false); 
  }

  if (isCreatingDeck) {
    return <CreateDeckModal onClose={() => setIsCreatingDeck(false)} onCreateDeck={handleDeckCreated} />
  }

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center text-white">Add to Deck</h3>
        <p className="text-sm text-gray-400 line-clamp-2">"{item.title}"</p>
        
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {decks.length > 0 ? decks.map(deck => (
                <button 
                    key={deck.id}
                    onClick={() => handleAddToDeck(deck.id)}
                    disabled={item.deck_ids?.includes(deck.id)}
                    className="w-full text-left p-3 rounded-lg bg-[#0C0D0F] hover:bg-white/10 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <BookOpenIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span>{deck.title}</span>
                </button>
            )) : <p className="text-sm text-gray-500 text-center py-4">No decks yet. Create one!</p>}
        </div>

        <button 
            onClick={() => setIsCreatingDeck(true)}
            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
            <PlusIcon className="w-5 h-5"/>
            <span>Create New Deck</span>
        </button>
      </div>
    </Modal>
  );
};

export default AddToDeckModal;