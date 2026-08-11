'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FTSOTicker } from '../components/FTSOTicker';
import { AISignalRadar } from '../components/AISignalRadar';
import { YieldChart } from '../components/YieldChart';
import { VaultPanel } from '../components/VaultPanel';
import { TxLog } from '../components/TxLog';
import { ConfidentialComputeBadge } from '../components/ConfidentialComputeBadge';
import { INITIAL_FEEDS, getUpdatedFTSOFeeds } from '../lib/ftso';
import { calculateAISignal } from '../lib/ai-engine';
import { INITIAL_TRANSACTIONS, createMockTransaction } from '../lib/contract';
import { FTSOFeed, AISignal, VaultMetrics, TransactionLog } from '../types';

export default function Home() {
  const [feeds, setFeeds] = useState<FTSOFeed[]>(INITIAL_FEEDS);
  const [aiSignal, setAiSignal] = useState<AISignal>(() => calculateAISignal(INITIAL_FEEDS[0]));
  const [txLogs, setTxLogs] = useState<TransactionLog[]>(INITIAL_TRANSACTIONS);
  const [isExecuting, setIsExecuting] = useState(false);

  const [vaultMetrics, setVaultMetrics] = useState<VaultMetrics>({
    totalDeposited: '18,450',
    userBalance: '5,000',
    autoRebalanceEnabled: true,
    stopLossBps: 500,
    totalYieldEarned: '420.5',
    activeStrategy: 'FTSOv2 Dynamic Delta Rebalance',
  });

  // Live FTSOv2 Sub-Second Block Polling Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFeeds((prev) => {
        const updated = getUpdatedFTSOFeeds(prev);
        const flrFeed = updated[0];
        setAiSignal(calculateAISignal(flrFeed));
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle Manual AI Rebalance Execution
  const handleExecuteRebalance = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const flrPrice = feeds[0].price;
      const newTx = createMockTransaction('REBALANCE', '1,200 C2FLR', flrPrice);
      setTxLogs((prev) => [newTx, ...prev]);
      setIsExecuting(false);
    }, 1800);
  };

  // Handle Deposit
  const handleDeposit = (amount: string) => {
    const num = parseFloat(amount) || 0;
    const prevUser = parseFloat(vaultMetrics.userBalance.replace(/,/g, '')) || 0;
    const prevTotal = parseFloat(vaultMetrics.totalDeposited.replace(/,/g, '')) || 0;

    setVaultMetrics((prev) => ({
      ...prev,
      userBalance: (prevUser + num).toLocaleString(),
      totalDeposited: (prevTotal + num).toLocaleString(),
    }));

    const newTx = createMockTransaction('DEPOSIT', `${num} C2FLR`, feeds[0].price);
    setTxLogs((prev) => [newTx, ...prev]);
  };

  // Handle Withdraw
  const handleWithdraw = (amount: string) => {
    const num = parseFloat(amount) || 0;
    const prevUser = parseFloat(vaultMetrics.userBalance.replace(/,/g, '')) || 0;
    const prevTotal = parseFloat(vaultMetrics.totalDeposited.replace(/,/g, '')) || 0;

    const newUser = Math.max(0, prevUser - num);
    const newTotal = Math.max(0, prevTotal - num);

    setVaultMetrics((prev) => ({
      ...prev,
      userBalance: newUser.toLocaleString(),
      totalDeposited: newTotal.toLocaleString(),
    }));

    const newTx = createMockTransaction('WITHDRAW', `${num} C2FLR`, feeds[0].price);
    setTxLogs((prev) => [newTx, ...prev]);
  };

  const handleToggleAuto = () => {
    setVaultMetrics((prev) => ({
      ...prev,
      autoRebalanceEnabled: !prev.autoRebalanceEnabled,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-gray-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Price Ticker */}
        <FTSOTicker feeds={feeds} />

        {/* Confidential Compute Banner */}
        <ConfidentialComputeBadge />

        {/* Main Grid: AI Sentinel & Smart Vault */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AISignalRadar
            signal={aiSignal}
            onExecuteRebalance={handleExecuteRebalance}
            isExecuting={isExecuting}
          />
          <VaultPanel
            metrics={vaultMetrics}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onToggleAuto={handleToggleAuto}
          />
        </div>

        {/* Second Row: Chart & On-Chain Execution Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <YieldChart />
          </div>
          <div className="lg:col-span-1">
            <TxLog logs={txLogs} />
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-gray-800 bg-[#07090e] py-6 text-center text-xs text-gray-500 font-mono">
        <p>FlarePulse AI • Deployed on Flare Coston2 Testnet (Chain ID 114) • Built for Flare Summer Signal Hackathon</p>
      </footer>
    </div>
  );
}
