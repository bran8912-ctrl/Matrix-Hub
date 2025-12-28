// Shared Casino Engine for Matrix-Hub
export const CasinoEngine = {
  minBet: 1,
  maxBet: 1000,

  validateBet(amount, reserveHealth) {
    if (amount < this.minBet) return "Bet too small";
    if (amount > this.maxBet) return "Bet too large";
    if (reserveHealth <= 0) return "Casino paused";
    return null;
  },

  async placeBet(gameId, betAmount, gameData, walletAddress) {
    // This would call your backend or contract
    return fetch("/api/place-bet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        betAmount,
        gameData,
        walletAddress
      })
    }).then(res => res.json());
  }
};
