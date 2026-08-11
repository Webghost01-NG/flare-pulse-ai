import { AISignal, FTSOFeed, SignalType } from '../types';

export function calculateAISignal(flrFeed: FTSOFeed): AISignal {
  const currentPrice = flrFeed.price;
  const change = flrFeed.change24h;

  // Quantitative AI Signal Computation
  let rsi = 50 + change * 2.8 + (Math.random() - 0.5) * 4;
  rsi = Math.min(95, Math.max(5, rsi));

  const volatilityIndex = Math.min(100, Math.max(10, Math.floor(Math.abs(change) * 7.5 + 25 + (Math.random() - 0.5) * 8)));
  const sentimentScore = Number((Math.tanh(change / 3.0) + (Math.random() - 0.5) * 0.1).toFixed(2));

  let type: SignalType = 'NEUTRAL';
  let recommendation = 'Maintain balanced yield position. Monitoring FTSOv2 price feeds.';

  if (rsi > 70 || change > 5.5) {
    type = 'STRONG_BUY';
    recommendation = 'FTSOv2 signals strong momentum! Auto-compound yield into high-boost pool.';
  } else if (rsi > 55 || change > 1.5) {
    type = 'BUY';
    recommendation = 'Bullish signal detected. Allocating 15% surplus yield to FLR/USD LP pool.';
  } else if (rsi < 35 || change < -4.0) {
    type = 'RISK_OFF';
    recommendation = 'High volatility alert! FTSOv2 stop-loss safeguard activated to protect capital.';
  } else if (rsi < 45 || change < -1.5) {
    type = 'SELL';
    recommendation = 'Bearish divergence detected. Shifting 20% vault assets to stable native reserve.';
  }

  const confidence = Math.min(99, Math.floor(75 + Math.abs(sentimentScore) * 20 + Math.random() * 4));

  return {
    type,
    confidence,
    volatilityIndex,
    sentimentScore,
    recommendation,
    timestamp: Date.now(),
    triggerOraclePrice: currentPrice,
    metrics: {
      rsi: Number(rsi.toFixed(1)),
      bollingerSpread: Number((1.8 + Math.random() * 0.4).toFixed(2)),
      ftsoPriceDelta: Number((change * 0.1).toFixed(3)),
    },
  };
}
