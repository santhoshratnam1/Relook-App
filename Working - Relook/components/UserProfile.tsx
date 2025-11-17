
import React from 'react';
import { User, Rewards } from '../types';
import ProgressBar from './ProgressBar';
import ImageLoader from './ImageLoader';

interface UserProfileProps {
  user: User;
  rewards: Rewards;
  equippedItems: { [key: string]: string };
}

const UserProfile: React.FC<UserProfileProps> = ({ user, rewards, equippedItems }) => {
  const xpForNextLevel = 1000 * rewards.level;

  // Get avatar border style based on purchased items
  const getAvatarBorderClass = () => {
    const equippedAvatar = equippedItems.avatar;
    if (equippedAvatar === 'avatar_rainbow_border') {
      return 'border-4 border-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-1 animate-shimmer';
    }
    if (equippedAvatar === 'avatar_gold_border') {
      return 'border-4 border-yellow-400 shadow-lg shadow-yellow-400/50';
    }
    return 'border-2 border-white/20';
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`rounded-full ${getAvatarBorderClass()}`}>
          <ImageLoader
            src={user.avatar_url}
            alt={user.display_name}
            className="w-16 h-16 rounded-full"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Welcome back,</h2>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">
            {user.display_name}
          </p>
        </div>
      </div>
      <div className="sub-card p-4 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-white">Level {rewards.level}</h3>
          <span className="text-sm font-semibold text-[#E6F0C6] flex items-center gap-1">
            <span>{rewards.streak}</span>
            <span>day streak 🔥</span>
          </span>
        </div>
        <ProgressBar value={rewards.xp} max={xpForNextLevel} />
      </div>
    </div>
  );
};

export default UserProfile;