
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-400">XP</span>
            <span className="text-xs font-semibold text-gray-300">{value} / {max}</span>
        </div>
        <div className="w-full h-2 bg-gray-200/10 rounded-full overflow-hidden">
        <div
            className="h-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
        ></div>
        </div>
    </div>
  );
};

export default ProgressBar;