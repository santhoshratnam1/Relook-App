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
}

const Dashboard: React.FC<DashboardProps> = ({ user, rewards, recentItems, onItemAdded, missions }) => {
  return (
    <>
      <UserProfile user={user} rewards={rewards} />
      <DailyMissions missions={missions} />
      <div className="mt-4">
        <h3 className="text-xl font-bold text-white px-6 mb-2">Add to Inbox</h3>
        <ImageClassifier onItemAdded={onItemAdded} />
        <Classifier onItemAdded={onItemAdded} />
      </div>
      <RecentSaves items={recentItems} />
    </>
  );
};

export default Dashboard;
