
import React from 'react';
import { MenuIcon, SearchIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
        <MenuIcon className="w-6 h-6 text-[#F6F2D8]" />
      </button>
      <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">
        RELOOK
      </h1>
      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
        <SearchIcon className="w-6 h-6 text-[#F6F2D8]" />
      </button>
    </header>
  );
};

export default Header;
