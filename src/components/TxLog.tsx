'use client';

import React, { useState } from 'react';
import { TransactionLog } from '../types';
import { COSTON2_EXPLORER_URL } from '../lib/contract';
import { ExternalLink, CheckCircle2, History, Copy, Check } from 'lucide-react';

interface TxLogProps {
  logs: TransactionLog[];
}

export const TxLog: React.FC<TxLogProps> = ({ logs }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-[#1e3a8a] tracking-tight">On-Chain Activity</h3>
            <span className="text-xs text-slate-500 font-mono">Flare Coston2 (114) Explorer Stream</span>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
        {logs.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all text-xs font-mono group"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1e3a8a] uppercase tracking-wider">{tx.type}</span>
                  <span className="text-slate-500 text-[11px]">• Block #{tx.blockNumber}</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">{tx.strategy}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[#dc2626] font-bold font-mono text-sm">{tx.amount}</div>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <button
                  onClick={() => handleCopy(tx.hash, tx.id)}
                  className="text-slate-500 hover:text-blue-700 transition-all flex items-center gap-1 text-[10px]"
                >
                  {copiedId === tx.id ? <Check className="w-3 h-3 text-blue-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === tx.id ? 'Copied!' : 'Copy Tx'}</span>
                </button>
                <a
                  href={`${COSTON2_EXPLORER_URL}/tx/${tx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
