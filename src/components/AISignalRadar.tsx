'use client';

import React from 'react';
import { AISignal } from '../types';
import { Bot, ShieldAlert, Sparkles, Gauge, ArrowRight } from 'lucide-react';

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
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="glass-panel-glow p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ea2a66]/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ea2a66]/20 border border-[#ea2a66]/40 flex items-center justify-center text-[#ea2a66]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              AI Signal Sentinel
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <span className="text-xs text-gray-400">Quantitative Model + FTSOv2 Signal Engine</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border font-mono ${getBadgeColor(signal.type)}`}>
          {signal.type.replace('_', ' ')}
        </div>
      </div>

      {/* Signal Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 my-2">
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> Confidence
          </span>
          <p className="text-lg font-bold font-mono text-cyan-400 mt-1">{signal.confidence}%</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" /> Volatility
          </span>
          <p className="text-lg font-bold font-mono text-amber-400 mt-1">{signal.volatilityIndex}/100</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
          <span className="text-[11px] text-gray-400">RSI Indicator</span>
          <p className="text-lg font-bold font-mono text-white mt-1">{signal.metrics.rsi}</p>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="my-4 bg-[#0d111a] border border-gray-800 rounded-xl p-4">
        <span className="text-xs font-semibold text-[#ea2a66] uppercase tracking-wider block mb-1">
          Automated Strategy Recommendation:
        </span>
        <p className="text-xs text-gray-200 leading-relaxed font-mono">
          &quot;{signal.recommendation}&quot;
        </p>
      </div>

      {/* Execution Button */}
      <button
        onClick={onExecuteRebalance}
        disabled={isExecuting}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ea2a66] to-[#ff6b35] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ea2a66]/20 transition-all disabled:opacity-50"
      >
        {isExecuting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Executing Coston2 Rebalance...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>Execute AI Signal Rebalance on Coston2</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </button>
    </div>
  );
};
