import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { ArrowLeftIcon } from '../components/IconComponents';
import { StoreItem, STORE_ITEMS } from '../data/store';

interface MyStuffPageProps {
  equippedItems: { [key: string]: string };
  onEquipItem: (item: StoreItem) => void;
  onBack: () => void;
}

type Category = 'avatar' | 'theme' | 'tree' | 'companion';

const MyStuffPage: React.FC<MyStuffPageProps> = ({ equippedItems, onEquipItem, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('avatar');
  const [purchasedItems] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('relook-purchased-items') || '[]')
  );

  const categories: { id: Category; label: string; icon: string; }[] = [
    { id: 'avatar', label: 'Avatars', icon: '👤' },
    { id: 'theme', label: 'Themes', icon: '🎨' },
    { id: 'tree', label: 'Trees', icon: '🌳' },
    { id: 'companion', label: 'Pets', icon: '🐾' },
  ];

  const myItems = STORE_ITEMS.filter(item => purchasedItems.includes(item.id));
  const filteredItems = myItems.filter(item => item.type === selectedCategory);

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
      </div>

      {/* Page Title */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-white mb-3">My Stuff</h1>
        <p className="text-gray-400">Your collection of unlocked items.</p>
      </div>

      {/* Category Filter */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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
        {filteredItems.length === 0 && (
          <div className="col-span-2 text-center text-gray-500 py-10">
            <p>No items in this category yet.</p>
            <p className="text-sm">Visit the store to unlock more!</p>
          </div>
        )}
        {filteredItems.map(item => {
          const isEquipped = equippedItems[item.type] === item.id;
          return (
            <div key={item.id} className="relative">
              <DashboardCard className="h-full">
                <div className="flex flex-col items-center text-center p-2 space-y-2">
                  <div className="text-5xl mb-1">{item.icon}</div>
                  <h3 className="font-bold text-white text-sm leading-tight min-h-[32px] flex items-center">{item.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">{item.description}</p>
                  
                  <div className="w-full pt-1">
                    <button
                      onClick={() => onEquipItem(item)}
                      className={`w-full py-2.5 px-3 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isEquipped
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isEquipped ? 'Equipped ✓' : 'Equip'}
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyStuffPage;
