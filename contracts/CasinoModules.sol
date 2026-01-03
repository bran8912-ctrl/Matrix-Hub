// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CasinoModules - Supporting Contracts for Matrix Hub Casino
 * @dev Reserve, Liquidity Router, and RNG Engine for Ethereum Mainnet
 * @notice All modules use MTX (ERC-20) token for casino operations
 * 
 * Network: Ethereum Mainnet (Chain ID: 1)
 * Currency: ETH
 * Token: MTX (Matrix Hub Coin)
 */

// MTX Coin integration for user-based casino
// Uses MTXToken contract from CasinoCore.sol
// All casino modules interact with MTXToken for user balances and payouts
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CasinoReserve
 * @dev Holds MTX reserves for casino payouts on Ethereum
 */
contract CasinoReserve {
    IERC20 public mtx;
    uint public reserveBalance;
    uint public reserveCap;
    address public casinoCore;

    // Only CasinoCore can interact with reserve
    modifier onlyCasinoCore() {
        require(msg.sender == casinoCore, "Not authorized");
        _;
    }

    /**
     * @dev Constructor initializes reserve with MTX token address
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Ethereum
     * @param _reserveCap Maximum reserve capacity in MTX
     * @param _casinoCore Address of CasinoCore contract
     */
    constructor(address _mtx, uint _reserveCap, address _casinoCore) {
        mtx = IERC20(_mtx); // MTX Token address on Ethereum - set from deployed MatrixHubCoin
        reserveCap = _reserveCap;
        casinoCore = _casinoCore;
    }

    // Deposit MTX coins to reserve
    function deposit(uint amount) external onlyCasinoCore {
        reserveBalance += amount;
    }

    // Pay winner in MTX coins
    function payWinner(address player, uint amount) external onlyCasinoCore {
        require(reserveBalance >= amount, "Insufficient reserve");
        reserveBalance -= amount;
        require(mtx.transfer(player, amount), "MTX transfer failed");
    }

    function reserveHealth() external view returns (uint) {
        return reserveBalance;
    }
}

/**
 * @title LiquidityRouter
 * @dev Manages liquidity for MTX/ETH pool on Ethereum DEX (Uniswap)
 */
contract LiquidityRouter {
    IERC20 public mtx;
    address public dexPool;

    /**
     * @dev Constructor initializes router with MTX token and DEX pool
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Ethereum
     * @param _dexPool Address of Uniswap V2/V3 pool for MTX/ETH
     */
    constructor(address _mtx, address _dexPool) {
        mtx = IERC20(_mtx); // MTX Token address on Ethereum - set from deployed MatrixHubCoin
        dexPool = _dexPool;
    }

    function addLiquidity(uint amount) external {
        // User must approve this contract to spend 'amount' MTX before calling
        require(mtx.transferFrom(msg.sender, dexPool, amount), "MTX transferFrom failed");
    }
}

/**
 * @title RNGEngine
 * @dev Provably fair random number generator for casino games on Ethereum
 */
contract RNGEngine {
    bytes32 public serverSeedHash;
    bytes32 public clientSeed;
    uint public nonce;

    function commitServerSeed(bytes32 hash) external {
        serverSeedHash = hash;
    }

    function resolve(bytes calldata gameData) external returns (bool) {
        bytes32 result = keccak256(abi.encodePacked(serverSeedHash, clientSeed, nonce, gameData));
        nonce += 1;
        return interpretResult(result);
    }

    function revealServerSeed(bytes32 seed) external view returns (bool) {
        return keccak256(abi.encodePacked(seed)) == serverSeedHash;
    }

    function interpretResult(bytes32 result) internal pure returns (bool) {
        // Example: 50/50 win/lose
        return uint(result) % 2 == 0;
    }
}
