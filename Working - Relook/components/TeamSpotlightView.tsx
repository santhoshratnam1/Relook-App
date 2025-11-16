import React from 'react';
import { TeamSpotlightData } from '../types';
import InfoRow from './InfoRow';

interface TeamSpotlightViewProps {
  spotlight: TeamSpotlightData;
}

const TeamSpotlightView: React.FC<TeamSpotlightViewProps> = ({ spotlight }) => {
  return (
    <dl>
        <InfoRow label="Name" value={spotlight.name} icon="👤" />
        <InfoRow label="Role" value={spotlight.role} icon="🧑‍💻" />
        <InfoRow label="Experience" value={spotlight.experience} icon="📈" />
        <InfoRow label="Location" value={spotlight.location} icon="📍" />
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
        <InfoRow label="Fun Fact" value={spotlight.funFact} icon="💡" />
        <InfoRow label="Quote" value={spotlight.quote ? `"${spotlight.quote}"` : undefined} icon="💬" />
    </dl>
  );
};

export default TeamSpotlightView;
