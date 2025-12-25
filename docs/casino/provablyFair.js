// Provably Fair Verification
import { sha256 } from 'js-sha256';

export function verifyResult({ serverSeed, clientSeed, nonce, gameData }) {
  const message = `${serverSeed}:${clientSeed}:${nonce}:${JSON.stringify(gameData)}`;
  return sha256(message);
}
