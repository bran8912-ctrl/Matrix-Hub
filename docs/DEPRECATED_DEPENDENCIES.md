# Deprecated Transitive Dependencies Report

This document tracks deprecated npm packages that are used transitively by dependencies in Matrix Hub. These packages cannot be directly patched as they are not direct dependencies of the project.

## Generated: 2026-01-08

## Deprecated Packages

### 1. inflight@1.0.6

**Status**: Deprecated - memory leak, not supported  
**Alternative**: Use `lru-cache` or modern alternatives  
**Impact**: Low - used internally by glob for file system operations

**Parent Packages**:
```
astro-supabase-starter@0.0.1
├─┬ hardhat@2.28.0
│ └─┬ mocha@10.8.2
│   └─┬ glob@8.1.0
│     └── inflight@1.0.6 deduped
├─┬ solhint@6.0.2
│ └─┬ glob@8.1.0
│   └── inflight@1.0.6
├─┬ solidity-coverage@0.8.17
│ ├─┬ globby@10.0.2
│ │ └─┬ glob@7.2.3
│ │   └── inflight@1.0.6 deduped
│ ├─┬ sc-istanbul@0.4.6
│ │ └─┬ glob@5.0.15
│ │   └── inflight@1.0.6 deduped
│ └─┬ shelljs@0.8.5
│   └─┬ glob@7.2.3
│     └── inflight@1.0.6 deduped
└─┬ typechain@8.3.2
  └─┬ glob@7.1.7
    └── inflight@1.0.6 deduped
```

**Resolution Path**:
1. Update `hardhat` to a version using glob@9+ (when available)
2. Update `solhint` to a version using glob@9+ or alternatives
3. Update `solidity-coverage` to a version using modern file APIs
4. Update `typechain` to a version using glob@9+ or fast-glob

### 2. lodash.isequal@4.5.0

**Status**: Deprecated  
**Alternative**: Use `require('node:util').isDeepStrictEqual` (Node.js built-in)  
**Impact**: Low - used for deep equality checks

**Parent Package**:
```
astro-supabase-starter@0.0.1
└─┬ @nomicfoundation/hardhat-ethers@3.1.3
  └── lodash.isequal@4.5.0
```

**Resolution Path**:
- Update `@nomicfoundation/hardhat-ethers` to version 4.x+ (when available)
- Monitor Hardhat ecosystem updates for removal of lodash dependencies

### 3. glob (versions 5.x, 7.x, 8.x)

**Status**: Versions prior to v9 are no longer supported  
**Alternative**: glob@10+ or fast-glob  
**Impact**: Medium - multiple packages rely on old glob versions

**Parent Packages**:
```
astro-supabase-starter@0.0.1
├─┬ hardhat-gas-reporter@2.3.0
│ └── glob@10.5.0  ✓ (using modern version)
├─┬ hardhat@2.28.0
│ └─┬ mocha@10.8.2
│   └── glob@8.1.0  ✗
├─┬ solhint@6.0.2
│ └── glob@8.1.0  ✗
├─┬ solidity-coverage@0.8.17
│ ├─┬ globby@10.0.2
│ │ └── glob@7.2.3  ✗
│ ├─┬ sc-istanbul@0.4.6
│ │ └── glob@5.0.15  ✗
│ └─┬ shelljs@0.8.5
│   └── glob@7.2.3  ✗
└─┬ typechain@8.3.2
  └── glob@7.1.7  ✗
```

**Resolution Path**:
1. Update `hardhat` (waiting for mocha update)
2. Update `solhint` to latest version
3. Update `solidity-coverage` to version using modern glob or fast-glob
4. Update `typechain` to latest version

## Maintenance Recommendations

### Short-term (Next PR)
- Monitor npm audit output for new deprecation warnings
- Check for available updates to parent packages

### Medium-term (Next Quarter)
- Evaluate alternative packages for:
  - `hardhat` ecosystem packages
  - Development/testing tools
- Create GitHub issues to track each deprecated dependency separately

### Long-term (Next Year)
- Consider migrating to alternative development frameworks if updates aren't available
- Evaluate newer blockchain development toolchains (e.g., Foundry, Hardhat v3+)

## How to Check Status

Run the following command to see current dependency tree:

```bash
npm ls inflight lodash.isequal glob
```

## Update History

- **2026-01-08**: Initial report created during web3modal v3 migration
  - Documented inflight, lodash.isequal, and glob deprecations
  - Identified parent packages and resolution paths

## References

- [npm deprecation policy](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions)
- [glob v9+ migration guide](https://github.com/isaacs/node-glob#readme)
- [Hardhat GitHub - Dependency Updates](https://github.com/NomicFoundation/hardhat/issues)
