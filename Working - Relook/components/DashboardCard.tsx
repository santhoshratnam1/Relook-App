
import React, { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => {
  return (
    <div 
        className={`dashboard-card border border-white/10 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[1.01] ${className}`}
        style={{boxShadow: 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.05)'}}
    >
      {children}
    </div>
  );
};

export default DashboardCard;