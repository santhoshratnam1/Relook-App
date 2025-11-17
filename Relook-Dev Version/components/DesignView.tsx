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
            {design.description && <p className="text-sm text-gray-400 py-3 px-1">{design.description}</p>}
            <InfoRow label="Type" value={design.projectType} icon="🏷️" />
            <InfoRow label="My Role" value={design.role} icon="🧑‍🎨" />
            <InfoRow label="Client" value={design.client} icon="🏢" />
            <InfoRow label="Industry" value={design.industry} icon="🏭" />
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
                label="Technologies" 
                value={
                    design.technologies && design.technologies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {design.technologies.map((tech, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-sky-500/20 text-sky-300">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    ) : undefined
                }
                icon="💻"
            />
            <InfoRow 
                label="Platforms" 
                value={design.platforms && design.platforms.join(', ')} 
                icon="📱"
            />
            <InfoRow 
                label="Deliverables" 
                value={design.deliverables && design.deliverables.join(', ')} 
                icon="📦"
            />
            <InfoRow label="Outcome" value={design.outcome} icon="🏆" />
            <InfoRow 
                label="Project Link" 
                value={
                    design.projectLink ? (
                        <a href={design.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                            View Project
                        </a>
                    ) : undefined
                }
                icon="🔗"
            />
        </dl>
    );
};

export default DesignView;