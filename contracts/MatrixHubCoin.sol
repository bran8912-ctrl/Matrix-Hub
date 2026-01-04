// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 Matrix-HubCoin (MTX)
  Utility token for the Matrix-Hub ecosystem on Ethereum Mainnet.
  Direct ETH→MTX mint for easy onboarding.
  No taxes. Owner can pause minting.
  
  Network: Ethereum Mainnet (Chain ID: 1)
  Token Standard: ERC-20
  Initial Owner: 0x58e7893356002ac8f8f612f7b3d29d8b181d85b3
  
  Audit Trail: Standard OpenZeppelin ERC20 implementation with owner-controlled minting
  Security: Auditable, transparent, and follows best practices
*/

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MatrixHubCoin
 * @author Matrix-Hub Team
 * @notice ERC-20 utility token for the Matrix-Hub ecosystem on Ethereum Mainnet
 * @dev Implements direct ETH→MTX minting with owner-controlled parameters
 */
contract MatrixHubCoin is ERC20, Ownable {
    // Custom errors for gas efficiency
    error ZeroAddress();
    error ZeroAmount();
    error MintingPaused();
    error ExceedsMaxSupply();
    error InvalidRate();
    error WithdrawalFailed();
    error NoETHToWithdraw();
    /// @notice Maximum supply fixed at deployment
    uint256 public immutable MAX_SUPPLY;
    
    /// @notice Fixed exchange rate: 1 ETH = ethToMtxRate MTX (can be adjusted by owner)
    uint256 public ethToMtxRate = 100000;
    
    /// @notice Minting can be paused by owner (e.g., when transitioning to DEX-only)
    bool public mintingPaused = false;
    
    /// @notice Emitted when MTX is purchased with ETH
    /// @param buyer Address of the buyer
    /// @param ethAmount Amount of ETH spent
    /// @param mtxAmount Amount of MTX received
    event MTXPurchased(address indexed buyer, uint256 indexed ethAmount, uint256 indexed mtxAmount);
    
    /// @notice Emitted when the exchange rate is updated
    /// @param newRate New exchange rate
    event RateUpdated(uint256 indexed newRate);
    
    /// @notice Emitted when minting is paused or unpaused
    /// @param paused True if minting is paused, false otherwise
    event MintingPaused(bool indexed paused);
    
    /// @notice Emitted when ETH is withdrawn from the contract
    /// @param recipient Address receiving the ETH
    /// @param amount Amount of ETH withdrawn
    event Withdrawal(address indexed recipient, uint256 indexed amount);

    /**
     * @notice Constructor sets the initial owner and mints the total supply to owner
     * @dev Initializes ERC20 with name "Matrix-HubCoin" and symbol "MTX"
     * @param initialSupply The initial supply in whole tokens (e.g., 100000000 for 100M MTX)
     * @param initialOwner The address that will own the contract and receive initial supply
     */
    constructor(uint256 initialSupply, address initialOwner) ERC20("Matrix-HubCoin", "MTX") Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        if (initialSupply == 0) revert ZeroAmount();
        MAX_SUPPLY = initialSupply * 10 ** decimals();
        _mint(initialOwner, MAX_SUPPLY);
    }

    /**
     * @notice Direct ETH→MTX purchase function
     * @dev Users send ETH and receive MTX at the fixed rate
     */
    function buyMTX() external payable {
        _buyMTXInternal();
    }
    
    /**
     * @notice Fallback receive function - delegates to buyMTX
     * @dev Allows users to simply send ETH to contract address
     */
    receive() external payable {
        _buyMTXInternal();
    }
    
    /**
     * @notice Internal function for buying MTX
     * @dev Shared logic for buyMTX and receive
     */
    function _buyMTXInternal() private {
        if (mintingPaused) revert MintingPaused();
        if (msg.value == 0) revert ZeroAmount();
        
        // Calculate MTX to mint
        uint256 mtxAmount = (msg.value * ethToMtxRate * 10 ** decimals()) / 1 ether;
        
        if (totalSupply() + mtxAmount > MAX_SUPPLY) revert ExceedsMaxSupply();
        
        // Mint MTX to sender
        _mint(msg.sender, mtxAmount);
        
        emit MTXPurchased(msg.sender, msg.value, mtxAmount);
    }
    
    /**
     * @notice Update the ETH to MTX exchange rate
     * @dev Only callable by contract owner
     * @param newRate The new exchange rate (1 ETH = newRate MTX)
     */
    function setEthToMtxRate(uint256 newRate) external onlyOwner {
        if (newRate == 0) revert InvalidRate();
        ethToMtxRate = newRate;
        emit RateUpdated(newRate);
    }
    
    /**
     * @notice Pause or unpause minting (e.g., to transition to DEX-only)
     * @dev Only callable by contract owner
     * @param paused True to pause minting, false to unpause
     */
    function setMintingPaused(bool paused) external onlyOwner {
        mintingPaused = paused;
        emit MintingPaused(paused);
    }
    
    /**
     * @notice Withdraw collected ETH to recipient (for liquidity provision or operations)
     * @dev Only callable by contract owner
     * @param recipient Address to receive the ETH
     */
    function withdrawETH(address payable recipient) external onlyOwner {
        if (recipient == address(0)) revert ZeroAddress();
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoETHToWithdraw();
        
        (bool success, ) = recipient.call{value: balance}("");
        if (!success) revert WithdrawalFailed();
        
        emit Withdrawal(recipient, balance);
    }

    /**
     * @notice Burn function (optional utility)
     * @dev Allows users to permanently destroy MTX
     * @param amount Amount of MTX to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
