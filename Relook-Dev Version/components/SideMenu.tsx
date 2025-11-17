import React from 'react';
import { User, Rewards } from '../types';
import { XIcon } from './IconComponents';
import ImageLoader from './ImageLoader';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  rewards: Rewards;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user, rewards, onNavigate, onLogout }) => {
  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" style={{ animationDuration: '0.3s' }} onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#1a1b1e] border-r border-white/10 p-6 animate-slide-in-left flex flex-col">
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="space-y-4">
                <div 
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10"
                    onClick={() => handleNavigate('/profile')}
                >
                    <ImageLoader src={user.avatar_url} alt={user.display_name} className="w-12 h-12 rounded-full" />
                    <div>
                    <p className="font-bold text-white">{user.display_name}</p>
                    <p className="text-sm text-gray-400">Level {rewards.level}</p>
                    </div>
                </div>
            
                <div className="space-y-2 pt-4 border-t border-white/10">
                    <button onClick={() => handleNavigate('/insights')} className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center space-x-3">
                    <span className="text-xl w-5 text-center">📊</span>
                    <span>Insights</span>
                    </button>
                    <button onClick={() => handleNavigate('/store')} className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center space-x-3">
                    <span className="text-xl w-5 text-center">🛍️</span>
                    <span>Store</span>
                    </button>
                    <button onClick={() => handleNavigate('/my-stuff')} className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors flex items-center space-x-3">
                    <span className="text-xl w-5 text-center">🎒</span>
                    <span>My Stuff</span>
                    </button>
                    <button onClick={() => handleNavigate('/profile')} className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                    Profile & Settings
                    </button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                    Export Data
                    </button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                    About RELOOK
                    </button>
                </div>
            </div>
        </div>
        <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
            <button onClick={onLogout} className="w-full text-left p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
              Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;