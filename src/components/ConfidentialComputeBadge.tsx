'use client';

import React from 'react';
import { Lock, ShieldCheck, Cpu } from 'lucide-react';

export const ConfidentialComputeBadge: React.FC = () => {
  return (
    <div className="glass-card-glow p-5 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-red-50/50 via-white to-blue-50/50 border border-blue-200 my-6 relative overflow-hidden shadow-sm">
      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-sm shrink-0">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-black text-[#1e3a8a] tracking-tight flex items-center gap-2">
              Flare Confidential Compute (TEE) Enclave
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </h4>
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-red-100 text-[#dc2626] border border-red-200 uppercase">
              Track 2 Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
            User risk limits, private order books, and neural weights are executed inside a hardware-isolated Trusted Execution Environment.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-0 flex items-center gap-3 font-mono text-xs text-blue-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 z-10">
        <Cpu className="w-4 h-4 text-blue-600" />
        <span>Enclave Hash: <strong className="text-[#dc2626]">0x8f2a...c91e</strong></span>
      </div>
    </div>
  );
};
