
import React from 'react';
import { User, Rewards } from '../types';
import ProgressBar from './ProgressBar';

interface UserProfileProps {
  user: User;
  rewards: Rewards;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, rewards }) => {
  const xpForNextLevel = 1000 * rewards.level;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.avatar_url}
          alt={user.display_name}
          className="w-16 h-16 rounded-full border-2 border-white/20"
        />
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back,</h2>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">{user.display_name}</p>
        </div>
      </div>
      <div className="bg-[#1a1b1e] p-4 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white">Level {rewards.level}</h3>
            <span className="text-sm font-semibold text-[#E6F0C6]">{rewards.streak} day streak 🔥</span>
        </div>
        <ProgressBar value={rewards.xp} max={xpForNextLevel} />
      </div>
    </div>
  );
};

export default UserProfile;
