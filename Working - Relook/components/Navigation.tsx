import React from 'react';
import { HomeIcon, InboxIcon, BellIcon, BookOpenIcon, TreeIcon } from './IconComponents';

interface NavItemProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onNavigate: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ path, icon, label, isActive, onNavigate }) => (
  <button 
    onClick={() => onNavigate(path)}
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-[#F6F2D8]' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
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
    { path: '/decks', icon: <BookOpenIcon className="w-6 h-6" />, label: 'Decks' },
    { path: '/reminders', icon: <BellIcon className="w-6 h-6" />, label: 'Reminders' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#1a1b1e]/80 backdrop-blur-lg border-t border-white/10 max-w-md mx-auto">
      <div className="flex justify-around items-center h-full">
        {navItems.map(item => {
          const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
          return <NavItem key={item.path} {...item} isActive={isActive} onNavigate={onNavigate} />;
        })}
      </div>
    </nav>
  );
};

export default Navigation;