// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CasinoReserve - Casino Reserve for Matrix Hub
 * @author Matrix-Hub Team
 * @notice Holds MTX reserves for casino payouts on Ethereum
 * @dev Manages reserve balance and payout distribution
 * 
 * Network: Ethereum Mainnet (Chain ID: 1)
 * Currency: ETH
 * Token: MTX (Matrix Hub Coin)
 */

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CasinoReserve
 * @author Matrix-Hub Team
 * @notice Holds MTX reserves for casino payouts on Ethereum
 * @dev Manages reserve balance and payout distribution
 */
contract CasinoReserve {
    // Custom errors for gas efficiency
    error NotAuthorized();
    error InsufficientReserve();
    error MTXTransferFailed();

    /// @notice MTX token contract
    IERC20 public mtx;
    
    /// @notice Current reserve balance
    uint256 public reserveBalance;
    
    /// @notice Maximum reserve capacity
    uint256 public reserveCap;
    
    /// @notice CasinoCore contract address
    address public casinoCore;

    /**
     * @notice Modifier to restrict access to CasinoCore only
     */
    modifier onlyCasinoCore() {
        if (msg.sender != casinoCore) revert NotAuthorized();
        _;
    }

    /**
     * @notice Constructor initializes reserve with MTX token address
     * @dev Sets up reserve parameters and CasinoCore integration
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Ethereum
     * @param _reserveCap Maximum reserve capacity in MTX
     * @param _casinoCore Address of CasinoCore contract
     */
    constructor(address _mtx, uint256 _reserveCap, address _casinoCore) {
        mtx = IERC20(_mtx); // MTX Token address on Ethereum - set from deployed MatrixHubCoin
        reserveCap = _reserveCap;
        casinoCore = _casinoCore;
    }

    /**
     * @notice Deposit MTX coins to reserve
     * @dev Only callable by CasinoCore
     * @param amount Amount of MTX to deposit
     */
    function deposit(uint256 amount) external onlyCasinoCore {
        reserveBalance += amount;
    }

    /**
     * @notice Pay winner in MTX coins
     * @dev Only callable by CasinoCore
     * @param player Address of the player to pay
     * @param amount Amount of MTX to pay
     */
    function payWinner(address player, uint256 amount) external onlyCasinoCore {
        if (reserveBalance < amount) revert InsufficientReserve();
        reserveBalance -= amount;
        if (!mtx.transfer(player, amount)) revert MTXTransferFailed();
    }

    /**
     * @notice Check reserve health
     * @dev Returns current reserve balance
     * @return Current reserve balance
     */
    function reserveHealth() external view returns (uint256) {
        return reserveBalance;
    }
}
