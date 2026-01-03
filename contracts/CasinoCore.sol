// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CasinoCore - Matrix Hub Casino Core Contract
 * @dev Casino management contract for Ethereum Mainnet
 * @notice Uses MTX (ERC-20) token for all casino operations
 * 
 * Network: Ethereum Mainnet (Chain ID: 1)
 * Currency: ETH
 * Token: MTX (Matrix Hub Coin)
 */

// Use OpenZeppelin IERC20 interface for MatrixHubCoin (MTX)
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Interfaces for casino modules
 */
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

/**
 * @title CasinoCore
 * @dev Main casino contract managing bets, payouts, and game logic on Ethereum
 */
contract CasinoCore {
    IERC20 public mtx;
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

    /**
     * @dev Constructor initializes casino with required contract addresses
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Ethereum
     * @param _liquidity Address of LiquidityRouter contract
     * @param _reserve Address of CasinoReserve contract
     * @param _rng Address of RNGEngine contract
     * @param _minBet Minimum bet amount in MTX (with 18 decimals)
     * @param _maxBet Maximum bet amount in MTX (with 18 decimals)
     * @param _dev Developer address for fee collection
     * @param _governance Governance address for parameter updates
     */
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
        mtx = IERC20(_mtx); // MTX Token on Ethereum - deploy MatrixHubCoin first, then pass address here
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
        // User must approve CasinoCore for MTX spend
        require(mtx.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint payoutAmount = amount * payoutPercent / 100;
        uint liquidityAmount = amount * liquidityPercent / 100;
        uint reserveAmount = amount * reservePercent / 100;
        uint devAmount = amount * devPercent / 100;

        liquidity.addLiquidity(liquidityAmount);
        reserve.deposit(reserveAmount);
        // Dev payment in MTX (optional)
        if (devAmount > 0) {
            require(mtx.transfer(dev, devAmount), "Dev payment failed");
        }

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
