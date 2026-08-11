import { TransactionLog } from '../types';

export const DEPLOYED_VAULT_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
export const COSTON2_EXPLORER_URL = 'https://coston2-explorer.flare.network';

export const INITIAL_TRANSACTIONS: TransactionLog[] = [
  {
    id: 'tx-1',
    hash: '0x3a4b91f82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e',
    blockNumber: 1048592,
    type: 'REBALANCE',
    strategy: 'Auto-Compound Boost Pool',
    amount: '1,500 C2FLR',
    oraclePrice: 0.02485,
    timestamp: Date.now() - 1000 * 60 * 12,
    status: 'CONFIRMED',
  },
  {
    id: 'tx-2',
    hash: '0x9f14cbf82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e',
    blockNumber: 1048580,
    type: 'DEPOSIT',
    strategy: 'User Position Safeguard',
    amount: '5,000 C2FLR',
    oraclePrice: 0.02460,
    timestamp: Date.now() - 1000 * 60 * 45,
    status: 'CONFIRMED',
  },
  {
    id: 'tx-3',
    hash: '0x74dfcc982c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e',
    blockNumber: 1048554,
    type: 'STOP_LOSS',
    strategy: 'Volatile Spikes Protection',
    amount: '2,100 C2FLR',
    oraclePrice: 0.02390,
    timestamp: Date.now() - 1000 * 60 * 120,
    status: 'CONFIRMED',
  },
];

export function createMockTransaction(type: 'DEPOSIT' | 'WITHDRAW' | 'REBALANCE' | 'STOP_LOSS', amountStr: string, price: number): TransactionLog {
  const hex = Math.random().toString(16).substring(2, 10);
  return {
    id: `tx-${Date.now()}`,
    hash: `0x${hex}91f82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e7d6a5e1f82c0e`,
    blockNumber: Math.floor(1048600 + Math.random() * 50),
    type,
    strategy: type === 'REBALANCE' ? 'AI FTSOv2 Rebalance' : 'Smart Vault Direct',
    amount: amountStr,
    oraclePrice: price,
    timestamp: Date.now(),
    status: 'CONFIRMED',
  };
}
