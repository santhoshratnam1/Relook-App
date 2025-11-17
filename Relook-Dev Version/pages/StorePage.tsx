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
  isDevMode?: boolean;
}

const StorePage: React.FC<StorePageProps> = ({ user, rewards, onBack, onPurchase, isDevMode = false }) => {
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

  // FIX: Complete the categories array
  const categories = [
    { id: 'all', label: 'All', icon: '🛍️' },
    { id: 'avatar', label: 'Avatars', icon: '👤' },
    { id: 'theme', label: 'Themes', icon: '🎨' },
    { id: 'tree', label: 'Trees', icon: '🌳' },
    { id: 'companion', label: 'Pets', icon: '🐾' },
  ];

  const handlePurchase = (item: StoreItem) => {
    if (isDevMode) {
      alert('⚠️ Cannot purchase items in dev mode. Exit dev mode to unlock real customizations.');
      return;
    }
    if (rewards.xp >= item.price && !purchasedItems.includes(item.id)) {
      onPurchase(item.id, item.price);
      const newPurchasedItems = [...purchasedItems, item.id];
      setPurchasedItems(newPurchasedItems);
      localStorage.setItem('relook-purchased-items', JSON.stringify(newPurchasedItems));
      
      setLastPurchased(item);
      setShowSuccessModal(true);
      
      if(closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
  };

  const filteredItems = STORE_ITEMS.filter(item => 
    selectedCategory === 'all' || item.type === selectedCategory
  );

  return (
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
        <div className="bg-white/10 px-4 py-2 rounded-full">
          <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">
            {rewards.xp.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-white mb-3">Store</h1>
        <p className="text-gray-400">Spend your XP on customizations.</p>
        {isDevMode && (
            <div className="mt-2 mx-auto max-w-xs bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
            <p className="text-xs text-yellow-300">🧪 Purchases disabled in dev mode</p>
            </div>
        )}
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

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {filteredItems.map(item => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = rewards.xp >= item.price;
          return (
            <div key={item.id} className="relative">
              <DashboardCard className="h-full">
                <div className="flex flex-col items-center text-center p-2 space-y-2">
                  <div className="text-5xl mb-1">{item.icon}</div>
                  <h3 className="font-bold text-white text-sm leading-tight min-h-[32px] flex items-center">{item.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">{item.description}</p>
                  
                  <div className="w-full pt-1">
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={isPurchased || !canAfford}
                      className={`w-full py-2.5 px-3 rounded-full text-xs font-bold transition-all active:scale-95 disabled:cursor-not-allowed ${
                        isPurchased
                          ? 'bg-green-500/20 text-green-300'
                          : canAfford
                          ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black shadow-lg hover:shadow-xl'
                          : 'bg-white/10 text-gray-500'
                      }`}
                    >
                      {isPurchased ? 'Owned ✓' : `${item.price} XP`}
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </div>
          );
        })}
      </div>

      {showSuccessModal && lastPurchased && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="bg-[#1a1b1e] p-6 rounded-3xl border border-white/10 max-w-sm mx-4 text-center animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">{lastPurchased.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
            <p className="text-gray-300">
              You've unlocked the <span className="font-bold text-[#E6F0C6]">{lastPurchased.name}</span>!
            </p>
            <p className="text-gray-400 text-sm mt-1">
              You can equip it from the "My Stuff" page in the menu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;