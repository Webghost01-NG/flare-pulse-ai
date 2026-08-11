'use client';

import React, { useState } from 'react';
import { AISignal } from '../types';
import { Bot, ShieldAlert, Sparkles, Gauge, ArrowRight, Zap, Shield, Target } from 'lucide-react';

interface AISignalRadarProps {
  signal: AISignal;
  onExecuteRebalance: () => void;
  isExecuting: boolean;
}

export const AISignalRadar: React.FC<AISignalRadarProps> = ({
  signal,
  onExecuteRebalance,
  isExecuting,
}) => {
  const [activeStrategyMode, setActiveStrategyMode] = useState<'BALANCED' | 'AGGRESSIVE' | 'PRESERVATION'>('BALANCED');

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'STRONG_BUY':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'BUY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'RISK_OFF':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'SELL':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="glass-card-glow p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6 z-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src="/agent-core.jpg"
              alt="AI Sentinel Core"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-200 shadow-md"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#1e3a8a]">
                AI Sentinel Engine
              </h2>
              <Sparkles className="w-4 h-4 text-red-500 animate-bounce" />
            </div>
            <span className="text-xs text-blue-900/60 font-mono">FTSOv2 Quantitative Neural Core</span>
          </div>
        </div>

        <div className={`px-4 py-1.5 rounded-full text-xs font-black border font-mono tracking-wider ${getBadgeColor(signal.type)}`}>
          {signal.type.replace('_', ' ')}
        </div>
      </div>

      {/* Strategy Mode Toggles */}
      <div className="flex items-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200 z-10">
        <button
          onClick={() => setActiveStrategyMode('BALANCED')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeStrategyMode === 'BALANCED'
              ? 'bg-[#1e3a8a] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Balanced Delta
        </button>
        <button
          onClick={() => setActiveStrategyMode('AGGRESSIVE')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeStrategyMode === 'AGGRESSIVE'
              ? 'bg-[#dc2626] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Aggressive Yield
        </button>
        <button
          onClick={() => setActiveStrategyMode('PRESERVATION')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeStrategyMode === 'PRESERVATION'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Capital Guard
        </button>
      </div>

      {/* Radial Gauge & Metrics Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 z-10">
        {/* Confidence Dial Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.8"
                strokeDasharray={`${signal.confidence}, 100`}
              />
            </svg>
            <span className="absolute font-black font-mono text-xs text-blue-700">{signal.confidence}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">AI Confidence</span>
            <p className="text-sm font-bold text-slate-800 mt-0.5">High Conviction</p>
          </div>
        </div>

        {/* Volatility Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Volatility Risk</span>
            <p className="text-base font-black font-mono text-[#dc2626] mt-0.5">{signal.volatilityIndex} / 100</p>
          </div>
        </div>

        {/* RSI Indicator Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">FTSO RSI Metric</span>
            <p className="text-base font-black font-mono text-[#1e3a8a] mt-0.5">{signal.metrics.rsi}</p>
          </div>
        </div>
      </div>

      {/* Terminal Recommendation Log */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 z-10 relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
          <span className="text-[11px] font-bold text-[#dc2626] uppercase tracking-wider font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
            Neural Strategy Execution Prompt
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Trigger: FTSOv2 Block #{1048590}</span>
        </div>
        <p className="text-xs text-[#1e3a8a] font-bold leading-relaxed font-mono">
          &quot;{signal.recommendation}&quot;
        </p>
      </div>

      {/* Execution Trigger Button */}
      <button
        onClick={onExecuteRebalance}
        disabled={isExecuting}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#dc2626] to-[#2563eb] hover:opacity-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 z-10 transition-all font-mono shadow-md disabled:opacity-50"
      >
        {isExecuting ? (
          <span className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Signing Coston2 On-Chain Rebalance...
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <span>Execute AI Signal Strategy on Coston2</span>
            <ArrowRight className="w-5 h-5" />
          </span>
        )}
      </button>
    </div>
  );
};
