// Slots Game Engine for Matrix-Hub Casino
export interface SlotsResult {
  reels: string[];
  win: boolean;
  payout: number;
  combination: string;
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
const PAYOUTS: Record<string, number> = {
  '7️⃣-7️⃣-7️⃣': 100,
  '💎-💎-💎': 50,
  '🍇-🍇-🍇': 20,
  '🍊-🍊-🍊': 15,
  '🍋-🍋-🍋': 10,
  '🍒-🍒-🍒': 5,
};

export class SlotsEngine {
  static readonly BET_AMOUNT = 1; // 1 MTX per spin

  /**
   * Spin the slots using a provably fair hash
   */
  static spin(hash: string): SlotsResult {
    const reels: string[] = [];
    
    // Use hash to generate 3 reel results
    for (let i = 0; i < 3; i++) {
      const index = parseInt(hash.slice(i * 8, i * 8 + 8), 16) % SYMBOLS.length;
      reels.push(SYMBOLS[index]);
    }

    const combination = reels.join('-');
    const payout = PAYOUTS[combination] || 0;
    const win = payout > 0;

    return {
      reels,
      win,
      payout,
      combination,
    };
  }

  /**
   * Calculate expected payout multiplier
   */
  static calculateMultiplier(combination: string): number {
    return PAYOUTS[combination] || 0;
  }

  /**
   * Validate bet amount
   */
  static validateBet(amount: number): string | null {
    if (amount !== this.BET_AMOUNT) {
      return `Slots requires exactly ${this.BET_AMOUNT} MTX per spin`;
    }
    return null;
  }
}
