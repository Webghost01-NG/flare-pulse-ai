'use client';

import React, { useState } from 'react';
import { VaultMetrics } from '../types';
import { Vault, ShieldCheck, ArrowUpRight, ArrowDownLeft, Lock, DollarSign, CheckCircle2 } from 'lucide-react';

interface VaultPanelProps {
  metrics: VaultMetrics;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  onToggleAuto: () => void;
}

export const VaultPanel: React.FC<VaultPanelProps> = ({
  metrics,
  onDeposit,
  onWithdraw,
  onToggleAuto,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountInput, setAmountInput] = useState('500');
  const [stopLossSlider, setStopLossSlider] = useState(5.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'deposit') {
      onDeposit(amountInput);
    } else {
      onWithdraw(amountInput);
    }
  };

  const setPreset = (val: string) => {
    setAmountInput(val);
  };

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6 z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl">
            <Vault className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white tracking-tight">Smart Vault Allocation</h3>
            <span className="text-xs text-gray-400 font-mono">Contract: 0x71C7...976F (Coston2)</span>
          </div>
        </div>

        {/* Auto Rebalance Toggle Switch */}
        <div className="flex items-center gap-3 bg-gray-950/80 px-3.5 py-1.5 rounded-xl border border-white/10">
          <span className="text-xs text-gray-400 font-mono">Auto Rebalance:</span>
          <button
            onClick={onToggleAuto}
            className={`w-12 h-6 rounded-full transition-all relative ${
              metrics.autoRebalanceEnabled ? 'bg-[#ea2a66]' : 'bg-gray-800'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                metrics.autoRebalanceEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Total Vault Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 z-10 font-mono">
        <div className="bg-gray-950/60 border border-white/10 rounded-2xl p-4">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Total Vault Value (TVL)</span>
          <p className="text-2xl font-black text-white mt-1">{metrics.totalDeposited} <span className="text-sm text-cyan-400">C2FLR</span></p>
        </div>
        <div className="bg-gray-950/60 border border-white/10 rounded-2xl p-4">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Your Protected Balance</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{metrics.userBalance} <span className="text-sm text-emerald-300">C2FLR</span></p>
        </div>
      </div>

      {/* Interactive Tabs & Preset Form */}
      <div className="bg-[#050811] border border-white/10 rounded-2xl p-5 z-10">
        <div className="flex gap-2 mb-4 bg-gray-950/90 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              activeTab === 'deposit'
                ? 'bg-gradient-to-r from-[#ea2a66] to-[#ff6b35] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> Deposit C2FLR
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              activeTab === 'withdraw'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" /> Withdraw Funds
          </button>
        </div>

        {/* Quick Amount Presets */}
        <div className="flex items-center gap-2 mb-3">
          {['100', '500', '1000', '2500'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPreset(preset)}
              className="flex-1 py-1 rounded-lg bg-gray-900 border border-white/10 text-[11px] font-mono text-gray-300 hover:border-cyan-500 hover:text-white transition-all"
            >
              +{preset}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Amount in C2FLR"
              className="w-full bg-gray-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            />
            <span className="absolute right-3 top-3 text-xs font-mono text-cyan-400 font-bold">C2FLR</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-extrabold font-mono rounded-xl shadow-lg transition-all"
          >
            {activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdraw'}
          </button>
        </form>
      </div>

      {/* Stop Loss Interactive Slider */}
      <div className="mt-5 pt-4 border-t border-white/10 z-10">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> FTSOv2 Stop-Loss Threshold:
          </span>
          <span className="font-bold text-emerald-400">{stopLossSlider.toFixed(1)}% ({stopLossSlider * 100} BPS)</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          step="0.5"
          value={stopLossSlider}
          onChange={(e) => setStopLossSlider(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#ea2a66]"
        />
      </div>
    </div>
  );
};
