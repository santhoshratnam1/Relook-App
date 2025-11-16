import React from 'react';
import { PortfolioData } from '../types';
import InfoRow from './InfoRow';

interface DesignViewProps {
  design: PortfolioData;
}

const DesignView: React.FC<DesignViewProps> = ({ design }) => {
    return (
        <dl>
            <InfoRow label="Project" value={design.projectName} icon="🎨" />
            <InfoRow label="Type" value={design.projectType} icon="🏷️" />
            <InfoRow label="My Role" value={design.role} icon="🧑‍🎨" />
            <InfoRow label="Client" value={design.client} icon="🏢" />
            <InfoRow label="Duration" value={design.duration} icon="⏳" />
            <InfoRow 
                label="Tools" 
                value={
                    design.toolsUsed && design.toolsUsed.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {design.toolsUsed.map((tool, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                    {tool}
                                </span>
                            ))}
                        </div>
                    ) : undefined
                }
                icon="🛠️"
            />
            <InfoRow 
                label="Deliverables" 
                value={design.deliverables && design.deliverables.join(', ')} 
                icon="📦"
            />
            <InfoRow label="Outcome" value={design.outcome} icon="🏆" />
        </dl>
    );
};

export default DesignView;
