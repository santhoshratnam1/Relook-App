import React from 'react';
import { Item, SourceType } from '../types';
import DashboardCard from './DashboardCard';
import { ScreenshotIcon, BellIcon, LinkIcon, EditIcon, DocumentIcon, MicrophoneIcon } from './IconComponents';
import ImageLoader from './ImageLoader';

interface RecentSavesProps {
  items: Item[];
  onNavigate: (path: string) => void;
}

const SourceIcon = ({ type }: { type: SourceType }) => {
    switch (type) {
        case SourceType.Screenshot:
            return <ScreenshotIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.Bookmark:
            return <LinkIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.Manual:
            return <EditIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.FileUpload:
            return <DocumentIcon className="w-5 h-5 text-gray-400" />;
        case SourceType.VoiceMemo:
            return <MicrophoneIcon className="w-5 h-5 text-gray-400" />;
        default:
            return <div className="w-5 h-5 bg-gray-500 rounded-sm" />;
    }
}

const RecentSaves: React.FC<RecentSavesProps> = ({ items, onNavigate }) => {
  return (
    <div className="px-4 space-y-3">
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
                            <ImageLoader src={item.thumbnail_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0">
                               <SourceIcon type={item.source_type} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-white line-clamp-2">{item.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1 mt-1">{item.summary}</p>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                 <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                    {item.content_type}
                                </span>
                                {item.tags?.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-600/70 text-slate-300">
                                        {tag}
                                    </span>
                                ))}
                                {item.reminder_id && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center gap-1">
                                    <BellIcon className="w-3 h-3" />
                                    <span>Reminder</span>
                                  </span>
                                )}
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