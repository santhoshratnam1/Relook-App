import React from 'react';
import { UpdateData } from '../types';
import InfoRow from './InfoRow';

interface UpdateViewProps {
  update: UpdateData;
}

const UpdateView: React.FC<UpdateViewProps> = ({ update }) => {
  return (
    <dl>
        <InfoRow label="Update" value={update.updateTitle} icon="🚀" />
        <InfoRow label="Version" value={update.version} icon="🏷️" />
        <InfoRow label="Release Date" value={update.releaseDate} icon="📅" />
        <InfoRow 
            label="Platforms" 
            value={update.platforms && update.platforms.join(', ')} 
            icon="🎮" 
        />
        <InfoRow 
            label="New Features" 
            value={
                update.newFeatures && update.newFeatures.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {update.newFeatures.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="✨"
        />
        <InfoRow 
            label="Bug Fixes" 
            value={
                update.bugFixes && update.bugFixes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {update.bugFixes.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="🐞"
        />
         <InfoRow 
            label="Download" 
            value={
                update.downloadLink ? (
                    <a href={update.downloadLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {update.downloadLink}
                    </a>
                ) : undefined
            }
            icon="🔗"
        />
    </dl>
  );
};

export default UpdateView;
