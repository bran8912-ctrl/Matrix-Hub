# Migration from SonarCloud to Self-Hosted Code Quality

## Overview

The Matrix-Hub.org project has migrated from SonarCloud to a self-hosted code quality solution that doesn't require external service signup or API tokens.

## What Changed

### Before (SonarCloud)
- Required SonarCloud account signup
- Needed SONAR_TOKEN secret configuration
- Required project key and organization setup
- External service dependency

### After (Self-Hosted)
- **ESLint**: Analyzes JavaScript, TypeScript, React, and Astro files
- **Solhint**: Lints Solidity smart contracts
- **@astrojs/check**: TypeScript type checking
- **No external dependencies**: All tools run locally or in CI

## New Workflow

The new `code-quality.yml` workflow runs:

1. **TypeScript Type Checking** - Validates types across the project
2. **ESLint Analysis** - Checks code quality and best practices
3. **Solidity Linting** - Validates smart contract code
4. **Smart Contract Compilation** - Ensures contracts compile

## Local Development

Run these commands locally to check your code before pushing:

```bash
# Check all JavaScript/TypeScript/Astro files
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Check Solidity contracts
npm run lint:contracts

# TypeScript type checking
npm run typecheck
```

## Configuration Files

- `eslint.config.js` - ESLint configuration (flat config format)
- `.solhint.json` - Solhint rules for Solidity
- `tsconfig.json` - TypeScript compiler options

## Re-enabling SonarCloud (Optional)

If you want to re-enable SonarCloud in the future:

1. Rename `.github/workflows/sonarcloud.yml.disabled` to `sonarcloud.yml`
2. Configure the `SONAR_TOKEN` secret in GitHub
3. Update the project key and organization in the workflow file
4. You can run both workflows side-by-side if desired

## Benefits

✅ No external service signup required  
✅ Faster feedback (runs locally)  
✅ No API rate limits  
✅ Complete control over rules  
✅ Better integration with existing tools  
✅ Reduced dependencies  

## Questions?

Check the workflow documentation in `.github/workflows/README.md` for more details.
