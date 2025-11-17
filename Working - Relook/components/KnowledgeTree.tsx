
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
}

const generateTree = (level: number, itemCount: number, deckCount: number, equippedTree?: string): { branches: Branch[], leaves: Leaf[] } => {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  
  let leafColor = '#E6F0C6';
  if (equippedTree === 'tree_sakura') leafColor = '#FFB7C5';
  if (equippedTree === 'tree_golden') leafColor = '#FFD700';

  const trunkHeight = 60 + level * 6;
  const trunkWidth = 4 + level * 0.5;
  branches.push({ d: `M 150 ${280 - trunkHeight} V 280`, delay: 0, strokeWidth: trunkWidth });

  const mainBranchCount = Math.min(6, Math.max(1, deckCount + 1));
  for (let i = 0; i < mainBranchCount; i++) {
    const angle = (i - (mainBranchCount - 1) / 2) * 20 * (1 + Math.random() * 0.2);
    const length = 25 + level * 2.5 + Math.random() * 10;
    const startY = 280 - trunkHeight * (0.6 + Math.random() * 0.3);
    branches.push({ 
        d: `M 150 ${startY} C ${150 + angle * 0.2} ${startY - length * 0.5}, ${150 + angle * 0.8} ${startY - length * 0.8}, ${150 + angle * 1.5} ${startY - length}`,
        delay: 0.5 + i * 0.1,
        strokeWidth: trunkWidth * 0.6
    });
  }
  
  const leafCount = Math.min(150, itemCount + level * 5);
  for (let i = 0; i < leafCount; i++) {
    const randomAngle = (Math.random() * 2 - 1) * 80;
    const randomLength = (Math.random() * (level * 6 + 20)) + 20;
    const x = 150 + Math.sin(randomAngle * Math.PI / 180) * randomLength;
    const y = (280 - trunkHeight * 0.5) - Math.cos(randomAngle * Math.PI / 180) * randomLength * 0.8;
    
    if (y < 280 - trunkHeight * 0.5) {
        leaves.push({
          cx: x,
          cy: y,
          r: Math.random() * 1.5 + 2,
          delay: 1 + Math.random() * 1.5,
          color: leafColor,
        });
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
         <g filter={hasGlow ? "url(#glow)" : "none"}>
            {leaves.map((leaf, i) => (
                <circle
                key={i}
                cx={leaf.cx}
                cy={leaf.cy}
                r={leaf.r}
                fill={leaf.color}
                className="leaf"
                style={{ animationDelay: `${leaf.delay}s` }}
                />
            ))}
        </g>
      </svg>
    </div>
  );
};

export default KnowledgeTree;