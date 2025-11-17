
import React from 'react';
import { HomeIcon, InboxIcon, BookOpenIcon, TreeIcon, BellIcon } from './IconComponents';
import { hapticFeedback } from '../utils/haptics';

interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onNavigate: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ path, icon, label, isActive, onNavigate }) => (
  <button 
    onClick={() => {
      hapticFeedback('light');
      onNavigate(path);
    }}
    className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-200 min-h-[60px] active:scale-95 ${
      isActive 
        ? 'text-[#F6F2D8]' 
        : 'text-gray-500 active:text-gray-300'
    }`}
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    <div className={`transform transition-transform ${isActive ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
      {label}
    </span>
  </button>
);

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPath, onNavigate }) => {
  const navItems = [
    { path: '/', icon: <HomeIcon className="w-6 h-6" />, label: 'Home' },
    { path: '/inbox', icon: <InboxIcon className="w-6 h-6" />, label: 'Inbox' },
    { path: '/tree', icon: <TreeIcon className="w-6 h-6" />, label: 'Tree' },
    { path: '/reminders', icon: <BellIcon className="w-6 h-6" />, label: 'Reminders' },
    { path: '/decks', icon: <BookOpenIcon className="w-6 h-6" />, label: 'Decks' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1b1e]/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom z-40">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-stretch px-2">
          {navItems.map(item => {
            const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
            return <NavItem key={item.path} {...item} isActive={isActive} onNavigate={onNavigate} />;
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;