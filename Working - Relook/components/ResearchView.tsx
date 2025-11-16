import React from 'react';
import { ResearchData } from '../types';
import InfoRow from './InfoRow';

interface ResearchViewProps {
  research: ResearchData;
}

const ResearchView: React.FC<ResearchViewProps> = ({ research }) => {
  return (
    <dl>
        <InfoRow label="Report" value={research.reportTitle} icon="📊" />
        <InfoRow label="Source" value={research.source} icon="🏢" />
        <InfoRow label="Year" value={research.year?.toString()} icon="📅" />
        <InfoRow label="Industry" value={research.industry} icon="🏭" />
        <InfoRow label="Region" value={research.region} icon="🌍" />
        <InfoRow label="Sample Size" value={research.sampleSize?.toLocaleString()} icon="👥" />
        <InfoRow 
            label="Key Insights" 
            value={
                research.keyInsights && research.keyInsights.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {research.keyInsights.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="💡"
        />
        <InfoRow 
            label="Full Report" 
            value={
                research.fullReportLink ? (
                    <a href={research.fullReportLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {research.fullReportLink}
                    </a>
                ) : undefined
            }
            icon="🔗"
        />
    </dl>
  );
};

export default ResearchView;
