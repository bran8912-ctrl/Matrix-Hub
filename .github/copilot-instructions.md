# Copilot Instructions for Matrix-Hub.org

## Project Overview

Matrix-Hub.org is a live blockchain-powered platform combining web tools, casino games, and a token economy. It features:

- **MTX Token System**: A utility token for accessing premium features, playing casino games, and rewarding contributors
- **Casino Games**: Slots, Blackjack, and Roulette with on-chain MTX transactions
- **Web3 Integration**: Wallet connectivity for MTX balance checking and permissioned access
- **Modular Architecture**: Expandable tools and modules ecosystem
- **GitHub-to-MTX Loop**: Contributors earn MTX for merged PRs and accepted issues

## Tech Stack

- **Frontend Framework**: Astro 5.x with React 19.x components
- **Styling**: TailwindCSS 4.x
- **Language**: TypeScript with strict mode enabled
- **Blockchain**: Ethereum with ethers.js v6.x and web3modal
- **Smart Contracts**: Solidity 0.8.20 with Hardhat
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite 7.x
- **Output**: Static site generation

## Project Structure

```
/
├── src/
│   ├── pages/          # Astro pages (index.astro, API routes)
│   ├── components/     # UI components (.astro and .tsx files)
│   ├── casino/         # Casino game logic and modules
│   ├── utils/          # Utility functions (database.ts, etc.)
│   └── styles/         # Global styles
├── contracts/          # Solidity smart contracts
│   ├── MatrixHubCoin.sol
│   ├── CasinoCore.sol
│   └── CasinoModules.sol
├── docs/               # Documentation (tokenomics, casino math, whitepaper)
├── public/             # Static assets
└── supabase/           # Database migrations and seeds
```

## Coding Conventions

### TypeScript/JavaScript

- **TypeScript Config**: Extends `astro/tsconfigs/strict`
- **JSX**: Use `react-jsx` transform for React components
- **File Extensions**: 
  - `.astro` for Astro components
  - `.tsx` for React components
  - `.ts` for TypeScript utilities
- **Import Style**: Use ES modules
- **Type Safety**: Leverage TypeScript strict mode; always provide types

### Component Patterns

- **Astro Components**: Use for static content and page layouts
- **React Components**: Use for interactive features (wallet connection, games)
- **Layout**: Use `Layout.astro` as the base layout component with consistent header/footer
- **Styling**: Use TailwindCSS utility classes; avoid inline styles

### Smart Contracts

- **Solidity Version**: 0.8.20
- **Framework**: Hardhat with OpenZeppelin contracts
- **Location**: All contracts in `/contracts` directory
- **Testing**: Use Hardhat testing framework with Chai matchers
- **Security**: Follow OpenZeppelin security patterns

## MTX Token System

### Core Principles

1. **No MTX Required for Basic Access**: Free tier includes core tools and public modules
2. **Balance-Based Permissions**: MTX amount determines feature tiers, not pay-per-use
3. **Non-Custodial**: Site reads wallet balance but never holds MTX
4. **Transparent Gates**: Always show users what MTX unlocks
5. **Earn Paths**: Users can earn MTX through activity, contributions, and gameplay

### Access Tiers

- **Basic (Free)**: Core tools, public modules, community features
- **MTX Unlocked**: Advanced tools, priority queues, experimental modules, beta features

### MTX Flow

- **Acquisition**: DEX purchase or platform earning
- **Usage**: Unlock features, play casino games, stake for tiers
- **Circulation**: Burn/lock mechanisms reduce supply; reward pools incentivize contributors

## Casino Module

### Games Available

- **Slots**: 1 MTX per spin, win MTX on combinations
- **Blackjack**: 2 MTX per hand, win MTX for winning hands
- **Roulette**: Minimum 1 MTX bet, win MTX on correct outcomes

### Implementation

- Located in `src/casino/` and `src/pages/games/casino/`
- All transactions are on-chain and transparent
- Smart contracts in `contracts/CasinoCore.sol` and `contracts/CasinoModules.sol`
- Provably fair mechanics (see `docs/MTX_Casino_Provably_Fair.md`)

## Development Workflow

### Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server at localhost:4321
npm run build           # Build production site to ./dist/
npm run preview         # Preview production build locally
npm run astro ...       # Run Astro CLI commands
```

### Local Development Setup

1. **Node.js**: Requires v18.14+
2. **Supabase**: Create project and run migrations from `supabase/migrations/`
3. **Environment Variables**: Copy `.env.example` to `.env` and configure:
   - `SUPABASE_DATABASE_URL` or `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. **Database Seeding**: Import `supabase/seed.csv` via Supabase UI

