// Dice Game Logic
export function resolveDice(hash, target) {
  const roll = parseInt(hash.slice(0, 8), 16) % 100;
  return {
    roll,
    win: roll < target
  };
}
