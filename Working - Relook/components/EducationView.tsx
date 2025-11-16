import React from 'react';
import { TutorialData } from '../types';
import InfoRow from './InfoRow';

interface EducationViewProps {
  education: TutorialData;
}

const EducationView: React.FC<EducationViewProps> = ({ education }) => {
    return (
        <dl>
            <InfoRow label="Title" value={education.title} icon="🧠" />
            {education.description && <p className="text-sm text-gray-400 py-3 px-1">{education.description}</p>}
            <InfoRow label="Category" value={education.category} icon="📚" />
            <InfoRow label="Instructor" value={education.instructor} icon="🧑‍🏫" />
            <InfoRow label="Difficulty" value={education.difficulty} icon="📊" />
            <InfoRow label="Duration" value={education.duration} icon="⏰" />
            <InfoRow 
                label="Outcomes" 
                value={
                    education.learningOutcomes && education.learningOutcomes.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {education.learningOutcomes.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    ) : undefined
                }
                icon="🎯"
            />
            <InfoRow 
                label="Tools" 
                value={
                    education.toolsRequired && education.toolsRequired.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {education.toolsRequired.map((tool, index) => (
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
                label="Resources" 
                value={
                    education.downloadLink ? (
                        <a href={education.downloadLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                            Download
                        </a>
                    ) : undefined
                }
                icon="🔗"
            />
        </dl>
    );
};

export default EducationView;