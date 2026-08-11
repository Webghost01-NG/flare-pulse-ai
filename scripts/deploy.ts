import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying FlarePulse AI Contracts to Flare Coston2 Testnet...");

  const [deployer] = await ethers.getSigners();
  if (deployer) {
    console.log(`📡 Deployer Account: ${deployer.address}`);
  } else {
    console.log("📡 Deploying with default provider / test account...");
  }

  // 1. Deploy Mock FTSOv2 Oracle
  const MockFTSOv2Factory = await ethers.getContractFactory("MockFTSOv2");
  const mockFtso = await MockFTSOv2Factory.deploy();
  await mockFtso.waitForDeployment();
  const mockFtsoAddress = await mockFtso.getAddress();
  console.log(`✅ MockFTSOv2 deployed at: ${mockFtsoAddress}`);

  // 2. Deploy FlarePulseVault
  const flrFeedId = ethers.keccak256(ethers.toUtf8Bytes("FLR/USD")).substring(0, 44);
  const FlarePulseVaultFactory = await ethers.getContractFactory("FlarePulseVault");
  const vault = await FlarePulseVaultFactory.deploy(mockFtsoAddress, flrFeedId);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`✅ FlarePulseVault deployed at: ${vaultAddress}`);

  console.log("\n🎉 Deployment Summary:");
  console.log(`Network: Coston2 (Chain ID 114)`);
  console.log(`MockFTSOv2: ${mockFtsoAddress}`);
  console.log(`FlarePulseVault: ${vaultAddress}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
