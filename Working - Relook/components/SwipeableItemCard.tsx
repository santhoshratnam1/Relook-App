
import React, { useState, ReactNode } from 'react';
import { Item } from '../types';
import { FolderPlusIcon, TrashIcon } from './IconComponents';

interface SwipeableItemCardProps {
    item: Item;
    onDelete: (itemId: string) => void;
    onAddToDeck: (item: Item) => void;
    children: ReactNode;
}

const SwipeableItemCard: React.FC<SwipeableItemCardProps> = ({ item, onDelete, onAddToDeck, children }) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [showConfirm, setShowConfirm] = useState<'delete' | 'addToDeck' | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
        const distance = e.targetTouches[0].clientX - touchStart;
        setSwipeOffset(Math.max(-150, Math.min(150, distance)));
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            setShowConfirm('delete');
            setSwipeOffset(-150);
        } else if (isRightSwipe) {
            setShowConfirm('addToDeck');
            setSwipeOffset(150);
        } else {
            setSwipeOffset(0);
            setShowConfirm(null);
        }
    };

    const handleDelete = () => {
        onDelete(item.id);
        setSwipeOffset(0);
        setShowConfirm(null);
    };

    const handleAddToDeck = () => {
        onAddToDeck(item);
        setSwipeOffset(0);
        setShowConfirm(null);
    };

    const resetSwipe = () => {
        setSwipeOffset(0);
        setShowConfirm(null);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-y-0 left-0 w-32 bg-blue-600 flex items-center justify-center">
                <FolderPlusIcon className="w-8 h-8 text-white" />
            </div>
            
            <div className="absolute inset-y-0 right-0 w-32 bg-red-600 flex items-center justify-center">
                <TrashIcon className="w-8 h-8 text-white" />
            </div>

            <div
                className="relative"
                style={{
                    transform: `translateX(${swipeOffset}px)`,
                    transition: showConfirm ? 'transform 0.3s ease-out' : 'none'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {children}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={resetSwipe}>
                    <div className="bg-[#1a1b1e] p-6 rounded-3xl border border-white/10 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {showConfirm === 'delete' ? 'Delete Item?' : 'Add to Deck?'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            {showConfirm === 'delete'
                                ? 'This item will be permanently deleted.'
                                : 'This will add the item to a relevant deck, creating one if needed.'}
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={resetSwipe}
                                className="flex-1 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={showConfirm === 'delete' ? handleDelete : handleAddToDeck}
                                className={`flex-1 py-2 px-4 rounded-full text-white font-bold transition-opacity ${showConfirm === 'delete'
                                        ? 'bg-red-600 hover:opacity-90'
                                        : 'bg-blue-600 hover:opacity-90'
                                    }`}
                            >
                                {showConfirm === 'delete' ? 'Delete' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SwipeableItemCard;