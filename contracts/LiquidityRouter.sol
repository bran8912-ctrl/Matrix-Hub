// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title LiquidityRouter
 * @author Matrix-Hub Team
 * @notice Manages liquidity for MTX/MATIC pool on Polygon DEX (QuickSwap)
 * @dev Routes liquidity to DEX pool
 */
contract LiquidityRouter {
    // Custom errors for gas efficiency
    error MTXTransferFromFailed();
    error ZeroAddress();
    error ZeroAmount();

    /// @notice MTX token contract
    IERC20 public mtx;
    
    /// @notice DEX pool address
    address public dexPool;

    /**
     * @notice Constructor initializes router with MTX token and DEX pool
     * @dev Sets up integration with DEX
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Polygon
     * @param _dexPool Address of QuickSwap V2/V3 pool for MTX/MATIC
     */
    constructor(address _mtx, address _dexPool) {
        if (_mtx == address(0)) revert ZeroAddress();
        if (_dexPool == address(0)) revert ZeroAddress();
        mtx = IERC20(_mtx); // MTX Token address on Polygon - set from deployed MatrixHubCoin
        dexPool = _dexPool;
    }

    /**
     * @notice Add liquidity to the DEX pool
     * @dev User must approve this contract to spend 'amount' MTX before calling
     * @param amount Amount of MTX to add to liquidity
     */
    function addLiquidity(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        if (!mtx.transferFrom(msg.sender, dexPool, amount)) revert MTXTransferFromFailed();
    }
}
