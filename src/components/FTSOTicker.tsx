'use client';

import React from 'react';
import { FTSOFeed } from '../types';
import { TrendingUp, TrendingDown, Clock, Cpu } from 'lucide-react';

interface FTSOTickerProps {
  feeds: FTSOFeed[];
}

export const FTSOTicker: React.FC<FTSOTickerProps> = ({ feeds }) => {
  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {feeds.map((feed) => {
        const isPositive = feed.change24h >= 0;
        return (
          <div
            key={feed.symbol}
            className="glass-panel p-4 flex flex-col justify-between hover:scale-[1.02] transition-all relative overflow-hidden group"
          >
            {/* Top Row: Symbol & Latency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-xs text-white">
                  {feed.symbol}
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-200">{feed.name}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">FTSOv2 Block Feed</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                <Cpu className="w-3 h-3" />
                <span>{feed.blockLatencyMs}ms</span>
              </div>
            </div>

            {/* Middle Row: Price */}
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                ${feed.price >= 1000 ? feed.price.toLocaleString() : feed.price.toFixed(feed.decimals)}
              </div>
            </div>

            {/* Bottom Row: 24h Change & Live Indicator */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800/60">
              <div
                className={`flex items-center gap-1 font-semibold font-mono ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? `+${feed.change24h}%` : `${feed.change24h}%`}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                <Clock className="w-3 h-3 text-gray-500" />
                <span>Live Feed</span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
