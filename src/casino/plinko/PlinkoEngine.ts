// Plinko Game Engine for Matrix-Hub Casino
export interface PlinkoResult {
  path: number[]; // Left (0) or Right (1) at each peg
  finalSlot: number;
  multiplier: number;
  payout: number;
}

// Plinko multipliers for 8 rows (9 slots at bottom)
const MULTIPLIERS = [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6];

export class PlinkoEngine {
  static readonly BET_AMOUNT = 1; // 1 MTX per drop
  static readonly ROWS = 8;

  /**
   * Drop a ball through the plinko board using provably fair hash
   */
  static dropBall(hash: string, betAmount: number): PlinkoResult {
    const path: number[] = [];
    let position = 0;

    // Simulate ball bouncing through pegs
    for (let row = 0; row < this.ROWS; row++) {
      // Use hash to determine direction (0 = left, 1 = right)
      const hashSegment = hash.slice(row * 2, row * 2 + 2);
      const direction = parseInt(hashSegment, 16) % 2;
      
      path.push(direction);
      position += direction;
    }

    // Ensure position is within bounds (0 to MULTIPLIERS.length - 1)
    const finalSlot = Math.min(position, MULTIPLIERS.length - 1);
    const multiplier = MULTIPLIERS[finalSlot];
    const payout = betAmount * multiplier;

    return {
      path,
      finalSlot,
      multiplier,
      payout,
    };
  }

  /**
   * Validate bet amount
   */
  static validateBet(amount: number): string | null {
    if (amount < this.BET_AMOUNT) {
      return `Minimum bet is ${this.BET_AMOUNT} MTX`;
    }
    return null;
  }

  /**
   * Get multiplier for a specific slot
   */
  static getMultiplier(slot: number): number {
    return MULTIPLIERS[slot] || 0;
  }
}
