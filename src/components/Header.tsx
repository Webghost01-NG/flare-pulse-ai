'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck, Wallet, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = () => {
    if (isConnected) {
      setIsConnected(false);
      setWalletAddress(null);
    } else {
      setIsConnected(true);
      setWalletAddress('0x3a4b...7d6a');
    }
  };

  return (
    <header className="w-full border-b border-gray-800 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ea2a66] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-[#ea2a66]/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Flare<span className="gradient-text-flare">Pulse AI</span>
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ea2a66]/20 text-[#ea2a66] border border-[#ea2a66]/30">
              COSTON2 TESTNET
            </span>
          </div>
          <p className="text-xs text-gray-400">FTSOv2 Autonomous Yield & Risk Sentinel</p>
        </div>
      </div>

      {/* Network Status & Quick Info */}
      <div className="hidden md:flex items-center gap-6 text-xs text-gray-300">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>FTSOv2 Oracle: <strong className="text-emerald-400 font-mono">Active (Sub-Second)</strong></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-gray-800">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>TEE Safeguard: <strong className="text-cyan-400 font-mono">Verified</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleConnectWallet}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-gradient-to-r from-[#ea2a66] to-[#ff6b35] text-white hover:opacity-95 shadow-[#ea2a66]/25'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnected ? walletAddress : 'Connect Wallet'}</span>
        </button>
      </div>
    </header>
  );
};
