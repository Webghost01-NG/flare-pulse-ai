'use client';

import React from 'react';
import { Activity, BarChart2, Zap } from 'lucide-react';

interface ChartPoint {
  time: string;
  price: number;
  apy: number;
  signal?: 'BUY' | 'SELL';
}

const MOCK_HISTORICAL_DATA: ChartPoint[] = [
  { time: '10:00', price: 0.0238, apy: 12.4 },
  { time: '10:15', price: 0.0241, apy: 12.8 },
  { time: '10:30', price: 0.0245, apy: 14.2, signal: 'BUY' },
  { time: '10:45', price: 0.0243, apy: 13.9 },
  { time: '11:00', price: 0.0249, apy: 15.6 },
  { time: '11:15', price: 0.0252, apy: 16.8, signal: 'BUY' },
  { time: '11:30', price: 0.0248, apy: 15.9 },
  { time: '11:45', price: 0.0255, apy: 18.2 },
];

export const YieldChart: React.FC = () => {
  const minPrice = 0.0235;
  const maxPrice = 0.0260;

  // Render SVG polyline points
  const pointsString = MOCK_HISTORICAL_DATA.map((pt, idx) => {
    const x = (idx / (MOCK_HISTORICAL_DATA.length - 1)) * 500;
    const y = 180 - ((pt.price - minPrice) / (maxPrice - minPrice)) * 140;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#ea2a66]" />
          <h3 className="font-bold text-base text-white">FTSOv2 Price Feed & AI Signal Triggers</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea2a66]" /> FLR/USD Feed
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> AI Execution Signal
          </span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full h-48 my-2">
        <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
          {/* Background Grid Lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="#1f2937" strokeDasharray="4 4" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#1f2937" strokeDasharray="4 4" />
          <line x1="0" y1="160" x2="500" y2="160" stroke="#1f2937" strokeDasharray="4 4" />

          {/* Area Gradient fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea2a66" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ea2a66" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <polygon
            points={`0,200 ${pointsString} 500,200`}
            fill="url(#chartGradient)"
          />

          {/* Main Price Line */}
          <polyline
            fill="none"
            stroke="#ea2a66"
            strokeWidth="3"
            points={pointsString}
          />

          {/* Signal Indicator Nodes */}
          {MOCK_HISTORICAL_DATA.map((pt, idx) => {
            const x = (idx / (MOCK_HISTORICAL_DATA.length - 1)) * 500;
            const y = 180 - ((pt.price - minPrice) / (maxPrice - minPrice)) * 140;
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#ea2a66" strokeWidth="2" />
                {pt.signal === 'BUY' && (
                  <g>
                    <circle cx={x} cy={y - 14} r="8" fill="#10b981" />
                    <text x={x} y={y - 11} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      ↑
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* X-Axis Timestamps */}
      <div className="flex justify-between text-[11px] font-mono text-gray-500 pt-2 border-t border-gray-800">
        {MOCK_HISTORICAL_DATA.map((pt) => (
          <span key={pt.time}>{pt.time}</span>
        ))}
      </div>
    </div>
  );
};
