'use client';

import React, { useState } from 'react';
import { VaultMetrics } from '../types';
import { Vault, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6 z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Vault className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-[#1e3a8a] tracking-tight">Smart Vault Allocation</h3>
            <span className="text-xs text-slate-500 font-mono">Contract: 0x71C7...976F (Coston2)</span>
          </div>
        </div>

        {/* Auto Rebalance Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-600 font-mono">Auto Rebalance:</span>
          <button
            onClick={onToggleAuto}
            className={`w-12 h-6 rounded-full transition-all relative ${
              metrics.autoRebalanceEnabled ? 'bg-[#2563eb]' : 'bg-slate-300'
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
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Total Vault Value (TVL)</span>
          <p className="text-2xl font-black text-[#1e3a8a] mt-1">{metrics.totalDeposited} <span className="text-sm text-blue-600">C2FLR</span></p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Your Protected Balance</span>
          <p className="text-2xl font-black text-[#dc2626] mt-1">{metrics.userBalance} <span className="text-sm text-red-600">C2FLR</span></p>
        </div>
      </div>

      {/* Interactive Tabs & Preset Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 z-10">
        <div className="flex gap-2 mb-4 bg-slate-200/70 p-1.5 rounded-xl border border-slate-300">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              activeTab === 'deposit'
                ? 'bg-[#dc2626] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> Deposit C2FLR
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${
              activeTab === 'withdraw'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
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
              className="flex-1 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-700 hover:border-blue-500 hover:text-blue-700 transition-all shadow-sm"
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
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0f172a] font-mono focus:outline-none focus:border-blue-500 shadow-inner"
            />
            <span className="absolute right-3 top-3 text-xs font-mono text-blue-700 font-bold">C2FLR</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] hover:opacity-95 text-white text-xs font-extrabold font-mono rounded-xl shadow-md transition-all"
          >
            {activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdraw'}
          </button>
        </form>
      </div>

      {/* Stop Loss Interactive Slider */}
      <div className="mt-5 pt-4 border-t border-slate-200 z-10">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> FTSOv2 Stop-Loss Threshold:
          </span>
          <span className="font-bold text-[#dc2626]">{stopLossSlider.toFixed(1)}% ({stopLossSlider * 100} BPS)</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          step="0.5"
          value={stopLossSlider}
          onChange={(e) => setStopLossSlider(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
        />
      </div>
    </div>
  );
};
