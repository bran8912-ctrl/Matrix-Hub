// Number Match Game Logic
export function resolveNumberMatch(hash, selected) {
  const number = (parseInt(hash.slice(0, 8), 16) % 100) + 1;
  return {
    number,
    win: number === selected
  };
}
