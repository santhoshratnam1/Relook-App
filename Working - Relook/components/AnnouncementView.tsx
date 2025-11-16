import React from 'react';
import { AnnouncementData } from '../types';
import InfoRow from './InfoRow';

interface AnnouncementViewProps {
  announcement: AnnouncementData;
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ announcement }) => {
  return (
    <dl>
        <InfoRow label="Announcement" value={announcement.title} icon="📢" />
        <InfoRow label="Type" value={announcement.type} icon="🏷️" />
        <InfoRow label="Effective From" value={announcement.effectiveFrom} icon="📅" />
        <InfoRow label="Impact" value={announcement.impact} icon="💥" />
        <InfoRow 
            label="Team Involved" 
            value={announcement.teamInvolved && announcement.teamInvolved.join(', ')} 
            icon="👥" 
        />
        <InfoRow 
            label="More Info" 
            value={
                announcement.moreInfoLink ? (
                    <a href={announcement.moreInfoLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {announcement.moreInfoLink}
                    </a>
                ) : undefined
            }
            icon="🔗"
        />
    </dl>
  );
};

export default AnnouncementView;
