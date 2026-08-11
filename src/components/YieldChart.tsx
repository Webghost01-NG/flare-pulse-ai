'use client';

import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';

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
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  const minPrice = 0.0235;
  const maxPrice = 0.0260;

  const pointsString = MOCK_HISTORICAL_DATA.map((pt, idx) => {
    const x = (idx / (MOCK_HISTORICAL_DATA.length - 1)) * 600;
    const y = 180 - ((pt.price - minPrice) / (maxPrice - minPrice)) * 140;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#dc2626]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-[#1e3a8a] tracking-tight">FTSOv2 Block Price & AI Signal Analytics</h3>
            <span className="text-xs text-slate-500 font-mono">Real-Time Oracle Stream vs Strategy Execution</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-2 text-slate-700 font-bold">
            <span className="w-3 h-3 rounded-full bg-[#dc2626]" /> FLR/USD Feed
          </span>
          <span className="flex items-center gap-2 text-slate-700 font-bold">
            <span className="w-3 h-3 rounded-full bg-[#2563eb]" /> AI Execution Node
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-56 my-3">
        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-white border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-mono text-blue-900 shadow-md z-20">
            <span>Time: {hoveredPoint.time}</span> | <span>Price: ${hoveredPoint.price.toFixed(4)}</span> | <span>APY: {hoveredPoint.apy}%</span>
          </div>
        )}

        <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="600" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" />
          <line x1="0" y1="100" x2="600" y2="100" stroke="#e2e8f0" strokeDasharray="4 4" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#e2e8f0" strokeDasharray="4 4" />

          {/* Gradient Area Fill */}
          <polygon
            points={`0,200 ${pointsString} 600,200`}
            fill="url(#areaGradient)"
          />

          {/* Main Price Line */}
          <polyline
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Nodes */}
          {MOCK_HISTORICAL_DATA.map((pt, idx) => {
            const x = (idx / (MOCK_HISTORICAL_DATA.length - 1)) * 600;
            const y = 180 - ((pt.price - minPrice) / (maxPrice - minPrice)) * 140;

            return (
              <g
                key={idx}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle cx={x} cy={y} r="6" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                {pt.signal === 'BUY' && (
                  <g className="animate-bounce">
                    <circle cx={x} cy={y - 18} r="10" fill="#2563eb" />
                    <text x={x} y={y - 14} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
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
      <div className="flex justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-200">
        {MOCK_HISTORICAL_DATA.map((pt) => (
          <span key={pt.time}>{pt.time}</span>
        ))}
      </div>
    </div>
  );
};
