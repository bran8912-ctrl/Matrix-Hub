// Blackjack Game Engine for Matrix-Hub Casino
export interface Card {
  suit: string;
  rank: string;
  value: number;
}

export interface BlackjackResult {
  playerHand: Card[];
  dealerHand: Card[];
  playerScore: number;
  dealerScore: number;
  outcome: 'win' | 'lose' | 'push' | 'blackjack';
  payout: number;
}

const SUITS = ['♠️', '♥️', '♦️', '♣️'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export class BlackjackEngine {
  static readonly BET_AMOUNT = 2; // 2 MTX per hand

  /**
   * Create a card from hash segment
   */
  private static createCard(hashSegment: string): Card {
    const val = parseInt(hashSegment, 16);
    const suitIdx = val % SUITS.length;
    const rankIdx = Math.floor(val / SUITS.length) % RANKS.length;
    const rank = RANKS[rankIdx];
    
    let value: number;
    if (rank === 'A') value = 11;
    else if (['J', 'Q', 'K'].includes(rank)) value = 10;
    else value = parseInt(rank);

    return {
      suit: SUITS[suitIdx],
      rank,
      value,
    };
  }

  /**
   * Calculate hand score with ace handling
   */
  private static calculateScore(hand: Card[]): number {
    let score = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(card => card.rank === 'A').length;

    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  }

  /**
   * Play a blackjack hand using provably fair hash
   */
  static playHand(hash: string): BlackjackResult {
    // Deal initial cards (player gets 2, dealer gets 2)
    const playerHand: Card[] = [
      this.createCard(hash.slice(0, 4)),
      this.createCard(hash.slice(4, 8)),
    ];
    
    const dealerHand: Card[] = [
      this.createCard(hash.slice(8, 12)),
      this.createCard(hash.slice(12, 16)),
    ];

    const playerScore = this.calculateScore(playerHand);
    let dealerScore = this.calculateScore(dealerHand);

    // Check for blackjacks
    const playerBlackjack = playerScore === 21 && playerHand.length === 2;
    const dealerBlackjack = dealerScore === 21 && dealerHand.length === 2;

    if (playerBlackjack && dealerBlackjack) {
      return {
        playerHand,
        dealerHand,
        playerScore,
        dealerScore,
        outcome: 'push',
        payout: this.BET_AMOUNT, // Return bet
      };
    }

    if (playerBlackjack) {
      return {
        playerHand,
        dealerHand,
        playerScore,
        dealerScore,
        outcome: 'blackjack',
        payout: this.BET_AMOUNT * 2.5, // 3:2 payout (1.5x winnings + original bet = 2.5x total return)
      };
    }

    // Dealer plays (simplified: dealer hits until 17+)
    let cardIndex = 16;
    while (dealerScore < 17 && cardIndex < hash.length) {
      dealerHand.push(this.createCard(hash.slice(cardIndex, cardIndex + 4)));
      dealerScore = this.calculateScore(dealerHand);
      cardIndex += 4;
    }

    // Determine outcome
    let outcome: 'win' | 'lose' | 'push';
    let payout: number;

    if (dealerScore > 21) {
      outcome = 'win';
      payout = this.BET_AMOUNT * 2;
    } else if (playerScore > dealerScore) {
      outcome = 'win';
      payout = this.BET_AMOUNT * 2;
    } else if (playerScore < dealerScore) {
      outcome = 'lose';
      payout = 0;
    } else {
      outcome = 'push';
      payout = this.BET_AMOUNT;
    }

    return {
      playerHand,
      dealerHand,
      playerScore,
      dealerScore,
      outcome,
      payout,
    };
  }

  /**
   * Validate bet amount
   */
  static validateBet(amount: number): string | null {
    if (amount !== this.BET_AMOUNT) {
      return `Blackjack requires exactly ${this.BET_AMOUNT} MTX per hand`;
    }
    return null;
  }
}
