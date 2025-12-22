# Provably Fair System

Each game outcome is generated using:

hash(serverSeed + clientSeed + nonce + gameData)

## Process
1. Server commits seed hash
2. Player submits client seed
3. Game resolves
4. Server reveals seed
5. Outcome is verifiable

No manipulation after commitment.
