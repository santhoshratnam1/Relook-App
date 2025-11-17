import React from 'react';
import { TeamSpotlightData } from '../types';
import InfoRow from './InfoRow';
import { MapPinIcon } from './IconComponents';

interface TeamSpotlightViewProps {
  spotlight: TeamSpotlightData;
}

const TeamSpotlightView: React.FC<TeamSpotlightViewProps> = ({ spotlight }) => {
  return (
    <dl>
        <InfoRow label="Name" value={spotlight.name} icon="👤" />
        <InfoRow label="Role" value={spotlight.role} icon="🧑‍💻" />
        <InfoRow label="Department" value={spotlight.department} icon="🏢" />
        <InfoRow label="Experience" value={spotlight.experience} icon="📈" />
        <InfoRow 
            label="Location" 
            value={spotlight.location} 
            icon="📍" 
            action={spotlight.location ? {
                icon: <MapPinIcon className="w-5 h-5"/>,
                onClick: () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotlight.location!)}`, '_blank'),
                ariaLabel: 'View location on map'
            } : undefined}
        />
        {spotlight.bio && <p className="text-sm text-gray-400 py-3 px-1">{spotlight.bio}</p>}
        <InfoRow 
            label="Skills" 
            value={
                spotlight.skills && spotlight.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {spotlight.skills.map((skill, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : undefined
            } 
            icon="🛠️"
        />
        <InfoRow 
            label="Achievements" 
            value={
                spotlight.achievements && spotlight.achievements.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {spotlight.achievements.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="🏆"
        />
        <InfoRow label="Fun Fact" value={spotlight.funFact} icon="💡" />
        <InfoRow label="Quote" value={spotlight.quote ? `"${spotlight.quote}"` : undefined} icon="💬" />
        <InfoRow 
            label="Links"
            value={
                (spotlight.linkedIn || spotlight.portfolio) ? (
                    <div className="space-x-4">
                        {spotlight.linkedIn && <a href={spotlight.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>}
                        {spotlight.portfolio && <a href={spotlight.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Portfolio</a>}
                    </div>
                ) : undefined
            }
            icon="🔗"
        />
    </dl>
  );
};

export default TeamSpotlightView;