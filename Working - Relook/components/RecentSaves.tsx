import React from 'react';
import { Item, SourceType } from '../types';
import DashboardCard from './DashboardCard';
import { ScreenshotIcon } from './IconComponents';

interface RecentSavesProps {
  items: Item[];
  onNavigate: (path: string) => void;
}

const SourceIcon = ({ type }: { type: SourceType }) => {
    switch (type) {
        case SourceType.Screenshot:
            return <ScreenshotIcon className="w-4 h-4 text-gray-400" />;
        // Add other source icons here
        default:
            return <div className="w-4 h-4 bg-gray-500 rounded-sm" />;
    }
}

const RecentSaves: React.FC<RecentSavesProps> = ({ items, onNavigate }) => {
  return (
    <div className="px-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Recent Saves</h3>
        {items.map((item, index) => (
            <div 
              role="button"
              onClick={() => onNavigate(`/item/${item.id}`)}
              key={item.id} 
              className={`block cursor-pointer ${index === 0 ? "animate-fade-in" : ""}`}
            >
                <DashboardCard>
                    <div className="flex items-start space-x-4">
                        {item.thumbnail_url ? (
                            <img src={item.thumbnail_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center">
                               <SourceIcon type={item.source_type} />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-bold text-white line-clamp-2">{item.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">{item.body}</p>
                            <div className="mt-2">
                                 <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                    {item.content_type}
                                </span>
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        ))}
    </div>
  );
};

export default RecentSaves;