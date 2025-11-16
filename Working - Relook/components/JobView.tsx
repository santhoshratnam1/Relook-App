import React from 'react';
import { JobData } from '../types';
import InfoRow from './InfoRow';

interface JobViewProps {
  job: JobData;
}

const JobView: React.FC<JobViewProps> = ({ job }) => {
  return (
    <div className="space-y-4">
        <dl>
            <InfoRow label="Role" value={job.role} icon="🧑‍💻" />
            <InfoRow label="Company" value={job.company} icon="🏢" />
            <InfoRow label="Location" value={job.location} icon="📍" />
            <InfoRow label="Type" value={job.jobType} icon="📄" />
            <InfoRow label="Salary" value={job.salary} icon="💰" />
            <InfoRow label="Experience" value={job.experience} icon="📈" />
            <InfoRow 
                label="Skills" 
                value={
                    job.skillsRequired && job.skillsRequired.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {job.skillsRequired.map((skill, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : undefined
                } 
                icon="🛠️"
            />
            <InfoRow label="Apply by" value={job.deadline} icon="⏳" />
            <InfoRow 
                label="Apply At" 
                value={
                    job.applyLink ? (
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                            {job.applyLink}
                        </a>
                    ) : undefined
                }
                icon="🔗"
            />
        </dl>
    </div>
  );
};

export default JobView;
