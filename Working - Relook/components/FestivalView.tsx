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
        {festival.specialMessage && <p className="text-lg text-center font-semibold text-yellow-200 py-4 italic">"{festival.specialMessage}"</p>}
        <InfoRow label="Date" value={festival.date} icon="📅" />
        <InfoRow label="Theme" value={festival.theme} icon="🎨" />
        <InfoRow label="Significance" value={festival.culturalSignificance} icon="📜" />
        <InfoRow 
            label="Traditions"
             value={
                festival.traditions && festival.traditions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {festival.traditions.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="🕯️"
        />
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
    </dl>
  );
};

export default FestivalView;