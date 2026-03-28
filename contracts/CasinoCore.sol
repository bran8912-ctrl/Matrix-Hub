// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CasinoCore - Matrix Hub Casino Core Contract
 * @dev Casino management contract for Polygon
 * @notice Uses MTX (ERC-20) token for all casino operations
 * 
 * Network: Polygon (Chain ID: 137)
 * Currency: MATIC
 * Token: MTX (Matrix Hub Coin)
 */

// Use OpenZeppelin IERC20 interface for MatrixHubCoin (MTX)
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ILiquidityRouter
 * @author Matrix-Hub Team
 * @notice Interface for liquidity management
 */
interface ILiquidityRouter {
    /**
     * @notice Add liquidity to the pool
     * @param amount Amount of MTX to add to liquidity
     */
    function addLiquidity(uint256 amount) external;
}

/**
 * @title ICasinoReserve
 * @author Matrix-Hub Team
 * @notice Interface for casino reserve management
 */
interface ICasinoReserve {
    /**
     * @notice Deposit MTX into the reserve
     * @param amount Amount of MTX to deposit
     */
    function deposit(uint256 amount) external;
    
    /**
     * @notice Pay a winner from the reserve
     * @param to Address of the winner
     * @param amount Amount of MTX to pay
     */
    function payWinner(address to, uint256 amount) external;
}

/**
 * @title IRNGEngine
 * @author Matrix-Hub Team
 * @notice Interface for random number generation
 */
interface IRNGEngine {
    /**
     * @notice Resolve game outcome based on game data
     * @param gameData Encoded game data
     * @return True if player wins, false otherwise
     */
    function resolve(bytes calldata gameData) external returns (bool);
}

/**
 * @title CasinoCore
 * @author Matrix-Hub Team
 * @notice Main casino contract managing bets, payouts, and game logic on Polygon
 * @dev Uses MTX token for all operations and integrates with external modules
 */
contract CasinoCore {
    // Custom errors for gas efficiency
    error NotGovernance();
    error BetBelowMinimum();
    error BetAboveMaximum();
    error TransferFailed();
    error InvalidPercentageSum();
    error DevPaymentFailed();

    /// @notice Emitted when a bet is placed
    /// @param player Address of the player
    /// @param amount Bet amount in MTX
    /// @param gameData Encoded game data
    event BetPlaced(address indexed player, uint256 indexed amount, bytes gameData);

    /// @notice Emitted when a bet is resolved
    /// @param player Address of the player
    /// @param amount Original bet amount in MTX
    /// @param win True if player won, false otherwise
    /// @param payout Payout amount (0 if loss)
    event BetResolved(address indexed player, uint256 indexed amount, bool win, uint256 payout);

    /// @notice MTX token contract
    IERC20 public mtx;
    
    /// @notice Liquidity router contract
    ILiquidityRouter public liquidity;
    
    /// @notice Casino reserve contract
    ICasinoReserve public reserve;
    
    /// @notice Random number generator contract
    IRNGEngine public rng;

    /// @notice Percentage allocated to payouts
    uint256 public payoutPercent = 85;
    
    /// @notice Percentage allocated to liquidity
    uint256 public liquidityPercent = 10;
    
    /// @notice Percentage allocated to reserve
    uint256 public reservePercent = 3;
    
    /// @notice Percentage allocated to dev
    uint256 public devPercent = 2;

    /// @notice Minimum bet amount
    uint256 public minBet;
    
    /// @notice Maximum bet amount
    uint256 public maxBet;
    
    /// @notice Developer address
    address public dev;
    
    /// @notice Governance address
    address public governance;

    /**
     * @notice Constructor initializes casino with required contract addresses
     * @dev Sets up all contract integrations and parameters
     * @param _mtx Address of deployed MatrixHubCoin (MTX) ERC-20 contract on Polygon
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
        uint256 _minBet,
        uint256 _maxBet,
        address _dev,
        address _governance
    ) {
        mtx = IERC20(_mtx); // MTX Token on Polygon - deploy MatrixHubCoin first, then pass address here
        liquidity = ILiquidityRouter(_liquidity);
        reserve = ICasinoReserve(_reserve);
        rng = IRNGEngine(_rng);
        minBet = _minBet;
        maxBet = _maxBet;
        dev = _dev;
        governance = _governance;
    }

    /**
     * @notice Modifier to restrict access to governance only
     */
    modifier onlyGovernance() {
        if (msg.sender != governance) revert NotGovernance();
        _;
    }

    /**
     * @notice Update percentage allocations
     * @dev Only callable by governance, percentages must sum to 100
     * @param payout Percentage allocated to payouts
     * @param liquidity_ Percentage allocated to liquidity
     * @param reserve_ Percentage allocated to reserve
     * @param dev_ Percentage allocated to dev
     */
    function updatePercentages(
        uint256 payout,
        uint256 liquidity_,
        uint256 reserve_,
        uint256 dev_
    ) external onlyGovernance {
        if (payout + liquidity_ + reserve_ + dev_ != 100) revert InvalidPercentageSum();
        payoutPercent = payout;
        liquidityPercent = liquidity_;
        reservePercent = reserve_;
        devPercent = dev_;
    }

    /**
     * @notice Place a bet in the casino
     * @dev User must approve CasinoCore for MTX spend before calling
     * @param amount Bet amount in MTX
     * @param gameData Encoded game data for RNG
     */
    function placeBet(uint256 amount, bytes calldata gameData) external {
        if (amount < minBet) revert BetBelowMinimum();
        if (amount > maxBet) revert BetAboveMaximum();
        
        // User must approve CasinoCore for MTX spend
        if (!mtx.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        emit BetPlaced(msg.sender, amount, gameData);

        uint256 payoutAmount = amount * payoutPercent / 100;
        uint256 liquidityAmount = amount * liquidityPercent / 100;
        uint256 reserveAmount = amount * reservePercent / 100;
        uint256 devAmount = amount * devPercent / 100;

        liquidity.addLiquidity(liquidityAmount);
        reserve.deposit(reserveAmount);
        // Dev payment in MTX (optional)
        if (devAmount > 0) {
            if (!mtx.transfer(dev, devAmount)) revert DevPaymentFailed();
        }

        bool win = rng.resolve(gameData);
        uint256 payout = 0;
        if (win) {
            payout = calculatePayout(payoutAmount);
            reserve.payWinner(msg.sender, payout);
        }

        emit BetResolved(msg.sender, amount, win, payout);
    }

    /**
     * @notice Calculate payout based on game type
     * @dev Internal function for payout calculation
     * @param payoutAmount Base payout amount
     * @return Calculated winnings
     */
    function calculatePayout(uint256 payoutAmount) internal pure returns (uint256) {
        // Placeholder for game-specific payout logic
        return payoutAmount;
    }
}
