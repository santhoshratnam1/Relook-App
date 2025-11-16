import React from 'react';
import UserProfile from '../components/UserProfile';
import RecentSaves from '../components/RecentSaves';
import Classifier from '../components/Classifier';
import ImageClassifier from '../components/ImageClassifier';
import DailyMissions from '../components/DailyMissions';
import { User, Rewards, Item, ContentType, SourceType, ExtractedEvent, Mission } from '../types';

interface DashboardProps {
  user: User;
  rewards: Rewards;
  recentItems: Item[];
  missions: Mission[];
  onItemAdded: (data: { title: string; body: string; content_type: ContentType; source_type: SourceType; extractedEvent: ExtractedEvent | null }) => void;
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, rewards, recentItems, onItemAdded, missions, onNavigate }) => {
  const allMissionsComplete = missions.every(m => m.progress >= m.goal);

  return (
    <>
      <UserProfile user={user} rewards={rewards} />
      <DailyMissions missions={missions} />

      {allMissionsComplete && missions.length > 0 && (
          <div className="px-6 my-2">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#E6F0C6]/20 to-[#F6F2D8]/20 border border-[#E6F0C6]/30 text-center">
              <p className="text-lg font-bold text-[#E6F0C6] mb-2">🎉 All Missions Complete!</p>
              <p className="text-sm text-gray-300 mb-3">Bonus challenges unlocked!</p>
              <button 
                onClick={() => onNavigate('/achievements')}
                className="px-4 py-2 rounded-full bg-[#E6F0C6] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                View Achievements
              </button>
            </div>
          </div>
        )}

      <div className="mt-4">
        <h3 className="text-xl font-bold text-white px-6 mb-2">Add to Inbox</h3>
        <ImageClassifier onItemAdded={onItemAdded} />
        <Classifier onItemAdded={onItemAdded} />
      </div>
      <RecentSaves items={recentItems} onNavigate={onNavigate} />
    </>
  );
};

export default Dashboard;
