'use client';

import React, { useState } from 'react';
import { VaultMetrics } from '../types';
import { Vault, ShieldCheck, ArrowUpRight, ArrowDownLeft, Sliders } from 'lucide-react';

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
  const [amountInput, setAmountInput] = useState('100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'deposit') {
      onDeposit(amountInput);
    } else {
      onWithdraw(amountInput);
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Vault className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Smart Vault Strategy</h3>
            <span className="text-xs text-gray-400">Deployed on Coston2 Testnet</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Auto Rebalance:</span>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
          <span className="text-xs text-gray-400">Total Vault Value</span>
          <p className="text-xl font-bold font-mono text-white mt-1">{metrics.totalDeposited} C2FLR</p>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
          <span className="text-xs text-gray-400">Your Protected Balance</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{metrics.userBalance} C2FLR</p>
        </div>
      </div>

      {/* Tabs & Form */}
      <div className="bg-[#0d111a] border border-gray-800 rounded-xl p-4">
        <div className="flex gap-2 mb-4 bg-gray-900/80 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'deposit' ? 'bg-[#ea2a66] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Deposit C2FLR
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'withdraw' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" /> Withdraw
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Amount"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#ea2a66]"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            {activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdraw'}
          </button>
        </form>
      </div>

      {/* Stop Loss Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>FTSOv2 Stop-Loss Threshold:</span>
        </div>
        <span className="font-mono text-emerald-400 font-bold">5.0% (500 BPS)</span>
      </div>
    </div>
  );
};
