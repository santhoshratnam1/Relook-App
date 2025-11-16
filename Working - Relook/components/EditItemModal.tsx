import React, { useState } from 'react';
import { Item } from '../types';
import Modal from './Modal';
import { XIcon } from './IconComponents';

interface EditItemModalProps {
  item: Item;
  onClose: () => void;
  onSave: (data: { title: string; body: string }) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, body });
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
        <div className="relative">
            <h2 className="text-xl font-bold text-center text-white mb-4">Edit Item</h2>
            <button onClick={onClose} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-white">
                <XIcon className="w-5 h-5" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="item-title" className="text-sm font-semibold text-gray-300">Title</label>
                    <input
                        id="item-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 w-full p-2 bg-[#0C0D0F] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="item-body" className="text-sm font-semibold text-gray-300">Body</label>
                    <textarea
                        id="item-body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="mt-1 w-full h-40 p-2 bg-[#0C0D0F] border border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full font-semibold py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={!title.trim()}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </Modal>
  );
};

export default EditItemModal;