import React from 'react';
import { Achievement } from '../types';
import { ArrowLeftIcon } from '../components/IconComponents';

interface AchievementsPageProps {
  achievements: Achievement[];
  onBack: () => void;
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const percentage = Math.min(100, (achievement.progress / achievement.goal) * 100);
  const isUnlocked = achievement.unlocked;

  return (
    <div className={`p-4 rounded-2xl border ${isUnlocked ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1a1b1e] border-white/10'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold text-lg ${isUnlocked ? 'text-green-300' : 'text-white'}`}>{achievement.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
        </div>
        <div className="bg-black/40 py-1 px-3 rounded-full flex-shrink-0 ml-2">
          <p className="text-sm font-bold text-white">{achievement.reward}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{achievement.progress} / {achievement.goal}</span>
        </div>
        <div className="w-full h-2 bg-gray-200/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isUnlocked ? 'bg-green-400' : 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const AchievementsPage: React.FC<AchievementsPageProps> = ({ achievements, onBack }) => {
  return (
    <div className="px-6 space-y-4 animate-fade-in pb-6">
      <div className="mt-4 flex justify-between items-center">
        <button onClick={onBack} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeftIcon />
          <span>Back</span>
        </button>
      </div>
      <h1 className="text-3xl font-bold text-white">Achievements</h1>
      <div className="space-y-4">
        {achievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
      </div>
    </div>
  );
};

export default AchievementsPage;
