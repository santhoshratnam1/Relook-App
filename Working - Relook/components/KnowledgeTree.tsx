import React, { useMemo } from 'react';
import { STORE_ITEMS } from '../data/store';

interface KnowledgeTreeProps {
  level: number;
  streak: number;
  itemCount: number;
  deckCount: number;
  equippedItems: { [key: string]: string };
}

interface Branch {
  d: string;
  delay: number;
  strokeWidth: number;
}

interface Leaf {
    cx: number;
    cy: number;
    r: number;
    delay: number;
    color: string;
    isSnow?: boolean;
}

const getTreeStage = (level: number) => {
    if (level < 5) return 'seedling'; // 1-4
    if (level < 10) return 'sapling'; // 5-9
    if (level < 20) return 'young'; // 10-19
    if (level < 35) return 'mature'; // 20-34
    return 'ancient'; // 35+
};

const getSeason = () => {
    const month = new Date().getMonth(); // 0-11
    if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
    if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
    if (month >= 8 && month <= 10) return 'autumn'; // Sep, Oct, Nov
    return 'winter'; // Dec, Jan, Feb
};

const generateTree = (level: number, itemCount: number, deckCount: number, equippedTree?: string): { branches: Branch[], leaves: Leaf[] } => {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  
  const stage = getTreeStage(level);
  const season = getSeason();
  
  // Base properties based on stage
  let baseTrunkHeight = 60;
  let baseTrunkWidth = 4;
  let baseMainBranchCount = 1;
  let baseLeafCount = 10;
  let branchComplexity = 1;

  switch(stage) {
      case 'seedling':
          baseTrunkHeight = 40; baseTrunkWidth = 3; baseMainBranchCount = 1; baseLeafCount = 5; branchComplexity = 0.5;
          break;
      case 'sapling':
          baseTrunkHeight = 60; baseTrunkWidth = 4; baseMainBranchCount = 2; baseLeafCount = 20; branchComplexity = 0.8;
          break;
      case 'young':
          baseTrunkHeight = 80; baseTrunkWidth = 6; baseMainBranchCount = 4; baseLeafCount = 50; branchComplexity = 1;
          break;
      case 'mature':
          baseTrunkHeight = 100; baseTrunkWidth = 8; baseMainBranchCount = 5; baseLeafCount = 100; branchComplexity = 1.2;
          break;
      case 'ancient':
          baseTrunkHeight = 120; baseTrunkWidth = 12; baseMainBranchCount = 6; baseLeafCount = 150; branchComplexity = 1.5;
          break;
  }
  
  // Seasonal Color Logic
  let leafColor = '#a3be8c'; // Summer Green
  let winterMode = false;
  switch(season) {
      case 'spring': leafColor = '#FFB7C5'; break;
      case 'autumn': leafColor = '#d08770'; break;
      case 'winter': winterMode = true; break;
  }

  // Override with equipped items
  if (equippedTree === 'tree_sakura') leafColor = '#FFB7C5';
  if (equippedTree === 'tree_golden') leafColor = '#FFD700';

  const trunkHeight = baseTrunkHeight + (level % 5) * 4;
  const trunkWidth = baseTrunkWidth + (level % 5) * 0.4;
  branches.push({ d: `M 150 ${280 - trunkHeight} V 280`, delay: 0, strokeWidth: trunkWidth });

  const mainBranchCount = Math.min(6, Math.max(1, deckCount + baseMainBranchCount));
  for (let i = 0; i < mainBranchCount; i++) {
    const angle = (i - (mainBranchCount - 1) / 2) * 20 * (1 + Math.random() * 0.2);
    const length = (25 + level * 2) * branchComplexity + Math.random() * 10;
    const startY = 280 - trunkHeight * (0.6 + Math.random() * 0.3);
    const endX = 150 + angle * 1.5;
    const endY = startY - length;
    
    branches.push({ 
        d: `M 150 ${startY} C ${150 + angle * 0.2} ${startY - length * 0.5}, ${150 + angle * 0.8} ${startY - length * 0.8}, ${endX} ${endY}`,
        delay: 0.5 + i * 0.1,
        strokeWidth: trunkWidth * 0.6
    });

    // Add smaller sub-branches for mature/ancient trees
    if (stage === 'mature' || stage === 'ancient') {
        const subBranchCount = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < subBranchCount; j++) {
            const subAngle = (Math.random() - 0.5) * 40;
            const subLength = length * (0.4 + Math.random() * 0.2);
            branches.push({
                d: `M ${endX} ${endY} q ${subAngle * 0.5} ${-subLength * 0.5}, ${subAngle} ${-subLength}`,
                delay: 1.0 + i * 0.2 + j * 0.1,
                strokeWidth: trunkWidth * 0.3
            });
        }
    }
  }
  
  const leafCount = winterMode ? 0 : Math.min(200, itemCount + baseLeafCount + level * 3);
  const spread = level * 6 + 20;

  for (let i = 0; i < leafCount; i++) {
    const randomAngle = (Math.random() * 2 - 1) * 80;
    const randomLength = (Math.random() * spread) + 20;
    const x = 150 + Math.sin(randomAngle * Math.PI / 180) * randomLength;
    const y = (280 - trunkHeight * 0.5) - Math.cos(randomAngle * Math.PI / 180) * randomLength * 0.8;
    
    if (y < 280 - trunkHeight * 0.5) {
        leaves.push({
          cx: x, cy: y, r: Math.random() * 1.5 + 2, delay: 1 + Math.random() * 1.5, color: leafColor,
        });
    }
  }
  
  if (winterMode) {
      // Add "snow" to branches
      for(const branch of branches) {
          if(branch.strokeWidth < 3) continue;
          for(let k=0; k<5; k++){
              leaves.push({
                  cx: 150 + (Math.random() - 0.5) * 80,
                  cy: 280 - trunkHeight * 0.5 - Math.random() * spread * 0.8,
                  r: Math.random() * 1 + 1,
                  delay: 1.5 + Math.random(),
                  color: '#FFFFFF',
                  isSnow: true,
              });
          }
      }
  }


  return { branches, leaves };
};

