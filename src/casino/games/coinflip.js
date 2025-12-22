// Coin Flip Game Logic
export function resolveCoinFlip(hash, choice) {
  const flip = parseInt(hash.slice(0, 8), 16) % 2;
  return {
    result: flip === 0 ? "heads" : "tails",
    win: (flip === 0 && choice === "heads") || (flip === 1 && choice === "tails")
  };
}
