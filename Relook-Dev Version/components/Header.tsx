
import React from 'react';
import { MenuIcon, SearchIcon } from './IconComponents';

interface HeaderProps {
    onMenuClick: () => void;
    onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick }) => {
  return (
    <header className="flex justify-between items-center p-4 safe-area-top sticky top-0 z-30 bg-[#0C0D0F]/80 backdrop-blur-lg">
      <button 
        onClick={onMenuClick} 
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6 text-[#F6F2D8]" />
      </button>
      <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">
        RELOOK
      </h1>
      <button 
        onClick={onSearchClick} 
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
        aria-label="Search"
      >
        <SearchIcon className="w-6 h-6 text-[#F6F2D8]" />
      </button>
    </header>
  );
};

export default Header;