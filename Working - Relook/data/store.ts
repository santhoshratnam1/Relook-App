export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'avatar' | 'theme' | 'tree' | 'companion';
  icon: string;
  preview?: string;
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'avatar_gold_border',
    name: 'Golden Frame',
    description: 'Legendary golden avatar border',
    price: 500,
    type: 'avatar',
    icon: '👑',
  },
  {
    id: 'avatar_rainbow_border',
    name: 'Rainbow Aura',
    description: 'Mystical rainbow avatar effect',
    price: 1000,
    type: 'avatar',
    icon: '🌈',
  },
  {
    id: 'theme_dark_ocean',
    name: 'Ocean Depths',
    description: 'Deep blue theme with waves',
    price: 750,
    type: 'theme',
    icon: '🌊',
  },
  {
    id: 'theme_sunset',
    name: 'Sunset Glow',
    description: 'Warm orange and pink theme',
    price: 750,
    type: 'theme',
    icon: '🌅',
  },
  {
    id: 'tree_sakura',
    name: 'Cherry Blossom',
    description: 'Beautiful pink sakura tree',
    price: 1500,
    type: 'tree',
    icon: '🌸',
  },
  {
    id: 'tree_golden',
    name: 'Golden Tree',
    description: 'Majestic golden knowledge tree',
    price: 2000,
    type: 'tree',
    icon: '✨',
  },
  {
    id: 'companion_cat',
    name: 'Wise Cat',
    description: 'A curious cat companion for your tree',
    price: 800,
    type: 'companion',
    icon: '🐱',
  },
  {
    id: 'companion_bird',
    name: 'Singing Bird',
    description: 'A cheerful bird companion',
    price: 800,
    type: 'companion',
    icon: '🐦',
  },
  {
    id: 'companion_butterfly',
    name: 'Butterfly Swarm',
    description: 'Beautiful butterflies around your tree',
    price: 1200,
    type: 'companion',
    icon: '🦋',
  },
  {
    id: 'companion_dog',
    name: 'Loyal Dog',
    description: 'A faithful dog companion',
    price: 800,
    type: 'companion',
    icon: '🐕',
  },
];
