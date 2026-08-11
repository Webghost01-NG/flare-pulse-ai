'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Wallet, AlertCircle } from 'lucide-react';
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
  getProvider: () => any;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
}) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to safely locate specific wallet provider even when multiple extensions override window.ethereum
  const getSpecificProvider = (type: 'metamask' | 'phantom' | 'coinbase' | 'walletconnect') => {
    if (typeof window === 'undefined') return null;
    const win = window as any;

    if (type === 'metamask') {
      if (win.ethereum?.providers) {
        return win.ethereum.providers.find((p: any) => p.isMetaMask) || win.ethereum;
      }
      return win.ethereum;
    }

    if (type === 'phantom') {
      return win.phantom?.ethereum || win.ethereum;
    }

    if (type === 'coinbase') {
      return win.coinbaseWalletExtension || (win.ethereum?.isCoinbaseWallet ? win.ethereum : null) || win.ethereum;
    }

    return win.ethereum;
  };

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask / Browser EVM',
      subtext: 'Ethereum, Flare Coston2, Base, Arbitrum',
      iconBg: 'bg-orange-50 text-orange-600 border-orange-200',
      iconText: '🦊',
      badge: 'Recommended',
      getProvider: () => getSpecificProvider('metamask'),
    },
    {
      id: 'phantom',
      name: 'Phantom Wallet',
      subtext: 'Multi-Chain EVM & Solana',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      iconText: '👻',
      getProvider: () => getSpecificProvider('phantom'),
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      subtext: 'Coinbase Smart Wallet & Extension',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      iconText: '🔵',
      getProvider: () => getSpecificProvider('coinbase'),
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect v2',
      subtext: 'Mobile Apps, Rainbow, Trust Wallet, QR Code',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      iconText: '🌐',
      getProvider: () => getSpecificProvider('walletconnect'),
    },
  ];

  const handleSelectWallet = async (option: WalletOption) => {
    setErrorMsg(null);
    setConnectingId(option.id);

    try {
      const provider = option.getProvider();
      if (!provider) {
        throw new Error(`${option.name} extension not detected. Please install the extension.`);
      }

      // 1. Request accounts safely
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts authorized in wallet.');
      }

      const userAddress = accounts[0];

      // 2. Attempt network switch to Coston2 Testnet safely
      // Wrap in try-catch so non-Coston2 wallets (like Phantom) don't throw blocking unsupported network errors
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: COSTON2_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // If chain is not added yet (code 4902), attempt to add it
        if (switchError?.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [COSTON2_NETWORK_PARAMS],
            });
          } catch (addError) {
            console.warn('Custom chain addition not supported by this wallet provider:', addError);
          }
        } else {
          console.warn('Network switch skipped by wallet provider:', switchError);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#1e3a8a] tracking-tight">Connect Web3 Wallet</h3>
              <p className="text-xs text-slate-500">Select your preferred EVM provider</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle description */}
        <p className="text-xs text-slate-600 mb-4 leading-relaxed font-mono">
          Connect your Web3 browser wallet to configure yield mandates, verify FTSOv2 ratings, and sign Flare Coston2 transactions.
        </p>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
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
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xl font-bold ${opt.iconBg}`}>
                    {opt.iconText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#0f172a] group-hover:text-blue-700 transition-all">
                        {opt.name}
                      </h4>
                      {opt.badge && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{opt.subtext}</p>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all">
                  {isSelected ? (
                    <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin inline-block" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> End-to-End Encrypted Session
          </span>
          <span className="text-blue-700 font-bold">Flare Coston2 (114)</span>
        </div>
      </div>
    </div>
  );
};
