'use client';

import React from 'react';
import { Lock, ShieldCheck, Cpu, Key, Binary } from 'lucide-react';

export const ConfidentialComputeBadge: React.FC = () => {
  return (
    <div className="glass-card-glow p-5 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-blue-950/40 border border-purple-500/40 my-6 relative overflow-hidden">
      {/* Background Neon Pulse Lines */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-xl shrink-0">
          <Lock className="w-6 h-6 animate-pulse text-purple-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              Flare Confidential Compute (TEE) Enclave
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              Track 2 Ready
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-3xl">
            User risk limits, private order books, and neural weights are executed inside a hardware-isolated Trusted Execution Environment.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-0 flex items-center gap-3 font-mono text-xs text-purple-300 bg-gray-950/90 px-4 py-2 rounded-xl border border-white/10 shrink-0 z-10">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span>Enclave Hash: <strong className="text-cyan-400">0x8f2a...c91e</strong></span>
      </div>
    </div>
  );
};
