# Provably Fair System

Each game outcome is generated using:

hash(serverSeed + clientSeed + nonce + gameData)

## Process
1. Server commits seed [hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function)
2. Player submits client seed
3. Game resolves
4. Server reveals seed
5. Outcome is [verifiable](https://en.wikipedia.org/wiki/Provably_fair_gambling)

No manipulation after commitment.

---

**Related Documentation:**
- [Casino Games](MTX_Casino_Games.md)
- [Casino Architecture](MTX_Casino_Architecture.md)
- [Casino Game Math](MTX_Casino_Game_Math.md)

**[← Back to Documentation Index](../docs/)**
