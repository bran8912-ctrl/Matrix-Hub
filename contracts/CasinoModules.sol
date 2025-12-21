// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CasinoCore.sol";

contract CasinoReserve {
    MTXToken public mtx;
    uint public reserveBalance;
    uint public reserveCap;
    address public casinoCore;

    modifier onlyCasinoCore() {
        require(msg.sender == casinoCore, "Not authorized");
        _;
    }

    constructor(address _mtx, uint _reserveCap, address _casinoCore) {
        mtx = MTXToken(_mtx);
        reserveCap = _reserveCap;
        casinoCore = _casinoCore;
    }

    function deposit(uint amount) external onlyCasinoCore {
        reserveBalance += amount;
    }

    function payWinner(address player, uint amount) external onlyCasinoCore {
        require(reserveBalance >= amount, "Insufficient reserve");
        reserveBalance -= amount;
        require(mtx.transfer(address(this), player, amount), "MTX transfer failed");
    }

    function reserveHealth() external view returns (uint) {
        return reserveBalance;
    }
}

// Liquidity Router (DEX Integration)
contract LiquidityRouter {
    MTXToken public mtx;
    address public dexPool;

    constructor(address _mtx, address _dexPool) {
        mtx = MTXToken(_mtx);
        dexPool = _dexPool;
    }

    function addLiquidity(uint amount) external {
        require(mtx.transfer(address(this), dexPool, amount), "MTX transfer failed");
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
