// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IFTSOv2
 * @notice Interface for Flare Time Series Oracle v2 (FTSOv2) on Coston2 / Flare Network.
 * FTSOv2 provides sub-second block latency feeds for cryptocurrencies, equities, commodities, and FX.
 */
interface IFTSOv2 {
    struct FeedValue {
        bytes21 feedId;
        uint32 value;
        int8 decimals;
        uint64 timestamp;
    }

    /**
     * @notice Fetch current feed values by Feed IDs.
     * @param feedIds Array of bytes21 feed identifiers (e.g. 0x01... for FLR/USD, BTC/USD).
     * @return feedValues Array of FeedValue structs containing value, decimals, and timestamp.
     */
    function getFeedValues(bytes21[] calldata feedIds) 
        external 
        view 
        returns (FeedValue[] memory feedValues);

    /**
     * @notice Fetch a single feed value by Feed ID.
     * @param feedId bytes21 identifier.
     * @return value Raw feed value.
     * @return decimals Number of decimals (e.g. 5 for 5 decimal places).
     * @return timestamp Last update timestamp.
     */
    function getFeedValue(bytes21 feedId) 
        external 
        view 
        returns (uint32 value, int8 decimals, uint64 timestamp);
}
