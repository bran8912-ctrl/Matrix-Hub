// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 2️⃣ MTX Token (Utility Only)
contract MTXToken {
    uint public totalSupply;
    mapping(address => uint) public balances;

    constructor(uint _initialSupply) {
        totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
    }

    function transfer(address from, address to, uint amount) public returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

    function balanceOf(address account) public view returns (uint) {
        return balances[account];
    }
}

// 3️⃣ Casino Core Contract
interface ILiquidityRouter {
    function addLiquidity(uint amount) external;
}

interface ICasinoReserve {
    function deposit(uint amount) external;
    function payWinner(address to, uint amount) external;
}

interface IRNGEngine {
    function resolve(bytes calldata gameData) external returns (bool);
}

contract CasinoCore {
    MTXToken public mtx;
    ILiquidityRouter public liquidity;
    ICasinoReserve public reserve;
    IRNGEngine public rng;

    uint public payoutPercent = 85;
    uint public liquidityPercent = 10;
    uint public reservePercent = 3;
    uint public devPercent = 2;

    uint public minBet;
    uint public maxBet;
    address public dev;
    address public governance;

    constructor(
        address _mtx,
        address _liquidity,
        address _reserve,
        address _rng,
        uint _minBet,
        uint _maxBet,
        address _dev,
        address _governance
    ) {
        mtx = MTXToken(_mtx);
        liquidity = ILiquidityRouter(_liquidity);
        reserve = ICasinoReserve(_reserve);
        rng = IRNGEngine(_rng);
        minBet = _minBet;
        maxBet = _maxBet;
        dev = _dev;
        governance = _governance;
    }

    modifier onlyGovernance() {
        require(msg.sender == governance, "Not governance");
        _;
    }

    function updatePercentages(
        uint payout,
        uint liquidity_,
        uint reserve_,
        uint dev_
    ) external onlyGovernance {
        require(payout + liquidity_ + reserve_ + dev_ == 100, "Sum must be 100");
        payoutPercent = payout;
        liquidityPercent = liquidity_;
        reservePercent = reserve_;
        devPercent = dev_;
    }

    function placeBet(uint amount, bytes calldata gameData) external {
        require(amount >= minBet, "Bet below minimum");
        require(amount <= maxBet, "Bet above maximum");
        require(mtx.transfer(msg.sender, address(this), amount), "Transfer failed");

        uint payoutAmount = amount * payoutPercent / 100;
        uint liquidityAmount = amount * liquidityPercent / 100;
        uint reserveAmount = amount * reservePercent / 100;
        uint devAmount = amount * devPercent / 100;

        liquidity.addLiquidity(liquidityAmount);
        reserve.deposit(reserveAmount);
        (bool sent, ) = dev.call{value: devAmount}("");
        require(sent, "Dev payment failed");

        bool win = rng.resolve(gameData);
        if (win) {
            uint winnings = calculatePayout(payoutAmount);
            reserve.payWinner(msg.sender, winnings);
        }
    }

    function calculatePayout(uint payoutAmount) internal pure returns (uint) {
        // Placeholder for game-specific payout logic
        return payoutAmount;
    }
}
