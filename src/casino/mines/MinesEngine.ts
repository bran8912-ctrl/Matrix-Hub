// Mines Game Engine for Matrix-Hub Casino
export interface MinesGameState {
  gridSize: number;
  numMines: number;
  revealedCells: boolean[];
  minePositions: Set<number>;
  gameOver: boolean;
  won: boolean;
  currentMultiplier: number;
}

export interface MinesResult {
  cellIndex: number;
  isMine: boolean;
  gameOver: boolean;
  won: boolean;
  currentMultiplier: number;
  payout: number;
}

export class MinesEngine {
  static readonly BET_AMOUNT = 1; // 1 MTX per game
  static readonly GRID_SIZE = 25; // 5x5 grid
  static readonly MIN_MINES = 3;
  static readonly MAX_MINES = 20;

  /**
   * Initialize a new mines game using provably fair hash
   */
  static initGame(hash: string, numMines: number): MinesGameState {
    if (numMines < this.MIN_MINES || numMines > this.MAX_MINES) {
      throw new Error(`Number of mines must be between ${this.MIN_MINES} and ${this.MAX_MINES}`);
    }

    const minePositions = new Set<number>();
    
    // Place mines using hash
    let hashIndex = 0;
    while (minePositions.size < numMines && hashIndex < hash.length - 4) {
      const position = parseInt(hash.slice(hashIndex, hashIndex + 4), 16) % this.GRID_SIZE;
      minePositions.add(position);
      hashIndex += 4;
    }

    return {
      gridSize: this.GRID_SIZE,
      numMines,
      revealedCells: new Array(this.GRID_SIZE).fill(false),
      minePositions,
      gameOver: false,
      won: false,
      currentMultiplier: 1.0,
    };
  }

  /**
   * Reveal a cell and calculate result
   */
  static revealCell(state: MinesGameState, cellIndex: number, betAmount: number): MinesResult {
    if (state.gameOver) {
      throw new Error('Game is already over');
    }

    if (state.revealedCells[cellIndex]) {
      throw new Error('Cell already revealed');
    }

    const isMine = state.minePositions.has(cellIndex);
    state.revealedCells[cellIndex] = true;

    if (isMine) {
      // Hit a mine - game over
      state.gameOver = true;
      state.won = false;
      return {
        cellIndex,
        isMine: true,
        gameOver: true,
        won: false,
        currentMultiplier: 0,
        payout: 0,
      };
    }

    // Safe cell - calculate new multiplier
    const revealedSafe = state.revealedCells.filter((revealed, i) => 
      revealed && !state.minePositions.has(i)
    ).length;

    // Calculate multiplier based on mines and revealed cells
    // More mines = higher risk = higher multiplier
    const safeCells = this.GRID_SIZE - state.numMines;
    const multiplierIncrease = 1 + (state.numMines / this.GRID_SIZE);
    state.currentMultiplier = Math.pow(multiplierIncrease, revealedSafe);

    // Check if all safe cells revealed (win condition)
    if (revealedSafe === safeCells) {
      state.gameOver = true;
      state.won = true;
    }

    return {
      cellIndex,
      isMine: false,
      gameOver: state.gameOver,
      won: state.won,
      currentMultiplier: state.currentMultiplier,
      payout: state.gameOver ? betAmount * state.currentMultiplier : 0,
    };
  }

  /**
   * Cash out with current multiplier
   */
  static cashOut(state: MinesGameState, betAmount: number): number {
    if (state.gameOver) {
      throw new Error('Game is already over');
    }
    
    state.gameOver = true;
    state.won = true;
    return betAmount * state.currentMultiplier;
  }

  /**
   * Validate bet
   */
  static validateBet(amount: number, numMines: number): string | null {
    if (amount < this.BET_AMOUNT) {
      return `Minimum bet is ${this.BET_AMOUNT} MTX`;
    }
    if (numMines < this.MIN_MINES || numMines > this.MAX_MINES) {
      return `Number of mines must be between ${this.MIN_MINES} and ${this.MAX_MINES}`;
    }
    return null;
  }
}
