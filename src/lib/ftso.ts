import { FTSOFeed } from '../types';

export const COSTON2_RPC = 'https://coston2-api.flare.network/ext/C/rpc';

// Fixed initial feeds to guarantee identical server and client initial HTML
export const INITIAL_FEEDS: FTSOFeed[] = [
  {
    symbol: 'FLR',
    name: 'Flare Token',
    feedId: '0x01464c522f55534400000000000000000000000000',
    price: 0.02485,
    decimals: 5,
    change24h: 4.82,
    lastUpdated: 1786461000000,
    blockLatencyMs: 420,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    feedId: '0x014254432f55534400000000000000000000000000',
    price: 64850.25,
    decimals: 2,
    change24h: 2.15,
    lastUpdated: 1786461000000,
    blockLatencyMs: 380,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    feedId: '0x014554482f55534400000000000000000000000000',
    price: 3420.80,
    decimals: 2,
    change24h: -0.85,
    lastUpdated: 1786461000000,
    blockLatencyMs: 410,
  },
  {
    symbol: 'XRP',
    name: 'XRP Ledger',
    feedId: '0x015852502f55534400000000000000000000000000',
    price: 0.5840,
    decimals: 4,
    change24h: 6.40,
    lastUpdated: 1786461000000,
    blockLatencyMs: 390,
  },
];

/**
 * Simulates micro-fluctuations in FTSOv2 sub-second feeds during client-side polling.
 */
export function getUpdatedFTSOFeeds(currentFeeds: FTSOFeed[]): FTSOFeed[] {
  return currentFeeds.map((feed) => {
    const delta = (Math.random() - 0.48) * 0.003 * feed.price;
    const newPrice = Math.max(0.0001, feed.price + delta);
    const changeDelta = (Math.random() - 0.5) * 0.05;
    return {
      ...feed,
      price: Number(newPrice.toFixed(feed.decimals)),
      change24h: Number((feed.change24h + changeDelta).toFixed(2)),
      lastUpdated: Date.now(),
      blockLatencyMs: Math.floor(350 + Math.random() * 120),
    };
  });
}
