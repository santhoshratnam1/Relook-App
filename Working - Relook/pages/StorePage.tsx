import React, { useState, useEffect, useRef } from 'react';
import { Rewards, User } from '../types';
import DashboardCard from '../components/DashboardCard';
import { ArrowLeftIcon } from '../components/IconComponents';
import { StoreItem, STORE_ITEMS } from '../data/store';

interface StorePageProps {
  user: User;
  rewards: Rewards;
  onBack: () => void;
  onPurchase: (itemId: string, price: number) => void;
}

const StorePage: React.FC<StorePageProps> = ({ user, rewards, onBack, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'avatar' | 'theme' | 'tree' | 'companion'>('all');
  const [purchasedItems, setPurchasedItems] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('relook-purchased-items') || '[]')
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPurchased, setLastPurchased] = useState<StoreItem | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (showSuccessModal) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showSuccessModal]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All', icon: '🛍️' },
    { id: 'avatar', label: 'Avatars', icon: '👤' },
    { id: 'theme', label: 'Themes', icon: '🎨' },
    { id: 'tree', label: 'Trees', icon: '🌳' },
    { id: 'companion', label: 'Pets', icon: '🐾' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.type === selectedCategory);

  const handlePurchase = (item: StoreItem) => {
    if (rewards.xp >= item.price && !purchasedItems.includes(item.id)) {
      // Clear any existing timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }

      onPurchase(item.id, item.price);
      const newPurchased = [...purchasedItems, item.id];
      setPurchasedItems(newPurchased);
      localStorage.setItem('relook-purchased-items', JSON.stringify(newPurchased));
      setLastPurchased(item);
      setShowSuccessModal(true);
      
      // Auto-close after 5 seconds (increased from 3)
      closeTimeoutRef.current = window.setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
    }
  };

  const handleCloseModal = () => {
    // Clear the auto-close timeout when manually closing
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowSuccessModal(false);
  };

  return (
    <>
      <div className="px-4 space-y-4 animate-fade-in pb-6">
        {/* Header */}
        <div className="pt-4 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors p-2 active:scale-95"
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>
        </div>

        {/* Store Title & XP Balance */}
        <div className="text-center py-4">
          <div className="text-4xl mb-2">✨</div>
          <h1 className="text-3xl font-bold text-white mb-3">Store</h1>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] px-5 py-2.5 rounded-full">
            <span className="text-black font-semibold">Your XP:</span>
            <span className="text-black text-xl font-bold">{rewards.xp}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black font-bold shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {filteredItems.map(item => {
            const isPurchased = purchasedItems.includes(item.id);
            const canAfford = rewards.xp >= item.price;

            return (
              <div key={item.id} className="relative">
                <DashboardCard className={`h-full ${isPurchased ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col items-center text-center p-2 space-y-2">
                    {/* Icon */}
                    <div className="text-5xl mb-1 animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                      {item.icon}
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-bold text-white text-sm leading-tight min-h-[32px] flex items-center">
                      {item.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">
                      {item.description}
                    </p>
                    
                    {/* Purchase Button */}
                    <div className="w-full pt-1">
                      {isPurchased ? (
                        <div className="py-2.5 px-3 rounded-full bg-green-500/20 text-green-300 text-xs font-bold flex items-center justify-center gap-1">
                          <span>✓</span>
                          <span>Owned</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 px-3 rounded-full text-xs font-bold transition-all active:scale-95 ${
                            canAfford
                              ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black shadow-lg hover:shadow-xl'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? `${item.price} XP` : 'Not enough XP'}
                        </button>
                      )}
                    </div>
                  </div>
                </DashboardCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Modal - Fixed Position */}
      {showSuccessModal && lastPurchased && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div 
            className="bg-gradient-to-br from-[#1a1b1e] to-[#2a2b2e] p-8 rounded-3xl border-2 border-[#E6F0C6] max-w-sm w-full text-center animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4 animate-bounce">{lastPurchased.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-2">Purchased!</h2>
            <h3 className="text-xl font-bold text-[#E6F0C6] mb-2">{lastPurchased.name}</h3>
            <p className="text-gray-400 mb-4">{lastPurchased.description}</p>
            <div className="bg-black/40 p-4 rounded-xl mb-4">
              <p className="text-sm text-gray-400 mb-1">Item added to your collection</p>
              <p className="text-lg font-bold text-white">Check it out in 'My Stuff'!</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              Awesome! ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StorePage;