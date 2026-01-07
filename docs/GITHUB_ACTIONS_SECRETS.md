# GitHub Actions Secrets Configuration Guide

## Overview

Matrix-Hub.org uses GitHub Actions for automated deployments and CI/CD workflows. All sensitive configuration values (private keys, API keys, passwords, etc.) **must** be stored as GitHub Actions repository secrets, not hardcoded in files.

## Why GitHub Actions Secrets?

- **Security**: Secrets are encrypted and never exposed in logs or code
- **Centralized Management**: All sensitive values in one secure location
- **Access Control**: Only authorized workflows can access secrets
- **Audit Trail**: GitHub tracks when secrets are accessed
- **No Accidental Commits**: Eliminates risk of committing sensitive data

## Required Secrets

All workflows use the following secrets. You must configure these in your repository settings before running any deployment workflows.

### Deployment Secrets

#### `MAINNET_PRIVATE_KEY` and `TESTNET_PRIVATE_KEY`
- **Description**: Private keys for deploying smart contracts (without 0x prefix)
- **Usage**: 
  - `MAINNET_PRIVATE_KEY`: Used for mainnet contract deployments
  - `TESTNET_PRIVATE_KEY`: Used for testnet (Sepolia) contract deployments
- **How it works**: Workflows map these to the `PRIVATE_KEY` environment variable that hardhat expects
- **Security**: Use burner wallets, NEVER your main wallet
- **Format**: 64-character hexadecimal string (without 0x prefix)
- **Example**: `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`
- **Important**: Keep mainnet and testnet keys separate for security

#### `MAINNET_RPC_URL`
- **Description**: Ethereum Mainnet RPC endpoint URL
- **Usage**: Connect to Ethereum mainnet for deployments
- **Recommended**: `https://eth.llamarpc.com` or your preferred provider
- **Alternative**: Alchemy, Infura, or QuickNode RPC URLs

#### `SEPOLIA_RPC_URL`
- **Description**: Ethereum Sepolia Testnet RPC endpoint URL
- **Usage**: Connect to Sepolia testnet for testing
- **Recommended**: `https://rpc.sepolia.org/`
- **Alternative**: Any Sepolia RPC provider

#### `ETHERSCAN_API_KEY`
- **Description**: API key for verifying contracts on Etherscan
- **Usage**: Automatic contract verification after deployment
- **Get From**: https://etherscan.io/myapikey
- **Note**: Same key works for Mainnet and Sepolia

### Application Secrets

#### `MTX_CONTRACT_ADDRESS`
- **Description**: Deployed MTX token contract address
- **Usage**: Frontend configuration and casino integration
- **Set After**: MTX contract is successfully deployed to mainnet
- **Format**: Ethereum address (0x followed by 40 hex characters)

#### `SUPABASE_DATABASE_URL`
- **Description**: Supabase project URL
- **Usage**: Backend database connection
- **Get From**: https://supabase.com/dashboard → Project Settings → API
- **Format**: `https://your-project.supabase.co`

#### `SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous/public API key
- **Usage**: Client-side database queries
- **Get From**: https://supabase.com/dashboard → Project Settings → API
- **Security**: Safe to use in client-side code (row-level security applies)

#### `OWNERS_PASSWORD_HASH`
- **Description**: SHA-256 hash of the owners portal password
- **Usage**: Authenticate access to the owners portal
- **Generate**: Run `node scripts/generate-password-hash.js "your-secure-password"`
- **Format**: Must include `sha256-` prefix
- **Example**: `sha256-5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`

## How to Add Secrets

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/bran8912-ctrl/Matrix-Hub.org`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Repository Secrets

1. Click **New repository secret** button
2. Enter the secret **Name** (must match exactly, e.g., `PRIVATE_KEY`)
3. Enter the secret **Value** (the actual sensitive data)
4. Click **Add secret**

### Step 3: Verify Secret Configuration

After adding all required secrets, you should see them listed under "Repository secrets". The values will be hidden and shown as `***`.

Example list:
```
MAINNET_PRIVATE_KEY         Updated 2 days ago
TESTNET_PRIVATE_KEY         Updated 2 days ago
MAINNET_RPC_URL             Updated 2 days ago
SEPOLIA_RPC_URL             Updated 2 days ago
ETHERSCAN_API_KEY           Updated 2 days ago
MTX_CONTRACT_ADDRESS        Updated 1 day ago
SUPABASE_DATABASE_URL       Updated 3 days ago
SUPABASE_ANON_KEY          Updated 3 days ago
OWNERS_PASSWORD_HASH        Updated 3 days ago
```

## How Secrets Are Used in Workflows

GitHub Actions workflows automatically inject secrets using this syntax:

```yaml
- name: Deploy Contract
  env:
    PRIVATE_KEY: ${{ secrets.MAINNET_PRIVATE_KEY }}  # For mainnet
    # OR
    PRIVATE_KEY: ${{ secrets.TESTNET_PRIVATE_KEY }}  # For testnet
    MAINNET_RPC_URL: ${{ secrets.MAINNET_RPC_URL }}
    ETHERSCAN_API_KEY: ${{ secrets.ETHERSCAN_API_KEY }}
  run: npx hardhat run scripts/deploy_mtx.js --network mainnet
