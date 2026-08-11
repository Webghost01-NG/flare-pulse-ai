'use client';

import React from 'react';
import { Lock, ShieldCheck, Cpu } from 'lucide-react';

export const ConfidentialComputeBadge: React.FC = () => {
  return (
    <div className="glass-panel p-4 flex items-center justify-between bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 my-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Flare Confidential Compute (TEE) Safeguard Enclave
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </h4>
          <p className="text-xs text-gray-400">
            User risk limits and AI model parameters are processed inside an encrypted Trusted Execution Environment.
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-cyan-400 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span>Attestation: Verified</span>
      </div>
    </div>
  );
};
