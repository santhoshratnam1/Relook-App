import React from 'react';
import { Mission } from '../types';
import DashboardCard from './DashboardCard';
import { SparklesIcon } from './IconComponents';

interface DailyMissionsProps {
  missions: Mission[];
}

const MissionItem: React.FC<{ mission: Mission }> = ({ mission }) => {
  const isComplete = mission.progress >= mission.goal;
  const percentage = isComplete ? 100 : (mission.progress / mission.goal) * 100;

  return (
    <div className={`p-3 rounded-lg ${isComplete ? 'bg-green-500/20' : 'bg-[#0C0D0F]'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`font-bold ${isComplete ? 'text-green-300' : 'text-white'}`}>{mission.title}</p>
          <p className="text-sm text-gray-400 mt-1">{mission.description}</p>
        </div>
        <span className={`font-bold text-sm ${isComplete ? 'text-green-300' : 'text-[#E6F0C6]'}`}>+{mission.xp} XP</span>
      </div>
      <div className="mt-3">
        <div className="w-full h-2 bg-gray-200/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-400' : 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};


const DailyMissions: React.FC<DailyMissionsProps> = ({ missions }) => {
  if (!missions || missions.length === 0) return null;

  return (
    <div className="px-6 my-4 animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <SparklesIcon /> Daily Missions
      </h3>
      <DashboardCard>
        <div className="space-y-3">
          {missions.map(mission => <MissionItem key={mission.id} mission={mission} />)}
        </div>
      </DashboardCard>
    </div>
  );
};

export default DailyMissions;