const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({ level, streak, itemCount, deckCount, equippedItems }) => {
    const { branches, leaves } = useMemo(() => generateTree(level, itemCount, deckCount, equippedItems.tree), [level, itemCount, deckCount, equippedItems.tree]);
    const hasGlow = streak >= 5;

    const companion = useMemo(() => STORE_ITEMS.find(item => item.id === equippedItems.companion), [equippedItems.companion]);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center my-4">
        {hasGlow && <div className="absolute inset-0 bg-yellow-300/10 blur-3xl rounded-full animate-pulse" style={{animationDuration: '4s'}} />}
      <svg viewBox="0 0 300 300" className="w-full h-full" style={{ overflow: 'visible' }}>
        <style>
          {`
            @keyframes grow-branch {
              from { stroke-dashoffset: 1000; }
              to { stroke-dashoffset: 0; }
            }
            .branch {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              animation: grow-branch 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            @keyframes appear-leaf {
              from { opacity: 0; transform: scale(0.5); }
              to { opacity: 1; transform: scale(1); }
            }
            .leaf {
                opacity: 0;
                animation: appear-leaf 0.8s ease-out forwards;
                transform-origin: center;
            }
            @keyframes snow-fall {
                0% { transform: translateY(-10px); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateY(40px); opacity: 0; }
            }
            .snow-leaf {
                 opacity: 0;
                 animation: snow-fall 3s linear infinite;
            }
          `}
        </style>
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {companion && (
          <text x="220" y="240" fontSize="40" className="companion-animate" style={{ userSelect: 'none' }}>
              {companion.icon}
          </text>
        )}
        <g>
          {branches.map((branch, i) => (
            <path
              key={i}
              d={branch.d}
              stroke="#a38b77"
              strokeWidth={branch.strokeWidth}
              strokeLinecap="round"
              fill="none"
              className="branch"
              style={{ animationDelay: `${branch.delay}s` }}
            />
          ))}
        </g>
         <g filter={hasGlow && !leaves.some(l => l.isSnow) ? "url(#glow)" : "none"}>
            {leaves.map((leaf, i) => (
                <circle
                key={i}
                cx={leaf.cx}
                cy={leaf.cy}
                r={leaf.r}
                fill={leaf.color}
                className={leaf.isSnow ? 'snow-leaf' : 'leaf'}
                style={{ animationDelay: `${leaf.delay}s` }}
                />
            ))}
        </g>
      </svg>
    </div>
  );
};

export default KnowledgeTree;