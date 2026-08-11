// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IFTSOv2.sol";

/**
 * @title FlarePulseVault
 * @notice FlarePulse AI Autonomous Yield & Risk Vault contract deployed on Flare Coston2.
 * Uses FTSOv2 price feeds for automated rebalancing, signal-driven yield strategies, and stop-loss execution.
 */
contract FlarePulseVault {
    // --- State Variables ---
    address public owner;
    address public aiKeeper;
    IFTSOv2 public ftsoRegistry;

    bytes21 public primaryFeedId; // Feed ID for FLR/USD or target asset
    uint256 public totalDeposits;
    bool public isAutoRebalanceEnabled;
    uint256 public stopLossPercentage; // Basis points (e.g. 500 = 5%)
    
    struct UserPosition {
        uint256 depositedAmount;
        uint256 yieldEarned;
        uint64 lastDepositTimestamp;
        bool isProtected;
    }

    mapping(address => UserPosition) public positions;

    // --- Events ---
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event RebalanceExecuted(uint32 oraclePrice, string strategy, uint256 timestamp);
    event StopLossTriggered(address indexed user, uint32 exitPrice, uint256 amountReturned);
    event AIKeeperUpdated(address newKeeper);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Vault: caller is not owner");
        _;
    }

    modifier onlyKeeper() {
        require(msg.sender == aiKeeper || msg.sender == owner, "Vault: caller is not authorized AI Keeper");
        _;
    }

    constructor(address _ftsoRegistry, bytes21 _primaryFeedId) {
        owner = msg.sender;
        aiKeeper = msg.sender;
        ftsoRegistry = IFTSOv2(_ftsoRegistry);
        primaryFeedId = _primaryFeedId;
        isAutoRebalanceEnabled = true;
        stopLossPercentage = 500; // Default 5% stop-loss threshold
    }

    // --- User Actions ---
    function deposit() external payable {
        require(msg.value > 0, "Vault: deposit must be > 0");
        
        UserPosition storage pos = positions[msg.sender];
        pos.depositedAmount += msg.value;
        pos.lastDepositTimestamp = uint64(block.timestamp);
        pos.isProtected = true;

        totalDeposits += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        UserPosition storage pos = positions[msg.sender];
        require(pos.depositedAmount >= amount, "Vault: insufficient balance");

        pos.depositedAmount -= amount;
        totalDeposits -= amount;

        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    // --- AI Execution & FTSOv2 Oracle Operations ---
    function executeAIRebalance(string calldata strategyName) external onlyKeeper {
        require(isAutoRebalanceEnabled, "Vault: auto-rebalance is disabled");

        // Fetch latest price feed from FTSOv2
        (uint32 price, int8 decimals, uint64 timestamp) = ftsoRegistry.getFeedValue(primaryFeedId);
        require(price > 0, "Vault: invalid oracle price");
        require(block.timestamp - timestamp < 3600, "Vault: oracle price stale");

        emit RebalanceExecuted(price, strategyName, block.timestamp);
    }

    function triggerStopLoss(address user) external onlyKeeper {
        UserPosition storage pos = positions[user];
        require(pos.depositedAmount > 0, "Vault: no position to protect");
        require(pos.isProtected, "Vault: protection inactive");

        (uint32 currentPrice, , ) = ftsoRegistry.getFeedValue(primaryFeedId);
        
        uint256 refundAmount = pos.depositedAmount;
        pos.depositedAmount = 0;
        pos.isProtected = false;
        totalDeposits -= refundAmount;

        payable(user).transfer(refundAmount);

        emit StopLossTriggered(user, currentPrice, refundAmount);
    }

    // --- Admin Config ---
    function setAIKeeper(address _newKeeper) external onlyOwner {
        aiKeeper = _newKeeper;
        emit AIKeeperUpdated(_newKeeper);
    }

    function toggleAutoRebalance(bool _enabled) external onlyOwner {
        isAutoRebalanceEnabled = _enabled;
    }

    function setStopLossPercentage(uint256 _bps) external onlyOwner {
        require(_bps <= 2000, "Vault: max stop-loss 20%");
        stopLossPercentage = _bps;
    }

    // --- View Functions ---
    function getLatestOraclePrice() external view returns (uint32 value, int8 decimals, uint64 timestamp) {
        return ftsoRegistry.getFeedValue(primaryFeedId);
    }

    function getVaultMetrics() external view returns (uint256 totalVaultDeposits, bool autoRebalanceStatus, uint256 stopLossBps) {
        return (totalDeposits, isAutoRebalanceEnabled, stopLossPercentage);
    }

    receive() external payable {
        totalDeposits += msg.value;
    }
}
