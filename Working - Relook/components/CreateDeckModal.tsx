import React, { useState } from 'react';
import Modal from './Modal';
import { XIcon } from './IconComponents';

interface CreateDeckModalProps {
  onClose: () => void;
  onCreateDeck: (deckData: { title: string; description: string }) => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ onClose, onCreateDeck }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateDeck({ title, description });
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
        <div className="relative">
            <h2 className="text-xl font-bold text-center text-white mb-4">Create New Deck</h2>
            <button onClick={onClose} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-white">
                <XIcon className="w-5 h-5" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="deck-title" className="text-sm font-semibold text-gray-300">Title</label>
                    <input
                        id="deck-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., 'Game Design Ideas'"
                        className="mt-1 w-full p-2 bg-[#0C0D0F] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="deck-description" className="text-sm font-semibold text-gray-300">Description</label>
                    <textarea
                        id="deck-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A short description of this collection"
                        className="mt-1 w-full h-20 p-2 bg-[#0C0D0F] border border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!title.trim()}
                >
                    Create Deck
                </button>
            </form>
        </div>
    </Modal>
  );
};

export default CreateDeckModal;