```

The workflows map `MAINNET_PRIVATE_KEY` or `TESTNET_PRIVATE_KEY` to the `PRIVATE_KEY` environment variable that Hardhat expects.

## Local Development

For local development, secrets are NOT used. Instead:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Replace the `${{ secrets.* }}` placeholders with actual values:
   ```bash
   # Before (in .env.example)
   PRIVATE_KEY=${{ secrets.PRIVATE_KEY }}
   
   # After (in your local .env)
   PRIVATE_KEY=your_actual_private_key_here
   ```

3. **NEVER commit your `.env` file!** It's protected by `.gitignore`.

## Security Best Practices

### For Private Keys
- ✅ Use a burner wallet specifically for deployments
- ✅ Fund it with only the ETH needed for deployment
- ✅ Rotate keys after deployments
- ❌ NEVER use your personal wallet private key
- ❌ NEVER commit private keys to version control

### For API Keys
- ✅ Use API keys specific to this project
- ✅ Restrict API key permissions when possible
- ✅ Monitor API key usage for anomalies
- ❌ NEVER share API keys publicly
- ❌ NEVER commit API keys to version control

### For Passwords
- ✅ Use strong, unique passwords
- ✅ Store only the SHA-256 hash, not the plain password
- ✅ Use the provided `generate-password-hash.js` script
- ❌ NEVER store plain-text passwords
- ❌ NEVER reuse passwords from other services

### For Database Credentials
- ✅ Use Supabase row-level security (RLS)
- ✅ Limit database permissions to what's needed
- ✅ Monitor database access logs
- ❌ NEVER expose the service role key in public code
- ❌ NEVER commit database credentials

## Troubleshooting

### Workflow fails with "Secret not found"
**Problem**: GitHub Actions can't find the required secret.

**Solution**: 
1. Check that the secret name matches exactly (case-sensitive)
2. Verify the secret exists in repository settings
3. Re-add the secret if necessary

### Contract deployment fails with "insufficient funds"
**Problem**: Deployer wallet doesn't have enough ETH.

**Solution**: 
1. Check the deployer address: Get it from workflow logs
2. Send ETH to that address
3. Re-run the workflow

### Etherscan verification fails
**Problem**: Invalid or missing `ETHERSCAN_API_KEY`.

**Solution**:
1. Get a valid API key from https://etherscan.io/myapikey
2. Update the `ETHERSCAN_API_KEY` secret
3. Re-run the verification step

### Owners portal login fails
**Problem**: `OWNERS_PASSWORD_HASH` doesn't match.

**Solution**:
1. Generate a new hash: `node scripts/generate-password-hash.js "your-password"`
2. Update the `OWNERS_PASSWORD_HASH` secret with the output (including `sha256-` prefix)
3. Redeploy the site

## Updating Secrets

To update an existing secret:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click on the secret name
3. Click **Update secret**
4. Enter the new value
5. Click **Update secret**

**Note**: Updating a secret doesn't automatically trigger workflows. You'll need to manually re-run any workflows that need the new value.

## Related Documentation

- [MTX Deployment Guide](./MTX_Deployment_Guide.md) - Smart contract deployment
- [Owners Portal Authentication](./OWNERS_PORTAL_AUTH.md) - Password hash generation
- [GitHub Actions Workflows](../.github/workflows/) - Workflow definitions
- [Environment Setup](../USAGE.md) - Local development setup

## Questions or Issues?

If you encounter any issues with GitHub Actions secrets:

1. Check this documentation first
2. Review the [GitHub Actions logs](../../actions) for error messages
3. Verify all secrets are correctly configured
4. Open an issue if you need help

---

**Matrix-Hub.org** - Signal Over Noise 🌟
