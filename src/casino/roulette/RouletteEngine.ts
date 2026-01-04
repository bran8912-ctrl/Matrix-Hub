// Roulette Game Engine for Matrix-Hub Casino
export type BetType = 
  | 'number' // Straight up (35:1)
  | 'red' // Red/Black (1:1)
  | 'black'
  | 'even' // Even/Odd (1:1)
  | 'odd'
  | 'low' // 1-18 / 19-36 (1:1)
  | 'high';

export interface RouletteBet {
  type: BetType;
  value?: number; // For specific number bets
  amount: number;
}

export interface RouletteResult {
  number: number;
  color: 'red' | 'black' | 'green';
  win: boolean;
  payout: number;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Note: BLACK_NUMBERS is defined but not used in current implementation
// const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export class RouletteEngine {
  static readonly MIN_BET = 1; // 1 MTX minimum

  /**
   * Determine color of a number
   */
  private static getColor(num: number): 'red' | 'black' | 'green' {
    if (num === 0) return 'green';
    if (RED_NUMBERS.includes(num)) return 'red';
    return 'black';
  }

  /**
   * Spin the roulette wheel using provably fair hash
   */
  static spin(hash: string, bet: RouletteBet): RouletteResult {
    // Generate number from 0-36 using hash
    const number = parseInt(hash.slice(0, 8), 16) % 37;
    const color = this.getColor(number);

    let win = false;
    let payout = 0;

    // Check if bet wins
    switch (bet.type) {
      case 'number':
        if (bet.value === number) {
          win = true;
          payout = bet.amount * 36; // 35:1 odds (35x winnings) + original bet = 36x total return
        }
        break;
      case 'red':
        if (color === 'red') {
          win = true;
          payout = bet.amount * 2; // 1:1 odds (1x winnings) + original bet = 2x total return
        }
        break;
      case 'black':
        if (color === 'black') {
          win = true;
          payout = bet.amount * 2; // 1:1 odds + original bet = 2x total return
        }
        break;
      case 'even':
        if (number !== 0 && number % 2 === 0) {
          win = true;
          payout = bet.amount * 2;
        }
        break;
      case 'odd':
        if (number !== 0 && number % 2 === 1) {
          win = true;
          payout = bet.amount * 2;
        }
        break;
      case 'low':
        if (number >= 1 && number <= 18) {
          win = true;
          payout = bet.amount * 2;
        }
        break;
      case 'high':
        if (number >= 19 && number <= 36) {
          win = true;
          payout = bet.amount * 2;
        }
        break;
    }

    return {
      number,
      color,
      win,
      payout,
    };
  }

  /**
   * Validate bet
   */
  static validateBet(bet: RouletteBet): string | null {
    if (bet.amount < this.MIN_BET) {
      return `Minimum bet is ${this.MIN_BET} MTX`;
    }
    if (bet.type === 'number' && (bet.value === undefined || bet.value < 0 || bet.value > 36)) {
      return 'Invalid number. Choose 0-36';
    }
    return null;
  }
}
