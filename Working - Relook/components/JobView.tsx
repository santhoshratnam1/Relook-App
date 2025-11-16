import React from 'react';
import { JobData } from '../types';

interface JobViewProps {
  job: JobData;
}

const JobInfoRow: React.FC<{ label: string; value?: string | React.ReactNode; }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/10 last:border-b-0">
            <dt className="text-sm font-semibold text-gray-400">{label}</dt>
            <dd className="text-sm text-white col-span-2">{value}</dd>
        </div>
    );
};

const JobView: React.FC<JobViewProps> = ({ job }) => {
  return (
    <div className="space-y-4">
        <dl>
            <JobInfoRow label="Role" value={job.role} />
            <JobInfoRow label="Company" value={job.company} />
            <JobInfoRow label="Seniority" value={job.seniority} />
            <JobInfoRow label="Location" value={job.location} />
            <JobInfoRow label="Type" value={job.jobType} />
            <JobInfoRow 
                label="Skills" 
                value={
                    job.skills && job.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : undefined
                } 
            />
        </dl>
    </div>
  );
};

export default JobView;
