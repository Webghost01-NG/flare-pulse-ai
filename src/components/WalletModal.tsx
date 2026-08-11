'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2, Wallet, ExternalLink } from 'lucide-react';
import { COSTON2_CHAIN_ID, COSTON2_NETWORK_PARAMS } from './Header';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (address: string, walletName: string) => void;
}

interface WalletOption {
  id: string;
  name: string;
  subtext: string;
  iconBg: string;
  iconText: string;
  badge?: string;
  checkProvider: () => any;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
}) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask / Browser EVM',
      subtext: 'Ethereum, Flare Coston2, Base, Arbitrum',
      iconBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      iconText: '🦊',
      badge: 'Popular',
      checkProvider: () => (typeof window !== 'undefined' ? (window as any).ethereum : null),
    },
    {
      id: 'phantom',
      name: 'Phantom Wallet',
      subtext: 'Multi-Chain EVM & Solana',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      iconText: '👻',
      checkProvider: () => (typeof window !== 'undefined' ? ((window as any).phantom?.ethereum || (window as any).ethereum) : null),
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      subtext: 'Coinbase Smart Wallet & Extension',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      iconText: '🔵',
      checkProvider: () => (typeof window !== 'undefined' ? ((window as any).coinbaseWalletExtension || (window as any).ethereum) : null),
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect v2',
      subtext: 'Mobile Apps, Rainbow, Trust Wallet, QR Code',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      iconText: '🌐',
      checkProvider: () => (typeof window !== 'undefined' ? (window as any).ethereum : null),
    },
  ];

  const handleSelectWallet = async (option: WalletOption) => {
    setErrorMsg(null);
    setConnectingId(option.id);

    try {
      const provider = option.checkProvider();
      if (!provider) {
        throw new Error(`${option.name} extension not detected. Please install the extension.`);
      }

      // 1. Request real accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts authorized');
      }

      const userAddress = accounts[0];

      // 2. Switch or add Coston2 Testnet
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: COSTON2_CHAIN_ID }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [COSTON2_NETWORK_PARAMS],
          });
        }
      }

      onConnectSuccess(userAddress, option.name);
      onClose();
    } catch (err: any) {
      console.error('Wallet connect error:', err);
      setErrorMsg(err.message || 'Failed to connect wallet');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-md bg-[#0a0f1d] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ea2a66]/20 border border-[#ea2a66]/40 flex items-center justify-center text-[#ea2a66]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white tracking-tight">Connect Web3 Wallet</h3>
              <p className="text-xs text-gray-400">Select your preferred EVM provider</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle description */}
        <p className="text-xs text-gray-300 mb-4 leading-relaxed font-mono">
          Connect your Web3 browser wallet to configure yield mandates, verify FTSOv2 ratings, and sign Flare Coston2 transactions.
        </p>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Wallet Options List */}
        <div className="space-y-3">
          {walletOptions.map((opt) => {
            const isSelected = connectingId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectWallet(opt)}
                disabled={connectingId !== null}
                className="w-full p-4 rounded-2xl bg-[#0e1424] border border-white/10 hover:border-[#ea2a66]/50 hover:bg-[#121a30] transition-all flex items-center justify-between group text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xl font-bold ${opt.iconBg}`}>
                    {opt.iconText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white group-hover:text-[#ea2a66] transition-all">
                        {opt.name}
                      </h4>
                      {opt.badge && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{opt.subtext}</p>
                  </div>
                </div>

                <div className="text-gray-400 group-hover:text-[#ea2a66] group-hover:translate-x-1 transition-all">
                  {isSelected ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#ea2a66] border-t-transparent animate-spin inline-block" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> End-to-End Encrypted Session
          </span>
          <span className="text-cyan-400">Flare Coston2 (114)</span>
        </div>
      </div>
    </div>
  );
};
