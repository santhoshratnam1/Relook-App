import React from 'react';
import { HomeIcon, InboxIcon, BellIcon, BookOpenIcon, TreeIcon } from './IconComponents';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => (
  <a 
    href={href} 
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-[#F6F2D8]' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </a>
);

interface NavigationProps {
  currentPath: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const cleanPath = currentPath.slice(1) || '/';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#1a1b1e]/80 backdrop-blur-lg border-t border-white/10 max-w-md mx-auto">
      <div className="flex justify-around items-center h-full">
        <NavItem 
          href="#/" 
          icon={<HomeIcon className="w-6 h-6" />} 
          label="Home" 
          isActive={cleanPath === '/'} 
        />
        <NavItem 
          href="#/inbox" 
          icon={<InboxIcon className="w-6 h-6" />} 
          label="Inbox" 
          isActive={cleanPath.startsWith('/inbox')} 
        />
        <NavItem 
          href="#/tree" 
          icon={<TreeIcon className="w-6 h-6" />} 
          label="Tree" 
          isActive={cleanPath.startsWith('/tree')} 
        />
        <NavItem 
          href="#/decks" 
          icon={<BookOpenIcon className="w-6 h-6" />} 
          label="Decks" 
          isActive={cleanPath.startsWith('/decks')} 
        />
        <NavItem 
          href="#/reminders" 
          icon={<BellIcon className="w-6 h-6" />} 
          label="Reminders" 
          isActive={cleanPath.startsWith('/reminders')} 
        />
      </div>
    </nav>
  );
};

export default Navigation;
