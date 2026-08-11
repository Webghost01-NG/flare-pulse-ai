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
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
      case 'BUY':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'RISK_OFF':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10';
      case 'SELL':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="glass-card-glow p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Ambient Neon Halos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ea2a66]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Avatar Emblem */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6 z-10">
        <div className="flex items-center gap-4">
          {/* 3D Agent Core Avatar Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#ea2a66] to-[#00f2fe] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <img
              src="/agent-core.jpg"
              alt="AI Sentinel Core"
              className="relative w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-2xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                AI Sentinel Engine
              </h2>
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
            <span className="text-xs text-gray-400 font-mono">FTSOv2 Quantitative Neural Core</span>
          </div>
        </div>

        <div className={`px-4 py-1.5 rounded-full text-xs font-black border font-mono tracking-wider ${getBadgeColor(signal.type)}`}>
          {signal.type.replace('_', ' ')}
        </div>
      </div>

      {/* Strategy Mode Toggles */}
      <div className="flex items-center gap-2 mb-6 bg-gray-950/80 p-1.5 rounded-xl border border-white/10 z-10">
        <button
          onClick={() => setActiveStrategyMode('BALANCED')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeStrategyMode === 'BALANCED'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Balanced Delta
        </button>
        <button
          onClick={() => setActiveStrategyMode('AGGRESSIVE')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeStrategyMode === 'AGGRESSIVE'
              ? 'bg-gradient-to-r from-[#ea2a66] to-[#ff6b35] text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Aggressive Yield
        </button>
        <button
          onClick={() => setActiveStrategyMode('PRESERVATION')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeStrategyMode === 'PRESERVATION'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Capital Guard
        </button>
      </div>

      {/* Radial Gauge & Metrics Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 z-10">
        {/* Confidence Dial Card */}
        <div className="bg-gray-950/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1f2937"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#00f2fe"
                strokeWidth="3.8"
                strokeDasharray={`${signal.confidence}, 100`}
              />
            </svg>
            <span className="absolute font-black font-mono text-xs text-cyan-400">{signal.confidence}%</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">AI Confidence</span>
            <p className="text-sm font-bold text-white mt-0.5">High Conviction</p>
          </div>
        </div>

        {/* Volatility Card */}
        <div className="bg-gray-950/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Volatility Risk</span>
            <p className="text-base font-black font-mono text-amber-400 mt-0.5">{signal.volatilityIndex} / 100</p>
          </div>
        </div>

        {/* RSI Indicator Card */}
        <div className="bg-gray-950/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">FTSO RSI Metric</span>
            <p className="text-base font-black font-mono text-purple-300 mt-0.5">{signal.metrics.rsi}</p>
          </div>
        </div>
      </div>

      {/* Terminal Recommendation Log */}
      <div className="mb-6 bg-[#050811] border border-white/10 rounded-2xl p-5 z-10 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <span className="text-[11px] font-bold text-[#ea2a66] uppercase tracking-wider font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ea2a66] animate-pulse" />
            Neural Strategy Execution Prompt
          </span>
          <span className="text-[10px] text-gray-400 font-mono">Trigger: FTSOv2 Block #{1048590}</span>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed font-mono">
          &quot;{signal.recommendation}&quot;
        </p>
      </div>

      {/* Execution Trigger Button */}
      <button
        onClick={onExecuteRebalance}
        disabled={isExecuting}
        className="w-full py-4 px-6 rounded-2xl btn-neon text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 z-10 transition-all font-mono disabled:opacity-50"
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
