import React, { useMemo } from 'react';
import { Item, User, ContentType } from '../types';
import { ArrowLeftIcon } from '../components/IconComponents';
import DashboardCard from '../components/DashboardCard';

interface InsightsPageProps {
  user: User;
  items: Item[];
  onBack: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 18) return `Good afternoon, ${name}!`;
  return `Good evening, ${name}!`;
};

const PIE_CHART_COLORS: { [key in ContentType]?: string } = {
  [ContentType.Event]: '#8884d8',
  [ContentType.Job]: '#82ca9d',
  [ContentType.Recipe]: '#ffc658',
  [ContentType.Portfolio]: '#ff8042',
  [ContentType.Tutorial]: '#0088fe',
  [ContentType.Post]: '#00c49f',
  [ContentType.Other]: '#d1d5db',
};
const DEFAULT_COLOR = '#8884d8';

const ContentPieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  const size = 180;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let totalValue = 0;
  for (const item of data) {
    totalValue += item.value;
  }

  let cumulativePercent = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {data.map((slice, index) => {
        const percent = (slice.value / totalValue) * 100;
        const strokeDashoffset = circumference * (1 - percent / 100);
        const rotation = cumulativePercent * 3.6;
        cumulativePercent += percent;

        return (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={PIE_CHART_COLORS[slice.name as ContentType] || DEFAULT_COLOR}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transform: `rotate(${rotation}deg)` }}
            className="pie-chart-slice"
          >
             <title>{slice.name}: {slice.value}</title>
          </circle>
        );
      })}
    </svg>
  );
};

const InsightsPage: React.FC<InsightsPageProps> = ({ user, items, onBack }) => {
    const greeting = getGreeting().replace('${name}', user.display_name);

    const sevenDaysAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }, []);

    const savesThisWeek = useMemo(() => {
        return items.filter(item => new Date(item.created_at) > sevenDaysAgo).length;
    }, [items, sevenDaysAgo]);
    
    const totalSaves = items.length;
    const milestone = totalSaves >= 100 ? 100 : totalSaves >= 50 ? 50 : totalSaves >= 10 ? 10 : 0;

    const pieChartData = useMemo(() => {
        const counts = items.reduce((acc, item) => {
            acc[item.content_type] = (acc[item.content_type] || 0) + 1;
            return acc;
        }, {} as { [key in ContentType]?: number });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value: value || 0 }))
            .sort((a, b) => b.value - a.value);
    }, [items]);

    return (
        <div className="px-6 space-y-4 animate-fade-in pb-6">
            <div className="mt-4 flex justify-between items-center">
                <button onClick={onBack} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeftIcon />
                    <span>Back</span>
                </button>
            </div>
            <h1 className="text-3xl font-bold text-white">{greeting}</h1>

            <div className="grid grid-cols-2 gap-4">
                <DashboardCard>
                    <p className="text-3xl font-bold text-white">{savesThisWeek}</p>
                    <p className="text-sm text-gray-400 mt-1">New memories this week</p>
                </DashboardCard>
                <DashboardCard>
                    <p className="text-3xl font-bold text-white">{totalSaves}</p>
                    <p className="text-sm text-gray-400 mt-1">Total memories saved</p>
                </DashboardCard>
            </div>

            {milestone > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-center">
                    <p className="text-2xl">🎉</p>
                    <p className="font-bold text-yellow-200">Milestone Reached!</p>
                    <p className="text-sm text-yellow-300/80">You've saved over {milestone} items!</p>
                </div>
            )}
            
            <DashboardCard>
                <h2 className="text-xl font-bold text-white mb-4">Content Breakdown</h2>
                {pieChartData.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-shrink-0">
                            <ContentPieChart data={pieChartData} />
                        </div>
                        <div className="w-full space-y-2">
                            {pieChartData.map((slice, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full" 
                                            style={{ backgroundColor: PIE_CHART_COLORS[slice.name as ContentType] || DEFAULT_COLOR }}
                                        />
                                        <span className="text-gray-300 capitalize">{slice.name.replace('_', ' ')}</span>
                                    </div>
                                    <span className="font-semibold text-white">{slice.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">Save some items to see your stats here!</p>
                )}
            </DashboardCard>
        </div>
    );
};

export default InsightsPage;