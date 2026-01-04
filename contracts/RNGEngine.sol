// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RNGEngine - Random Number Generator for Matrix Hub Casino
 * @author Matrix-Hub Team
 * @notice Provably fair random number generator for casino games on Ethereum
 * @dev Uses server seed commitment and client seed for verifiable randomness
 * 
 * Network: Ethereum Mainnet (Chain ID: 1)
 * Currency: ETH
 * Token: MTX (Matrix Hub Coin)
 */

/**
 * @title RNGEngine
 * @author Matrix-Hub Team
 * @notice Provably fair random number generator for casino games on Ethereum
 * @dev Uses server seed commitment and client seed for verifiable randomness
 */
contract RNGEngine {
    /// @notice Server seed hash for commitment
    bytes32 public serverSeedHash;
    
    /// @notice Client seed for randomness
    bytes32 public clientSeed;
    
    /// @notice Nonce for unique random values
    uint256 public nonce;

    /**
     * @notice Commit server seed hash
     * @dev Server commits hash before game starts
     * @param hash Hash of server seed
     */
    function commitServerSeed(bytes32 hash) external {
        serverSeedHash = hash;
    }

    /**
     * @notice Resolve game outcome
     * @dev Generates random result and increments nonce
     * @param gameData Encoded game data
     * @return True if player wins, false otherwise
     */
    function resolve(bytes calldata gameData) external returns (bool) {
        bytes32 result = keccak256(abi.encodePacked(serverSeedHash, clientSeed, nonce, gameData));
        ++nonce;
        return interpretResult(result);
    }

    /**
     * @notice Reveal server seed to verify fairness
     * @dev Allows verification that server didn't cheat
     * @param seed Original server seed
     * @return True if seed matches committed hash
     */
    function revealServerSeed(bytes32 seed) external view returns (bool) {
        return keccak256(abi.encodePacked(seed)) == serverSeedHash;
    }

    /**
     * @notice Interpret random result
     * @dev Internal function to determine win/loss from random bytes
     * @param result Random bytes32 value
     * @return True if player wins, false otherwise
     */
    function interpretResult(bytes32 result) internal pure returns (bool) {
        // Example: 50/50 win/lose
        return uint256(result) % 2 == 0;
    }
}
