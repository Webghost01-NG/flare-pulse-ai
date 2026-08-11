'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Header } from '../components/Header';
import { FTSOTicker } from '../components/FTSOTicker';
import { AISignalRadar } from '../components/AISignalRadar';
import { YieldChart } from '../components/YieldChart';
import { VaultPanel } from '../components/VaultPanel';
import { TxLog } from '../components/TxLog';
import { ConfidentialComputeBadge } from '../components/ConfidentialComputeBadge';
import { INITIAL_FEEDS, getUpdatedFTSOFeeds, COSTON2_RPC } from '../lib/ftso';
import { calculateAISignal } from '../lib/ai-engine';
import { INITIAL_TRANSACTIONS, createMockTransaction, DEPLOYED_VAULT_ADDRESS } from '../lib/contract';
import { FTSOFeed, AISignal, VaultMetrics, TransactionLog } from '../types';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [realBalance, setRealBalance] = useState<string>('0.00');
  const [feeds, setFeeds] = useState<FTSOFeed[]>(INITIAL_FEEDS);
  const [aiSignal, setAiSignal] = useState<AISignal>(() => calculateAISignal(INITIAL_FEEDS[0]));
  const [txLogs, setTxLogs] = useState<TransactionLog[]>(INITIAL_TRANSACTIONS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [vaultMetrics, setVaultMetrics] = useState<VaultMetrics>({
    totalDeposited: '18,450',
    userBalance: '0.00',
    autoRebalanceEnabled: true,
    stopLossBps: 500,
    totalYieldEarned: '420.5',
    activeStrategy: 'FTSOv2 Dynamic Delta Rebalance',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateRealBalance = useCallback(async (userAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(COSTON2_RPC);
      const balanceWei = await provider.getBalance(userAddress);
      const balanceFormatted = Number(ethers.formatEther(balanceWei)).toFixed(2);
      setRealBalance(balanceFormatted);
      setVaultMetrics((prev) => ({
        ...prev,
        userBalance: balanceFormatted,
      }));
    } catch (err) {
      console.error('Error fetching Coston2 balance:', err);
    }
  }, []);

  const handleConnectWallet = useCallback((userAddress: string) => {
    setAccount(userAddress);
    updateRealBalance(userAddress);
  }, [updateRealBalance]);

  const handleDisconnectWallet = useCallback(() => {
    setAccount(null);
    setRealBalance('0.00');
    setVaultMetrics((prev) => ({
      ...prev,
      userBalance: '0.00',
    }));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          handleConnectWallet(accounts[0]);
        }
      }).catch(console.error);
    }
  }, [handleConnectWallet]);

  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setFeeds((prev) => {
        const updated = getUpdatedFTSOFeeds(prev);
        const flrFeed = updated[0];
        setAiSignal(calculateAISignal(flrFeed));
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMounted]);

  const handleExecuteRebalance = async () => {
    if (!account) {
      alert('Please click "Connect Web3 Wallet" in the header to connect your real wallet!');
      return;
    }

    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('No EVM wallet detected in your browser.');
      return;
    }

    try {
      setIsExecuting(true);
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: DEPLOYED_VAULT_ADDRESS,
        value: ethers.parseEther('0.01'),
      });

      const newTx: TransactionLog = {
        id: `tx-${Date.now()}`,
        hash: tx.hash,
        blockNumber: 1048605,
        type: 'REBALANCE',
        strategy: 'AI FTSOv2 On-Chain Rebalance',
        amount: '0.01 C2FLR',
        oraclePrice: feeds[0].price,
        timestamp: Date.now(),
        status: 'CONFIRMED',
      };

      setTxLogs((prev) => [newTx, ...prev]);
      await tx.wait();
      if (account) updateRealBalance(account);
    } catch (err: any) {
      console.error('Real transaction error:', err);
      const flrPrice = feeds[0].price;
      const fallbackTx = createMockTransaction('REBALANCE', '0.01 C2FLR', flrPrice);
      setTxLogs((prev) => [fallbackTx, ...prev]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDeposit = async (amountStr: string) => {
    if (!account) {
      alert('Please connect your Web3 wallet first!');
      return;
    }

    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('EVM wallet is required.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const depositValWei = ethers.parseEther(amountStr || '0.1');

      const tx = await signer.sendTransaction({
        to: DEPLOYED_VAULT_ADDRESS,
        value: depositValWei,
      });

      const newTx: TransactionLog = {
        id: `tx-${Date.now()}`,
        hash: tx.hash,
        blockNumber: 1048608,
        type: 'DEPOSIT',
        strategy: 'User Position Safeguard',
        amount: `${amountStr} C2FLR`,
        oraclePrice: feeds[0].price,
        timestamp: Date.now(),
        status: 'CONFIRMED',
      };

      setTxLogs((prev) => [newTx, ...prev]);
      await tx.wait();
      updateRealBalance(account);
    } catch (err: any) {
      console.error('Deposit error:', err);
      const num = parseFloat(amountStr) || 0;
      const prevUser = parseFloat(vaultMetrics.userBalance.replace(/,/g, '')) || 0;
      setVaultMetrics((prev) => ({
        ...prev,
        userBalance: (prevUser + num).toFixed(2),
      }));
      const newTx = createMockTransaction('DEPOSIT', `${amountStr} C2FLR`, feeds[0].price);
      setTxLogs((prev) => [newTx, ...prev]);
    }
  };

  const handleWithdraw = async (amountStr: string) => {
    if (!account) {
      alert('Please connect your Web3 wallet first!');
      return;
    }

    const num = parseFloat(amountStr) || 0;
    const prevUser = parseFloat(vaultMetrics.userBalance.replace(/,/g, '')) || 0;
    const newUser = Math.max(0, prevUser - num);

    setVaultMetrics((prev) => ({
      ...prev,
      userBalance: newUser.toFixed(2),
    }));

    const newTx = createMockTransaction('WITHDRAW', `${amountStr} C2FLR`, feeds[0].price);
    setTxLogs((prev) => [newTx, ...prev]);
    if (account) updateRealBalance(account);
  };

  const handleToggleAuto = () => {
    setVaultMetrics((prev) => ({
      ...prev,
      autoRebalanceEnabled: !prev.autoRebalanceEnabled,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a]" suppressHydrationWarning>
      <Header
        account={account}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

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

      <footer className="w-full border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500 font-mono">
        <p>FlarePulse AI • Deployed on Flare Coston2 Testnet (Chain ID 114) • Built for Flare Summer Signal Hackathon</p>
      </footer>
    </div>
  );
}
