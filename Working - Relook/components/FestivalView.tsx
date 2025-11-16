import React from 'react';
import { FestivalData } from '../types';
import InfoRow from './InfoRow';

interface FestivalViewProps {
  festival: FestivalData;
}

const FestivalView: React.FC<FestivalViewProps> = ({ festival }) => {
  return (
    <dl>
        <InfoRow label="Festival" value={festival.name} icon="🎉" />
        <InfoRow label="Date" value={festival.date} icon="📅" />
        <InfoRow label="Theme" value={festival.theme} icon="🎨" />
        <InfoRow 
            label="Colors" 
            value={
                festival.colorsUsed && festival.colorsUsed.length > 0 ? (
                    <div className="flex flex-wrap gap-2 items-center">
                        {festival.colorsUsed.map((color, index) => (
                           <div key={index} className="flex items-center gap-1">
                             <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }}></div>
                             <span className="text-xs font-mono">{color}</span>
                           </div>
                        ))}
                    </div>
                ) : undefined
            } 
            icon="🌈"
        />
        <InfoRow label="Message" value={festival.specialMessage} icon="💬" />
    </dl>
  );
};

export default FestivalView;