### Building and Testing

- **Build**: `npm run build` - outputs to `./dist/`
- **Smart Contracts**: Use Hardhat commands for contract development
- **No Automated Tests**: Currently no test suite for frontend; manual testing required
- **Preview**: Use `npm run preview` to test production build locally

## File Naming and Organization

- **Pages**: Use kebab-case for file names (e.g., `daily-drops.ts`, `index.astro`)
- **Components**: Use PascalCase for component names (e.g., `WalletConnect.tsx`, `Header.astro`)
- **Utilities**: Use camelCase for utility files (e.g., `database.ts`)
- **Assets**: Store in `/public` directory for static files

## Key Features and Modules

### Wallet Integration

- **Component**: `WalletConnect.tsx`
- **Libraries**: ethers.js v6.x, web3modal v1.9.x
- **Purpose**: Connect user wallets to read MTX balance and enable blockchain interactions

### Daily Drops

- **Component**: `DailyDrops.astro`
- **API**: `/src/pages/api/daily-drops.ts`
- **Purpose**: Display daily rewards or activities

### Database Layer

- **Utility**: `src/utils/database.ts`
- **Client**: Supabase client for database operations
- **Usage**: Import and use for all database queries

## Documentation Standards

### When Adding Features

1. Update relevant docs in `/docs` if feature relates to:
   - MTX tokenomics (`MTX_Tokenomics.md`)
   - Casino mechanics (`MTX_Casino_*.md`)
   - DAO/Governance (`MTX_DAO_Governance.md`)
2. Update `README.md` for major architectural changes
3. Update `USAGE.md` for Supabase or setup changes

### Style

- Use clear, concise language
- Focus on "signal over noise" (project philosophy)
- Be practical and direct, avoid marketing speak
- Include code examples where helpful

## Community and Contributions

### Philosophy

- **Open and Experimental**: Encourage innovation and testing
- **Merit-Based**: Contributions earn recognition and MTX rewards
- **Signal Over Noise**: Value substance over hype
- **Respect and Transparency**: Follow Code of Conduct

### GitHub to MTX Loop

- **Accepted PRs**: Earn MTX rewards
- **Approved Issues**: Bug reports and features earn MTX
- **Quality Focus**: Contributions are reviewed before MTX grants

### Recognition

- Contributors listed in `CONTRIBUTORS.md` and `docs/CONTRIBUTORS.md`
- Follow contribution guidelines for recognition

## Security Considerations

1. **Smart Contracts**: Always use OpenZeppelin security patterns
2. **User Data**: Never expose sensitive information; respect privacy
3. **Wallet Security**: Non-custodial approach; never request private keys
4. **Environment Variables**: Keep secrets in `.env`, never commit to repo
5. **MTX Transactions**: Ensure all casino transactions are verifiable on-chain

## Best Practices

1. **Minimal Changes**: Make surgical, focused changes
2. **Test Locally**: Always test with `npm run dev` before committing
3. **Build Before PR**: Ensure `npm run build` succeeds
4. **Match Existing Patterns**: Follow established code structure and conventions
5. **Astro-First**: Use Astro components for static content, React only when interactivity needed
6. **TailwindCSS**: Use utility classes consistently with existing components
7. **TypeScript**: Provide proper types; avoid `any` unless absolutely necessary
8. **Documentation**: Update docs when changing core features or architecture

## Common Tasks

### Adding a New Page

1. Create `.astro` file in `src/pages/`
2. Use `Layout.astro` for consistent structure
3. Add navigation link in `Header.astro` if needed

### Adding a React Component

1. Create `.tsx` file in `src/components/`
2. Use TypeScript with proper types
3. Import in `.astro` pages with `client:*` directive for hydration

### Modifying Smart Contracts

1. Edit contracts in `/contracts`
2. Use Hardhat for compilation and testing
3. Update documentation in `/docs` if contract logic changes

### Adding Casino Game Logic

1. Implement in `src/casino/`
2. Create page in `src/pages/games/casino/`
3. Ensure provably fair mechanics
4. Update casino documentation

## Deployment

- **Target**: Static site (Node-compatible hosting)
- **Compatible Hosts**: Vercel, Render, Netlify, self-hosted Node servers
- **Configuration**: See `astro.config.ts` for output settings
- **Site URL**: https://matrix-hub.org

## Additional Resources

- **Astro Docs**: https://docs.astro.build/
- **Supabase Docs**: https://supabase.com/docs
- **Project Whitepaper**: `docs/MTX_Whitepaper.md`
- **Casino Architecture**: `docs/MTX_Casino_Architecture.md`
- **Tokenomics**: `docs/MTX_Tokenomics.md`
