// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// MTX Coin integration for user-based casino
// Uses MTXToken contract from CasinoCore.sol
// All casino modules interact with MTXToken for user balances and payouts
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    constructor(address _mtx, uint _reserveCap, address _casinoCore) {
        mtx = IERC20(_mtx); // Deployed MatrixHubCoin: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
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

// Liquidity Router (DEX Integration)
// Allows adding MTX coin liquidity to DEX pools
contract LiquidityRouter {
    IERC20 public mtx;
    address public dexPool;

    constructor(address _mtx, address _dexPool) {
        mtx = IERC20(_mtx); // Deployed MatrixHubCoin: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
        dexPool = _dexPool;
    }

    function addLiquidity(uint amount) external {
        // User must approve this contract to spend 'amount' MTX before calling
        require(mtx.transferFrom(msg.sender, dexPool, amount), "MTX transferFrom failed");
    }
}

// Provably Fair RNG Engine
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
