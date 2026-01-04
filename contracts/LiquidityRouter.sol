// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LiquidityRouter - Liquidity Management for Matrix Hub Casino
 * @author Matrix-Hub Team
 * @notice Manages liquidity for MTX/ETH pool on Ethereum DEX (Uniswap)
 * @dev Routes liquidity to DEX pool
 * 
 * Network: Ethereum Mainnet (Chain ID: 1)
 * Currency: ETH
 * Token: MTX (Matrix Hub Coin)
 */

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title LiquidityRouter
 * @author Matrix-Hub Team
 * @notice Manages liquidity for MTX/ETH pool on Ethereum DEX (Uniswap)
 * @dev Routes liquidity to DEX pool
 */
contract LiquidityRouter {
    // Custom errors for gas efficiency
    error MTXTransferFromFailed();

    /// @notice MTX token contract
    IERC20 public mtx;
    
    /// @notice DEX pool address
    address public dexPool;

    /**
     * @notice Constructor initializes router with MTX token and DEX pool
     * @dev Sets up integration with DEX
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Ethereum
     * @param _dexPool Address of Uniswap V2/V3 pool for MTX/ETH
     */
    constructor(address _mtx, address _dexPool) {
        mtx = IERC20(_mtx); // MTX Token address on Ethereum - set from deployed MatrixHubCoin
        dexPool = _dexPool;
    }

    /**
     * @notice Add liquidity to the DEX pool
     * @dev User must approve this contract to spend 'amount' MTX before calling
     * @param amount Amount of MTX to add to liquidity
     */
    function addLiquidity(uint256 amount) external {
        if (!mtx.transferFrom(msg.sender, dexPool, amount)) revert MTXTransferFromFailed();
    }
}
