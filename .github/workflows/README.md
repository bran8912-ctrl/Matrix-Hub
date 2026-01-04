# GitHub Actions Workflows

This directory contains automated workflows for the Matrix-Hub.org project. These workflows enable running all project scripts automatically without requiring local setup.

## Available Workflows

### 1. CI - Build and Test (`ci.yml`)

**Triggers:** Push to main/Hub10/develop branches, Pull Requests, Manual

Runs comprehensive checks on every push and PR:
- ✅ **Build Job**: Compiles the Astro site
- 📝 **Content Workflow Job**: Runs content scan, feed generation, and analytics
- 🔨 **Smart Contracts Job**: Compiles Solidity contracts with Hardhat
- 🧪 **Test Job**: Runs Hardhat tests

**Artifacts Generated:**
- `astro-build`: Compiled site in `dist/`
- `content-workflow-outputs`: Generated feeds and analytics
- `contract-artifacts`: Compiled smart contracts

### 2. Run Scripts on Demand (`run-scripts.yml`)

**Triggers:** Manual only (workflow_dispatch)

Allows you to run any project script from the GitHub Actions UI:

**Available Scripts:**
- `content:scan` - Scan all content files
- `content:generate` - Generate public JSON feed
- `content:analytics` - Generate analytics report
- `content:help` - Show content workflow help
- `build` - Build the Astro site
- `compile` - Compile smart contracts
- `test` - Run Hardhat tests

**How to Use:**
1. Go to the "Actions" tab in GitHub
2. Select "Run Scripts on Demand"
3. Click "Run workflow"
4. Choose the script you want to run
5. Optionally enable artifact uploads
6. Click "Run workflow"

### 3. Scheduled Content Updates (`scheduled-content-update.yml`)

**Triggers:** Daily at 2 AM UTC, Manual

Automatically updates content feeds and analytics daily:
- Scans all content files
- Generates public feed
- Creates analytics reports
- Uploads results as artifacts
- Creates an issue if the workflow fails

**Artifacts Generated:**
- `scheduled-content-update-{run_number}`: All generated files

### 4. Smart Contract Deployment (`deploy-contracts.yml`)

**Triggers:** Manual only (workflow_dispatch)

Guided workflow for deploying smart contracts:

**Safety Features:**
- Requires confirmation for mainnet deployments
- Validates deployment parameters
- Provides deployment checklist
- Shows security notices

**Parameters:**
- `network`: Choose between `sepolia` (testnet) or `mainnet`
- `contract`: Choose between `mtx` or `casino`
- `confirm`: Must type "DEPLOY" for mainnet deployments

**Note:** This workflow compiles contracts and provides deployment instructions. Actual deployment requires setting up secrets (see below).

### 5. Content Validation (`content-validation.yml`)

**Triggers:** Pull Requests that change content files

Automatically validates content quality on PRs:
- Scans modified content files
- Generates analytics
- Checks content health metrics
- Posts results as PR comment
- Uploads error logs

### 6. Code Quality Analysis (`code-quality.yml`)

**Triggers:** Push to Hub10 branch, Pull Requests, Manual

Runs comprehensive code quality checks without requiring external services:

**Quality Checks:**
- 🔍 **TypeScript Type Checking**: Validates types with `@astrojs/check`
- 🔎 **ESLint Analysis**: Checks JavaScript/TypeScript/Astro code quality
- 🔐 **Solidity Linting**: Validates smart contracts with Solhint
- 🔨 **Contract Compilation**: Ensures contracts compile successfully

**Features:**
- No external service dependencies (replaces SonarCloud)
- Detailed job summaries with actionable feedback
- Continues on non-critical errors to provide full feedback
- Memory-optimized for large codebases

**Note:** This workflow replaces the previous `sonarcloud.yml` workflow, eliminating the need for external service tokens and signup.

### 7. Deploy Astro Site to GitHub Pages (`astro-gh-pages.yml`)

**Triggers:** Push to Hub10 branch, Manual

Deploys the Astro site to GitHub Pages:
- Builds the site
- Uploads to GitHub Pages
- Deploys to production

_Note: The `jekyll-gh-pages.yml` workflow is a pre-existing GitHub Pages deployment pipeline and is **not** added or modified by this PR._
## Running Workflows

### From GitHub UI

1. Navigate to the "Actions" tab in the repository
2. Select the workflow you want to run
3. Click "Run workflow" button
4. Fill in any required parameters
5. Click "Run workflow" to start

### Viewing Results

1. Go to the "Actions" tab
2. Click on a workflow run
3. View the summary and logs
4. Download artifacts if available

## Setting Up Secrets for Deployment

For smart contract deployments, you need to set up repository secrets:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `PRIVATE_KEY`: Deployer wallet private key
   - `INFURA_API_KEY` or `ALCHEMY_API_KEY`: RPC provider API key
   - `ETHERSCAN_API_KEY`: For contract verification

**Security Warning:** Never commit private keys to the repository!

## Workflow Status Badges

Add these to your README to show workflow status:

```markdown
![CI](https://github.com/bran8912-ctrl/Matrix-Hub.org/actions/workflows/ci.yml/badge.svg)
![Code Quality](https://github.com/bran8912-ctrl/Matrix-Hub.org/actions/workflows/code-quality.yml/badge.svg)
![Content Validation](https://github.com/bran8912-ctrl/Matrix-Hub.org/actions/workflows/content-validation.yml/badge.svg)
![Deploy to GitHub Pages](https://github.com/bran8912-ctrl/Matrix-Hub.org/actions/workflows/jekyll-gh-pages.yml/badge.svg)
```

## Artifacts

Workflows generate artifacts that can be downloaded:

- **Build Artifacts** (7 days retention):
  - Compiled Astro site
  - Script outputs
  - Compiled smart contracts

- **Content Artifacts** (30 days retention):
  - Public feeds
  - Analytics reports
  - Error logs

To download artifacts:
1. Go to a workflow run
2. Scroll to the "Artifacts" section at the bottom
3. Click on an artifact to download

## Troubleshooting

### Workflow Failed

1. Check the workflow logs in the Actions tab
2. Look for error messages in the failed job
3. Check if dependencies need updating
4. Verify that all required secrets are set

### Script Not Running

1. Ensure the script exists in `package.json`
2. Check that dependencies are installed correctly
3. Verify Node.js version compatibility (requires Node 18+)

### Deployment Issues

1. Verify all secrets are configured correctly
2. Check network configuration in `hardhat.config.js`
3. Ensure deployer wallet has sufficient funds
4. Review Hardhat documentation for network-specific issues

## Best Practices

1. **Use workflow_dispatch** for potentially destructive operations
2. **Review logs** for all workflow runs
3. **Download artifacts** for important builds
4. **Monitor scheduled workflows** to ensure they run successfully
5. **Update workflows** when adding new scripts or changing project structure

## Contributing

When adding new scripts or workflows:

1. Add the script to `package.json`
2. Update the "Run Scripts on Demand" workflow options
3. Update this README with documentation
4. Test the workflow before merging

## Support

For issues with workflows:
- Check workflow logs in the Actions tab
- Review this README for common solutions
- Open an issue if you need help

---

**Matrix-Hub.org** - Signal Over Noise 🌟
