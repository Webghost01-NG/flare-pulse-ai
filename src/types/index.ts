export interface FTSOFeed {
  symbol: string;
  name: string;
  feedId: string;
  price: number;
  decimals: number;
  change24h: number;
  lastUpdated: number;
  blockLatencyMs: number;
}

export type SignalType = 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'RISK_OFF';

export interface AISignal {
  type: SignalType;
  confidence: number; // 0 - 100%
  volatilityIndex: number; // 0 - 100
  sentimentScore: number; // -1.0 to +1.0
  recommendation: string;
  timestamp: number;
  triggerOraclePrice: number;
  metrics: {
    rsi: number;
    bollingerSpread: number;
    ftsoPriceDelta: number;
  };
}

export interface VaultMetrics {
  totalDeposited: string;
  userBalance: string;
  autoRebalanceEnabled: bool;
  stopLossBps: number;
  totalYieldEarned: string;
  activeStrategy: string;
}

export interface TransactionLog {
  id: string;
  hash: string;
  blockNumber: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'REBALANCE' | 'STOP_LOSS';
  strategy: string;
  amount: string;
  oraclePrice: number;
  timestamp: number;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
}
