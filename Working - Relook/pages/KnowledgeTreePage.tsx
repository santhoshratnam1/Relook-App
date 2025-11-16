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
    <div className="px-6 space-y-4 animate-fade-in">
        <div className="text-center mt-4">
            <h2 className="text-3xl font-bold text-white">Knowledge Tree</h2>
            <p className="text-gray-400">Your memory garden, growing with every new discovery.</p>
        </div>

        <KnowledgeTree 
            key={`${rewards.level}-${equippedItems.tree}-${equippedItems.companion}`}
            level={rewards.level} 
            streak={rewards.streak}
            itemCount={itemCount}
            deckCount={deckCount}
            equippedItems={equippedItems}
        />

        <div className="sub-card p-4 rounded-2xl border border-white/10 text-center">
            <p className="font-bold text-white text-lg">Level {rewards.level}</p>
            <p className="text-sm text-gray-400">{rewards.xp} / {xpForNextLevel} XP to next level</p>
            {rewards.streak > 0 && 
                <p className="text-lg font-semibold text-[#E6F0C6] mt-2">{rewards.streak} day streak 🔥</p>
            }
        </div>
    </div>
  );
};

export default KnowledgeTreePage;