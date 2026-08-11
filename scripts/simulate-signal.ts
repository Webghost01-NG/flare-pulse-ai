import { ethers } from "ethers";

async function simulate() {
  console.log("⚡ Starting FlarePulse AI Signal & FTSOv2 Simulation...");
  
  const flrPrices = [0.0242, 0.0245, 0.0251, 0.0248, 0.0260, 0.0255];
  for (let i = 0; i < flrPrices.length; i++) {
    const price = flrPrices[i];
    const sentiment = price > 0.025 ? "BULLISH 🚀" : "NEUTRAL ⚖️";
    console.log(`[Block #${1048590 + i}] FTSOv2 FLR/USD: $${price.toFixed(4)} | AI Signal: ${sentiment}`);
  }
  
  console.log("✅ Simulation complete.");
}

simulate();
