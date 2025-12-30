// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 Matrix-HubCoin (MTX)
  Utility token for the Matrix-Hub ecosystem on Ethereum Mainnet.
  Direct ETH→MTX mint for easy onboarding.
  No transfer taxes. Owner can adjust ETH→MTX rate, pause/unpause minting, and withdraw collected ETH.
  
  Network: Ethereum Mainnet (Chain ID: 1)
  Token Standard: ERC-20
  Initial Owner: 0x58e7893356002ac8f8f612f7b3d29d8b181d85b3
  
  Audit Trail: Standard OpenZeppelin ERC20 implementation with owner-controlled minting and ETH management
  Security: Auditable, transparent, and follows best practices. Not trustless: relies on owner to manage minting parameters and withdrawals.
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MatrixHubCoin is ERC20, Ownable {
    // Max supply is fixed at deployment
    uint256 public immutable MAX_SUPPLY;
    
    // Fixed exchange rate: 1 ETH = 100,000 MTX (can be adjusted by owner)
    uint256 public ethToMtxRate = 100000;
    
    // Minting can be paused by owner (e.g., when transitioning to DEX-only)
    bool public mintingPaused = false;
    
    // Events
    event MTXPurchased(address indexed buyer, uint256 ethAmount, uint256 mtxAmount);
    event RateUpdated(uint256 newRate);
    event MintingPaused(bool paused);
    event Withdrawal(address indexed recipient, uint256 amount);

    /**
     * @dev Constructor sets the initial owner and mints the total supply to owner
     * @param initialSupply The initial supply in whole tokens (e.g., 100000000 for 100M MTX)
     * @param initialOwner The address that will own the contract and receive initial supply
     */
    constructor(uint256 initialSupply, address initialOwner) ERC20("Matrix-HubCoin", "MTX") Ownable(initialOwner) {
        require(initialOwner != address(0), "Owner cannot be zero address");
        require(initialSupply > 0, "Initial supply must be greater than zero");
        MAX_SUPPLY = initialSupply * 10 ** decimals();
        _mint(initialOwner, MAX_SUPPLY);
    }

    /**
     * @dev Direct ETH→MTX purchase function
     * Users send ETH and receive MTX at the fixed rate
     * Network: Ethereum Mainnet
     */
    function buyMTX() external payable {
        require(!mintingPaused, "Minting is paused");
        require(msg.value > 0, "Must send ETH to buy MTX");
        
        // Calculate MTX to mint based on ETH sent and current rate
        uint256 mtxAmount = (msg.value * ethToMtxRate * 10 ** decimals()) / 1 ether;
        
        require(totalSupply() + mtxAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        // Mint MTX to buyer
        _mint(msg.sender, mtxAmount);
        
        emit MTXPurchased(msg.sender, msg.value, mtxAmount);
    }
    
    /**
     * @dev Fallback receive function - forwards to buyMTX
     * Allows users to simply send ETH to contract address to buy MTX
     */
    receive() external payable {
        buyMTX();
    }
    
    /**
     * @dev Owner functions for managing the direct mint feature
     */
    
    /**
     * @dev Update the ETH to MTX exchange rate
     * @param newRate The new exchange rate (1 ETH = newRate MTX)
     */
    function setEthToMtxRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be positive");
        ethToMtxRate = newRate;
        emit RateUpdated(newRate);
    }
    
    /**
     * @dev Pause or unpause minting (e.g., to transition to DEX-only)
     * @param paused True to pause minting, false to unpause
     */
    function setMintingPaused(bool paused) external onlyOwner {
        mintingPaused = paused;
        emit MintingPaused(paused);
    }
    
    /**
     * @dev Withdraw collected ETH to recipient (for liquidity provision or operations)
     * @param recipient Address to receive the ETH
     */
    function withdrawETH(address payable recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "ETH withdrawal failed");
        
        emit Withdrawal(recipient, balance);
    }

    /**
     * @dev Burn function (optional utility)
     * Allows users to permanently destroy MTX
     * @param amount Amount of MTX to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
