'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Wallet, Zap, Radio, Globe } from 'lucide-react';
import { WalletModal } from './WalletModal';

export const COSTON2_CHAIN_ID = '0x72'; // 114 in hex

export const COSTON2_NETWORK_PARAMS = {
  chainId: COSTON2_CHAIN_ID,
  chainName: 'Flare Coston2 Testnet',
  nativeCurrency: {
    name: 'Coston2 Flare',
    symbol: 'C2FLR',
    decimals: 18,
  },
  rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
  blockExplorerUrls: ['https://coston2-explorer.flare.network'],
};

interface HeaderProps {
  account: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ account, onConnect, onDisconnect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);

  const handleConnectSuccess = (userAddress: string, walletName: string) => {
    setConnectedWalletName(walletName);
    onConnect(userAddress);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          onConnect(accounts[0]);
        } else {
          onDisconnect();
          setConnectedWalletName(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [onConnect, onDisconnect]);

  return (
    <>
      <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#dc2626] to-[#2563eb] flex items-center justify-center text-white shadow-md">
              <Zap className="w-6 h-6 fill-white/20 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1e3a8a]">
                Flare<span className="text-[#dc2626]">Pulse AI</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-[#dc2626] border border-red-200 uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-live-dot" />
                Coston2 Testnet
              </span>
            </div>
            <p className="text-xs text-blue-900/70 font-medium hidden sm:block">
              FTSOv2 Autonomous Yield & Risk Sentinel
            </p>
          </div>
        </div>

        {/* Network Health Metrics */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 shadow-inner">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-blue-900/60">Oracle:</span>
            <strong className="text-blue-700 font-bold">FTSOv2 Sub-Second</strong>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50/80 border border-red-100 shadow-inner">
            <Globe className="w-4 h-4 text-red-600" />
            <span className="text-red-900/60">Chain:</span>
            <strong className="text-red-600 font-bold">Flare (114)</strong>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-blue-800" />
            <span className="text-slate-500">Enclave:</span>
            <strong className="text-blue-900 font-bold">TEE Verified</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {account ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all shadow-sm"
            >
              <Wallet className="w-4 h-4 text-blue-600" />
              <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono bg-gradient-to-r from-[#dc2626] to-[#2563eb] text-white hover:opacity-95 transition-all shadow-md"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Web3 Wallet</span>
            </button>
          )}
        </div>
      </header>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
      />
    </>
  );
};
