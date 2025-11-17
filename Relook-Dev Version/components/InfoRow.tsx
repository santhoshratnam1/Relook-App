import React from 'react';

interface InfoRowProps {
    label: string;
    value?: string | React.ReactNode;
    icon?: React.ReactNode;
    action?: {
        icon: React.ReactNode;
        onClick: () => void;
        ariaLabel: string;
    }
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon, action }) => {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/10 last:border-b-0 items-start">
            <dt className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </dt>
            <dd className="text-sm text-white col-span-2 flex justify-between items-center gap-2">
                <span className="flex-1 break-words">{value}</span>
                {action && (
                    <button 
                        onClick={action.onClick} 
                        aria-label={action.ariaLabel}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex-shrink-0"
                    >
                        {action.icon}
                    </button>
                )}
            </dd>
        </div>
    );
};

export default InfoRow;