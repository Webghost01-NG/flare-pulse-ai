'use client';

import React from 'react';
import { FTSOFeed } from '../types';
import { TrendingUp, TrendingDown, Cpu } from 'lucide-react';

interface FTSOTickerProps {
  feeds: FTSOFeed[];
}

const MOCK_SPARK_PATHS: Record<string, string> = {
  FLR: 'M 0,20 Q 25,5 50,22 T 100,10 T 150,25 T 200,8',
  BTC: 'M 0,25 Q 30,12 60,18 T 120,5 T 160,22 T 200,12',
  ETH: 'M 0,10 Q 20,28 50,15 T 100,22 T 150,8 T 200,18',
  XRP: 'M 0,22 Q 40,8 80,25 T 140,10 T 180,18 T 200,5',
};

export const FTSOTicker: React.FC<FTSOTickerProps> = ({ feeds }) => {
  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {feeds.map((feed) => {
        const isPositive = feed.change24h >= 0;
        const sparkPath = MOCK_SPARK_PATHS[feed.symbol] || MOCK_SPARK_PATHS.FLR;

        return (
          <div
            key={feed.symbol}
            className="glass-card p-5 flex flex-col justify-between relative overflow-hidden group hover:border-blue-400"
          >
            {/* Top Row: Symbol, Name & Sub-Second Latency */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-sm text-[#1e3a8a] font-mono shadow-inner">
                  {feed.symbol}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">{feed.name}</h3>
                  <span className="text-[10px] text-blue-900/60 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-live-dot" />
                    FTSOv2 Oracle Feed
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                <Cpu className="w-3 h-3 text-blue-600" />
                <span>{feed.blockLatencyMs}ms</span>
              </div>
            </div>

            {/* Price & Sparkline Area */}
            <div className="my-4 flex items-baseline justify-between z-10">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Live Price (USD)</span>
                <div className="text-2xl font-black font-mono text-[#1e3a8a] tracking-tight">
                  ${feed.price >= 1000 ? feed.price.toLocaleString() : feed.price.toFixed(feed.decimals)}
                </div>
              </div>

              {/* Mini Sparkline Graph */}
              <div className="w-24 h-8 relative" style={{ width: '96px', height: '32px', maxWidth: '96px' }}>
                <svg viewBox="0 0 200 30" style={{ width: '100%', height: '100%' }}>
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke={isPositive ? '#2563eb' : '#dc2626'}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Row: 24h Change & FTSO Feed ID */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 z-10 font-mono">
              <div
                className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
                  isPositive
                    ? 'text-blue-700 bg-blue-50 border border-blue-200'
                    : 'text-red-700 bg-red-50 border border-red-200'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? `+${feed.change24h}%` : `${feed.change24h}%`}</span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                ID: {feed.feedId.substring(0, 8)}...
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
