import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, Rewards } from '../types';
import KnowledgeTree from '../components/KnowledgeTree';

// --- WEATHER COMPONENTS ---

const Sunbeam: React.FC = () => {
    const rays = Array.from({ length: 8 });
    return (
        <div 
            className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] pointer-events-none"
            style={{ animation: `sun-ray-rotate 60s linear infinite` }}
        >
            <div 
                className="absolute inset-0 rounded-full bg-yellow-200/50"
                style={{
                    filter: 'blur(40px)',
                    animation: `sun-glow 5s ease-in-out infinite`,
                }}
            />
            {rays.map((_, i) => (
                <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-px h-1/2 bg-gradient-to-t from-yellow-200/0 to-yellow-300/80"
                    style={{
                        transform: `rotate(${i * 45}deg)`,
                        transformOrigin: 'top center',
                        animation: `sun-ray-pulse ${4 + Math.random() * 2}s ease-in-out infinite alternate`,
                    }}
                />
            ))}
        </div>
    );
};

const RainDrop: React.FC<{ left: number, delay: number, duration: number }> = ({ left, delay, duration }) => (
    <div
      className="absolute top-0 w-0.5 h-12 bg-gradient-to-b from-transparent to-blue-300"
      style={{
        left: `${left}%`,
        animation: `rain ${duration}s linear ${delay}s infinite`,
        opacity: 0
      }}
    />
);

const Splash: React.FC<{ left: number, delay: number }> = ({ left, delay }) => (
    <div
      className="absolute bottom-8 w-4 h-2 bg-transparent rounded-full border-t-2 border-blue-300"
      style={{
        left: `${left}%`,
        animation: `rain-splash 0.5s ease-out ${delay}s infinite`,
        opacity: 0,
      }}
    />
);

const Rain: React.FC = () => {
  const rainDrops = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 0.5 + 0.5
  })), []);
  
  const splashes = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 80 + 10, // Avoid edges
    delay: Math.random() * 2,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 animate-fade-in">
        <div className="absolute inset-0 bg-blue-900/20 backdrop-brightness-90 transition-all duration-500" />
        {rainDrops.map(drop => <RainDrop key={drop.id} {...drop} />)}
        {splashes.map(splash => <Splash key={splash.id} {...splash} />)}
    </div>
  );
};

const NightSky: React.FC = () => {
    const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 1.5 + 0.5}px`,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.random() * 2 + 2}s`,
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-brightness-50 transition-all duration-1000" />
            {/* Moon */}
            <div 
                className="absolute top-[10%] left-[15%] w-16 h-16 bg-gray-200 rounded-full"
                style={{ animation: 'moon-glow 6s ease-in-out infinite' }}
            />
            {/* Stars */}
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
                    }}
                />
            ))}
        </div>
    );
};


interface KnowledgeTreePageProps {
  user: User;
  rewards: Rewards;
  itemCount: number;
  deckCount: number;
  equippedItems: { [key: string]: string };
  lastActivity: Date;
}

type WeatherState = 'day' | 'rain' | 'night';

const weatherCycle: { state: WeatherState; duration: number }[] = [
  { state: 'day', duration: 30000 },
  { state: 'rain', duration: 15000 },
  { state: 'day', duration: 20000 }, // Afternoon sun
  { state: 'night', duration: 25000 },
];

const KnowledgeTreePage: React.FC<KnowledgeTreePageProps> = ({ user, rewards, itemCount, deckCount, equippedItems, lastActivity }) => {
  const xpForNextLevel = 1000 * rewards.level;
  
  const [cycleIndex, setCycleIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const last = new Date(lastActivity);
    const hoursSinceLastVisit = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

    let startIndex = 0;
    if (hoursSinceLastVisit > 2) {
      const rainIndex = weatherCycle.findIndex(c => c.state === 'rain');
      if (rainIndex !== -1) {
        startIndex = rainIndex;
      }
    }
    
    setCycleIndex(startIndex);

    const scheduleNext = (index: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            const nextIndex = (index + 1) % weatherCycle.length;
            setCycleIndex(nextIndex);
            scheduleNext(nextIndex);
        }, weatherCycle[index].duration);
    };

    scheduleNext(startIndex);

    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastActivity]);

  const weather = weatherCycle[cycleIndex].state;

  return (
    <div className="px-6 py-6 space-y-6 animate-fade-in">

      <div className="text-center mt-4">
        <h2 className="text-4xl font-bold text-white tracking-tight">Knowledge Tree</h2>
        <p className="text-gray-400 text-sm mt-1">
          Your memory garden, growing with every new discovery.
        </p>
      </div>

      <div className="relative flex justify-center items-center mt-6 overflow-hidden max-w-sm mx-auto aspect-square">
        {/* Weather Effects */}
        {weather === 'day' && <Sunbeam />}
        {weather === 'rain' && <Rain />}
        {weather === 'night' && <NightSky />}
        
        <div className="absolute w-60 h-60 rounded-full bg-gradient-to-b from-[#E6F0C6]/40 to-transparent blur-3xl opacity-40" />

        <div className="absolute animate-float-slow w-3 h-3 bg-[#E6F0C6] rounded-full top-6 left-20 opacity-80 blur-[1px]" />
        <div className="absolute animate-float-delayed w-2 h-2 bg-[#C0FFC0] rounded-full bottom-10 right-24 opacity-70 blur-[1px]" />
        <div className="absolute animate-float-slower w-4 h-4 bg-[#F5FFE0] rounded-full top-16 right-20 opacity-80 blur-[2px]" />

        <KnowledgeTree
          key={`${rewards.level}-${equippedItems.tree}-${equippedItems.companion}`}
          level={rewards.level}
          streak={rewards.streak}
          itemCount={itemCount}
          deckCount={deckCount}
          equippedItems={equippedItems}
        />
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-5 rounded-2xl text-center shadow-lg shadow-black/20">

        <p className="font-bold text-white text-xl">Level {rewards.level}</p>

        <div className="text-sm text-gray-400 mt-1">
          {rewards.xp} / {xpForNextLevel} XP to next level
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E6F0C6] to-[#A4D66E] transition-all duration-700"
            style={{ width: `${(rewards.xp / xpForNextLevel) * 100}%` }}
          />
        </div>

        {rewards.streak > 0 && (
          <p className="text-base font-semibold text-[#E6F0C6] mt-3">
            {rewards.streak} day streak 🔥
          </p>
        )}
      </div>
    </div>
  );
};

export default KnowledgeTreePage;