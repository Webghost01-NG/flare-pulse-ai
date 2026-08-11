// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IFTSOv2.sol";

/**
 * @title MockFTSOv2
 * @notice Mock implementation of Flare FTSOv2 for local unit testing and Coston2 fallback testing.
 */
contract MockFTSOv2 is IFTSOv2 {
    mapping(bytes21 => FeedValue) public mockFeeds;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Default mock FLR/USD feed: $0.02450 (5 decimals)
        bytes21 flrFeedId = bytes21(keccak256("FLR/USD"));
        mockFeeds[flrFeedId] = FeedValue(flrFeedId, 2450, 5, uint64(block.timestamp));

        // Default mock BTC/USD feed: $64,500.00 (2 decimals)
        bytes21 btcFeedId = bytes21(keccak256("BTC/USD"));
        mockFeeds[btcFeedId] = FeedValue(btcFeedId, 6450000, 2, uint64(block.timestamp));
    }

    function setMockFeed(bytes21 feedId, uint32 value, int8 decimals) external onlyOwner {
        mockFeeds[feedId] = FeedValue(feedId, value, decimals, uint64(block.timestamp));
    }

    function getFeedValues(bytes21[] calldata feedIds) external view override returns (FeedValue[] memory feedValues) {
        feedValues = new FeedValue[](feedIds.length);
        for (uint256 i = 0; i < feedIds.length; i++) {
            feedValues[i] = mockFeeds[feedIds[i]];
        }
        return feedValues;
    }

    function getFeedValue(bytes21 feedId) external view override returns (uint32 value, int8 decimals, uint64 timestamp) {
        FeedValue memory feed = mockFeeds[feedId];
        return (feed.value, feed.decimals, feed.timestamp);
    }
}
