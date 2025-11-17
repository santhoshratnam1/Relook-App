
import React from 'react';
import UserProfile from '../components/UserProfile';
import RecentSaves from '../components/RecentSaves';
import Classifier from '../components/Classifier';
import ImageClassifier from '../components/ImageClassifier';
import BookmarkClassifier from '../components/BookmarkClassifier';
import DailyMissions from '../components/DailyMissions';
import { 
    User, Rewards, Item, Mission, Achievement
} from '../types';

type AddItemPayload = Omit<Item, 'id' | 'user_id' | 'created_at' | 'status' | 'thumbnail_url' | 'reminder_id' | 'deck_ids' | 'design_data' | 'education_data'>;

interface DashboardProps {
  user: User;
  rewards: Rewards;
  recentItems: Item[];
  missions: Mission[];
  achievements: Achievement[];
  equippedItems: { [key: string]: string };
  onItemAdded: (data: AddItemPayload) => void;
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  rewards, 
  recentItems, 
  onItemAdded, 
  missions, 
  achievements,
  onNavigate,
  equippedItems
}) => {
  const allMissionsComplete = missions.every(m => m.progress >= m.goal);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="pb-6">
      {/* User Profile - No padding, has its own */}
      <UserProfile user={user} rewards={rewards} equippedItems={equippedItems} />

      {/* Achievement Badge */}
      <div className="px-4 mb-4">
        <button
          onClick={() => onNavigate('/achievements')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl flex items-center justify-between hover:opacity-90 active:scale-98 transition-all shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏆</span>
            <div className="text-left">
              <p className="font-bold text-white text-sm">Achievements</p>
              <p className="text-xs text-white/90">
                {unlockedAchievements} / {achievements.length} Unlocked
              </p>
            </div>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-5 h-5 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Daily Missions */}
      <div className="mb-4">
        <DailyMissions missions={missions} />
      </div>

      {/* All Missions Complete Banner */}
      {allMissionsComplete && missions.length > 0 && (
        <div className="px-4 mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E6F0C6]/20 to-[#F6F2D8]/20 border border-[#E6F0C6]/30 text-center">
            <p className="text-lg font-bold text-[#E6F0C6] mb-2">🎉 All Missions Complete!</p>
            <p className="text-sm text-gray-300 mb-3">Great work! Come back tomorrow for new challenges.</p>
            <button 
              onClick={() => onNavigate('/store')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Visit Store 🛍️
            </button>
          </div>
        </div>
      )}

      {/* Add to Inbox Section */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white px-4 mb-3">Add to Inbox</h3>
        <div className="space-y-3">
          <ImageClassifier onItemAdded={onItemAdded} />
          <Classifier onItemAdded={onItemAdded} />
          <BookmarkClassifier onItemAdded={onItemAdded} />
        </div>
      </div>

      {/* Recent Saves */}
      {recentItems.length > 0 && (
        <div className="mt-6">
          <RecentSaves items={recentItems} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;