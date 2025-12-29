// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 Matrix-HubCoin (MTX)
  Utility token for the Matrix-Hub ecosystem.
   Direct ETH→MTX mint for easy onboarding.
   No taxes. Owner can pause minting.
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MatrixHubCoin is ERC20, Ownable {
    // Max supply is fixed at deployment
    uint256 public immutable MAX_SUPPLY;
    
    // Fixed exchange rate: 1 ETH = 1000 MTX (can be adjusted by owner)
    uint256 public ethToMtxRate = 1000;
    
    // Minting can be paused by owner (e.g., when transitioning to DEX-only)
    bool public mintingPaused = false;
    
    // Events
    event MTXPurchased(address indexed buyer, uint256 ethAmount, uint256 mtxAmount);
    event RateUpdated(uint256 newRate);
    event MintingPaused(bool paused);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor(uint256 initialSupply) ERC20("Matrix-HubCoin", "MTX") Ownable(msg.sender) {
        MAX_SUPPLY = initialSupply * 10 ** decimals();
        _mint(msg.sender, MAX_SUPPLY);
    }

    /*
     Direct ETH→MTX purchase function
     Users send ETH and receive MTX at the fixed rate
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
    
    /*
     Fallback receive function - automatically calls buyMTX
     Allows users to simply send ETH to contract address
    */
    receive() external payable {
        require(!mintingPaused, "Minting is paused");
        require(msg.value > 0, "Must send ETH to buy MTX");
        
        // Calculate MTX to mint
        uint256 mtxAmount = (msg.value * ethToMtxRate * 10 ** decimals()) / 1 ether;
        
        require(totalSupply() + mtxAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        // Mint MTX to sender
        _mint(msg.sender, mtxAmount);
        
        emit MTXPurchased(msg.sender, msg.value, mtxAmount);
    }
    
    /*
     Owner functions for managing the direct mint feature
    */
    
    // Update the ETH to MTX exchange rate
    function setEthToMtxRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be positive");
        ethToMtxRate = newRate;
        emit RateUpdated(newRate);
    }
    
    // Pause or unpause minting (e.g., to transition to DEX-only)
    function setMintingPaused(bool paused) external onlyOwner {
        mintingPaused = paused;
        emit MintingPaused(paused);
    }
    
    // Withdraw collected ETH to owner (for liquidity provision or operations)
    function withdrawETH(address payable recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "ETH withdrawal failed");
        
        emit Withdrawal(recipient, balance);
    }

    /*
     Burn function (optional utility)
     Allows users to permanently destroy MTX
    */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
