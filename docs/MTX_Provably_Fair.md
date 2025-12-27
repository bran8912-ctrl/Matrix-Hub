# Provably Fair System

Outcome = [hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function)(
      serverSeed +
        clientSeed +
          nonce +
            gameData
)

Server commits hash first.
Seed revealed after play.
Anyone can [verify](https://en.wikipedia.org/wiki/Provably_fair_gambling).

---

**Related Documentation:**
- [Casino Provably Fair Details](MTX_Casino_Provably_Fair.md)
- [Casino Games](MTX_Casino_Games.md)
- [Casino Architecture](MTX_Casino_Architecture.md)

**[← Back to Documentation Index](../docs/)**
