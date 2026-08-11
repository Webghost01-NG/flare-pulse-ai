'use client';

import React from 'react';
import { TransactionLog } from '../types';
import { COSTON2_EXPLORER_URL } from '../lib/contract';
import { ExternalLink, CheckCircle2, History } from 'lucide-react';

interface TxLogProps {
  logs: TransactionLog[];
}

export const TxLog: React.FC<TxLogProps> = ({ logs }) => {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Coston2 On-Chain Execution Feed</h3>
        </div>
        <span className="text-xs text-gray-500 font-mono">Chain ID: 114 (Coston2)</span>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {logs.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0d111a] border border-gray-800/80 hover:border-gray-700 transition-all text-xs font-mono"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase">{tx.type}</span>
                  <span className="text-gray-400 text-[11px]">• Block #{tx.blockNumber}</span>
                </div>
                <p className="text-gray-400 text-[11px] mt-0.5">{tx.strategy}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-emerald-400 font-bold">{tx.amount}</div>
              <a
                href={`${COSTON2_EXPLORER_URL}/tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline mt-0.5"
              >
                <span>Explorer Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
