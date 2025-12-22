// Crash Game Logic
export function calculateCrashPoint(hash) {
  const h = parseInt(hash.slice(0, 13), 16);
  return Math.max(1.01, (1000000 / (h % 1000000)) / 100);
}
