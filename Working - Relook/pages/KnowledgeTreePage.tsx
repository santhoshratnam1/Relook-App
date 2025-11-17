
import React from 'react';
import { User, Rewards } from '../types';
import KnowledgeTree from '../components/KnowledgeTree';

interface KnowledgeTreePageProps {
  user: User;
  rewards: Rewards;
  itemCount: number;
  deckCount: number;
  equippedItems: { [key: string]: string };
}

const KnowledgeTreePage: React.FC<KnowledgeTreePageProps> = ({ user, rewards, itemCount, deckCount, equippedItems }) => {
  const xpForNextLevel = 1000 * rewards.level;

  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">

      {/* --- Title --- */}
      <div className="text-center mt-4">
        <h2 className="text-4xl font-bold text-white tracking-tight">Knowledge Tree</h2>
        <p className="text-gray-400 text-sm mt-1">
          Your memory garden, growing with every new discovery.
        </p>
      </div>

      {/* --- Tree Container --- */}
      <div className="relative flex justify-center items-center mt-6">

        {/* Glowing Aura */}
        <div className="absolute w-60 h-60 rounded-full bg-gradient-to-b from-[#E6F0C6]/40 to-transparent blur-3xl opacity-40" />

        {/* Floating particles */}
        <div className="absolute animate-float-slow w-3 h-3 bg-[#E6F0C6] rounded-full top-6 left-20 opacity-80 blur-[1px]" />
        <div className="absolute animate-float-delayed w-2 h-2 bg-[#C0FFC0] rounded-full bottom-10 right-24 opacity-70 blur-[1px]" />
        <div className="absolute animate-float-slower w-4 h-4 bg-[#F5FFE0] rounded-full top-16 right-20 opacity-80 blur-[2px]" />

        {/* Tree Component */}
        <KnowledgeTree
          key={`${rewards.level}-${equippedItems.tree}-${equippedItems.companion}`}
          level={rewards.level}
          streak={rewards.streak}
          itemCount={itemCount}
          deckCount={deckCount}
          equippedItems={equippedItems}
        />
      </div>

      {/* --- Level Card --- */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-5 rounded-2xl text-center shadow-lg shadow-black/20">

        <p className="font-bold text-white text-xl">Level {rewards.level}</p>

        <div className="text-sm text-gray-400 mt-1">
          {rewards.xp} / {xpForNextLevel} XP to next level
        </div>

        {/* XP Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E6F0C6] to-[#A4D66E] transition-all duration-700"
            style={{ width: `${(rewards.xp / xpForNextLevel) * 100}%` }}
          />
        </div>

        {/* Streak */}
        {rewards.streak > 0 && (
          <p className="text-base font-semibold text-[#E6F0C6] mt-3">
            {rewards.streak} day streak 🔥
          </p>
        )}
      </div>
    </div>
  );
};

export default KnowledgeTreePage;