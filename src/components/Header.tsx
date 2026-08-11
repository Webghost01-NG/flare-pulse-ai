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

  // Listen for real-time account and chain changes
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
      <header className="w-full border-b border-white/10 bg-[#04060c]/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ea2a66] to-[#00f2fe] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-11 h-11 rounded-xl bg-[#080d1a] border border-white/20 flex items-center justify-center text-white shadow-xl">
              <Zap className="w-6 h-6 text-[#ea2a66] fill-[#ea2a66]/20 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Flare<span className="gradient-text-flare">Pulse AI</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ea2a66]/15 text-[#ea2a66] border border-[#ea2a66]/30 uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea2a66] animate-live-dot" />
                Coston2 Testnet
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium hidden sm:block">
              FTSOv2 Autonomous Yield & Risk Sentinel
            </p>
          </div>
        </div>

        {/* Network Health Metrics */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-900/80 border border-white/10 shadow-inner">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-gray-400">Oracle:</span>
            <strong className="text-emerald-400 font-bold">FTSOv2 Sub-Second</strong>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-900/80 border border-white/10 shadow-inner">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400">Chain:</span>
            <strong className="text-cyan-400 font-bold">Flare (114)</strong>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-900/80 border border-white/10 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400">Enclave:</span>
            <strong className="text-purple-400 font-bold">TEE Verified</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {account ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-lg"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono btn-neon text-white hover:opacity-95 transition-all shadow-lg"
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
