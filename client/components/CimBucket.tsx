import React from 'react';
import { GameState } from '../types';

interface CimBucketProps {
  gameState: GameState;
}

export const CimBucket: React.FC<CimBucketProps> = ({ gameState }) => {
  const isShaking = gameState === 'SHAKING';
  const isDropping = gameState === 'DROPPING';
  const isRevealed = gameState === 'REVEALED';

  return (
    <div className="relative w-64 h-96 flex items-end justify-center">
      <svg
        viewBox="0 0 200 300"
        className={`w-full h-full transition-transform duration-100 ${
          isShaking ? 'animate-bucket-shake' : ''
        }`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="bucketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B0000" />
            <stop offset="20%" stopColor="#8B0000" />
            <stop offset="50%" stopColor="#A52A2A" />
            <stop offset="80%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#6B0000" />
          </linearGradient>
          <linearGradient id="stickGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D2B48C" />
            <stop offset="50%" stopColor="#F4A460" />
            <stop offset="100%" stopColor="#D2B48C" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Back Sticks (Inside the bucket) */}
        <g transform="translate(0, 10)">
           {Array.from({ length: 18 }).map((_, i) => (
            <rect
              key={`back-stick-${i}`}
              x={70 + i * 3.5 + (Math.random() * 4 - 2)}
              y={90 + (Math.random() * 15)}
              width="5"
              height="150"
              fill="url(#stickGradient)"
              stroke="#8B4513"
              strokeWidth="0.5"
              transform={`rotate(${Math.random() * 8 - 4}, ${70 + i * 3.5}, 200)`}
              className={isShaking ? 'animate-stick-jostle' : ''}
              style={{ animationDelay: `${Math.random() * 0.5}s` }}
            />
          ))}
        </g>

        {/* The Bucket Body (Cylinder) */}
        <g filter="url(#shadow)">
           {/* Dark inner background for the top opening illusion */}
           <ellipse cx="100" cy="120" rx="60" ry="15" fill="#3a0000" />

           {/* Main Cylinder Body 
               M 40,120: Start top-left
               L 40,280: Line to bottom-left
               A 60,15 0 0 0 160,280: Bottom curve (half ellipse)
               L 160,120: Line to top-right
               A 60,15 0 0 1 40,120: Top curve (front rim cutout)
           */}
          <path
            d="M40,120 L40,280 A60,15 0 0,0 160,280 L160,120 A60,15 0 0,1 40,120 Z"
            fill="url(#bucketGradient)"
            stroke="#500000"
            strokeWidth="1"
          />

          {/* Bamboo Nodes (Decorative Rings) */}
          <path d="M40,170 A60,15 0 0,0 160,170" fill="none" stroke="rgba(50,0,0,0.3)" strokeWidth="2" />
          <path d="M40,220 A60,15 0 0,0 160,220" fill="none" stroke="rgba(50,0,0,0.3)" strokeWidth="2" />
          
          {/* Chinese Character on Bucket */}
          <g opacity="0.9">
             <circle cx="100" cy="200" r="24" fill="#8B0000" stroke="#DAA520" strokeWidth="1" opacity="0.6" />
             <text
                x="100"
                y="212"
                fill="#DAA520"
                fontSize="32"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="serif"
             >
                靈
             </text>
          </g>
        </g>

        {/* Top Rim (The ring) */}
        <ellipse cx="100" cy="120" rx="60" ry="15" fill="none" stroke="#500000" strokeWidth="3" />
        
        {/* Highlight on Rim */}
        <path
             d="M40,120 A60,15 0 0,0 160,120"
             fill="none"
             stroke="#DAA520"
             strokeWidth="1.5"
             opacity="0.6"
        />

        {/* The Chosen Stick (Animated Dropping) */}
        <g 
          transform={isDropping || isRevealed ? "translate(0, 0)" : "translate(0, 0)"}
          className={`transition-all duration-1000 ease-out ${
            isDropping ? 'translate-y-[160px] rotate-[45deg] translate-x-[60px]' : 'opacity-0'
          } ${isRevealed ? 'opacity-0' : ''}`} 
        >
             {/* Only render if needed to save resources */}
             {(isDropping) && (
                <rect
                    x="97"
                    y="60"
                    width="8"
                    height="160"
                    fill="url(#stickGradient)"
                    stroke="#8B4513"
                    strokeWidth="1"
                >
                    <animateTransform
                         attributeName="transform"
                         type="rotate"
                         from="0 100 100"
                         to="15 100 300"
                         dur="0.5s"
                         fill="freeze"
                    />
                </rect>
             )}
        </g>
      </svg>
    </div>
  );
};
