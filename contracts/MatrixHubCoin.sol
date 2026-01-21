// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 Matrix-HubCoin (MTX)
  Utility token for the Matrix-Hub ecosystem on Polygon.
  Direct MATIC→MTX mint for easy onboarding.
  No taxes. Owner can pause minting.
  
  Network: Polygon Mainnet (Chain ID: 137)
  Token Standard: ERC-20
  Initial Owner: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
  
  Audit Trail: Standard OpenZeppelin ERC20 implementation with owner-controlled minting
  Security: Auditable, transparent, and follows best practices
*/

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MatrixHubCoin
 * @author Matrix-Hub Team
 * @notice ERC-20 utility token for the Matrix-Hub ecosystem on Polygon
 * @dev Implements direct MATIC→MTX minting with owner-controlled parameters
 */
contract MatrixHubCoin is ERC20, Ownable {
    // Custom errors for gas efficiency
    error ZeroAddress();
    error ZeroAmount();
    error MintingIsPaused();
    error ExceedsMaxSupply();
    error InvalidRate();
    error WithdrawalFailed();
    error NoMATICToWithdraw();
    /// @notice Maximum supply fixed at deployment
    uint256 public immutable MAX_SUPPLY;
    
    /// @notice Fixed exchange rate: 1 MATIC = maticToMtxRate MTX (can be adjusted by owner)
    uint256 public maticToMtxRate = 1000;
    
    /// @notice Minting can be paused by owner (e.g., when transitioning to DEX-only)
    bool public mintingPaused = false;
    
    /// @notice Emitted when MTX is purchased with MATIC
    /// @param buyer Address of the buyer
    /// @param maticAmount Amount of MATIC spent
    /// @param mtxAmount Amount of MTX received
    event MTXPurchased(address indexed buyer, uint256 indexed maticAmount, uint256 indexed mtxAmount);
    
    /// @notice Emitted when the exchange rate is updated
    /// @param newRate New exchange rate
    event RateUpdated(uint256 indexed newRate);
    
    /// @notice Emitted when minting is paused or unpaused
    /// @param paused True if minting is paused, false otherwise
    event MintingPaused(bool indexed paused);
    
    /// @notice Emitted when MATIC is withdrawn from the contract
    /// @param recipient Address receiving the MATIC
    /// @param amount Amount of MATIC withdrawn
    event Withdrawal(address indexed recipient, uint256 indexed amount);

    /**
     * @notice Constructor sets the initial owner and maximum supply cap
     * @dev Initializes ERC20 with name "Matrix-HubCoin" and symbol "MTX"
     * @dev NO initial minting - tokens distributed gradually through buyMTX() function
     * @param maxSupply The maximum supply cap in whole tokens (e.g., 100000000 for 100M MTX)
     * @param initialOwner The address that will own the contract
     */
    constructor(uint256 maxSupply, address initialOwner) ERC20("Matrix-HubCoin", "MTX") Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        if (maxSupply == 0) revert ZeroAmount();
        MAX_SUPPLY = maxSupply * 10 ** decimals();
        // NO initial minting - supply distributed through buyMTX() purchases
    }

    /**
     * @notice Direct MATIC→MTX purchase function
     * @dev Users send MATIC and receive MTX at the fixed rate
     */
    function buyMTX() external payable {
        _buyMTXInternal();
    }
    
    /**
     * @notice Fallback receive function - delegates to buyMTX
     * @dev Allows users to simply send MATIC to contract address
     */
    receive() external payable {
        _buyMTXInternal();
    }
    
    /**
     * @notice Internal function for buying MTX
     * @dev Shared logic for buyMTX and receive
     */
    function _buyMTXInternal() private {
        if (mintingPaused) revert MintingIsPaused();
        if (msg.value == 0) revert ZeroAmount();
        
        // Calculate MTX to mint
        uint256 mtxAmount = (msg.value * maticToMtxRate * 10 ** decimals()) / 1 ether;
        
        if (totalSupply() + mtxAmount > MAX_SUPPLY) revert ExceedsMaxSupply();
        
        // Mint MTX to sender
        _mint(msg.sender, mtxAmount);
        
        emit MTXPurchased(msg.sender, msg.value, mtxAmount);
    }
    
    /**
     * @notice Update the MATIC to MTX exchange rate
     * @dev Only callable by contract owner
     * @param newRate The new exchange rate (1 MATIC = newRate MTX)
     */
    function setMaticToMtxRate(uint256 newRate) external onlyOwner {
        if (newRate == 0) revert InvalidRate();
        maticToMtxRate = newRate;
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
     * @notice Withdraw collected MATIC to recipient (for liquidity provision or operations)
     * @dev Only callable by contract owner
     * @param recipient Address to receive the MATIC
     */
    function withdrawMATIC(address payable recipient) external onlyOwner {
        if (recipient == address(0)) revert ZeroAddress();
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoMATICToWithdraw();
        
        (bool success, ) = recipient.call{value: balance}("");
        if (!success) revert WithdrawalFailed();
        
        emit Withdrawal(recipient, balance);
    }

    /**
     * @notice Owner-controlled mint for ecosystem contracts (Casino, Reserve, Liquidity)
     * @dev Only callable by contract owner, respects MAX_SUPPLY cap
     * @dev Use this to allocate MTX to Casino, CasinoReserve, and other ecosystem contracts
     * @param to Address to receive the minted MTX (typically a contract)
     * @param amount Amount of MTX to mint
     */
    function mintToEcosystem(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (totalSupply() + amount > MAX_SUPPLY) revert ExceedsMaxSupply();
        
        _mint(to, amount);
        emit MTXPurchased(to, 0, amount); // Use 0 MATIC to indicate owner mint
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
