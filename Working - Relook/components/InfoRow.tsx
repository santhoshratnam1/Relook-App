import React from 'react';

interface InfoRowProps {
    label: string;
    value?: string | React.ReactNode;
    icon?: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/10 last:border-b-0 items-start">
            <dt className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </dt>
            <dd className="text-sm text-white col-span-2">{value}</dd>
        </div>
    );
};

export default InfoRow;
