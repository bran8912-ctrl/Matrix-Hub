# Library Dependencies

This directory contains external library code integrated into the Matrix-Hub.org project.

## OpenZeppelin Contracts

**Version**: 5.5.0  
**Source**: https://github.com/OpenZeppelin/openzeppelin-contracts  
**License**: MIT

OpenZeppelin Contracts is a library for secure smart contract development. It provides implementations of standards like ERC20 and ERC721, and flexible role-based permissioning schemes.

### Usage in Matrix-Hub

The MatrixHubCoin (MTX) ERC20 token contract imports OpenZeppelin contracts for:
- `ERC20`: Standard ERC20 token implementation
- `Ownable`: Ownership management and access control

### Integration Approach

Matrix-Hub uses a dual approach for OpenZeppelin contracts:

1. **NPM Package** (Primary): Installed via `npm` as `@openzeppelin/contracts@5.4.0`
   - Used by Hardhat compilation via import statements in Solidity contracts
   - Automatically resolved during contract compilation
   - Example: `import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";`

2. **Library Directory** (Reference): Complete source code in `lib/openzeppelin-contracts/`
   - Version 5.5.0 (newer than npm package)
   - Provides reference implementation and documentation
   - Useful for auditing, understanding internals, and offline development
   - Not directly used by Hardhat (uses npm package instead)

### Why Both?

- **NPM Package**: Required for Hardhat compilation and build process
- **Library Source**: Provides transparency, audit capability, and educational reference
- This approach follows best practices for production smart contract development

### Updating OpenZeppelin

To update the OpenZeppelin contracts:

1. **Update NPM package**: `npm install @openzeppelin/contracts@latest`
2. **Update library source**: Download latest release and extract to `lib/openzeppelin-contracts/`
3. **Test thoroughly**: Recompile and test all contracts after updates
4. **Verify compatibility**: Check that contract imports still work correctly

### Contract References

Matrix-Hub contracts using OpenZeppelin:
- `contracts/MatrixHubCoin.sol` - ERC20, Ownable
- `contracts/CasinoCore.sol` - IERC20, Ownable, ReentrancyGuard
- `contracts/CasinoReserve.sol` - IERC20, Ownable

### Security Notes

- OpenZeppelin contracts are industry-standard and heavily audited
- Always use specific versions (no floating versions) for production
- Review OpenZeppelin security advisories before deploying
- Test contract interactions thoroughly with the specific OpenZeppelin version used

### Documentation

- OpenZeppelin Docs: https://docs.openzeppelin.com/contracts/
- API Reference: https://docs.openzeppelin.com/contracts/5.x/api/token/erc20
- Security: https://docs.openzeppelin.com/contracts/5.x/security
