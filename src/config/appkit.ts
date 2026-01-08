// Reown AppKit Configuration
// Reown AppKit (formerly Web3Modal v3) configuration for wallet connections
// Documentation: https://docs.reown.com/appkit

// WalletConnect Project ID
// Get your project ID from: https://cloud.reown.com
// For development, you can use a test project ID
export const projectId = import.meta.env.PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID_HERE'

// Warn if using placeholder project ID
if (projectId === 'YOUR_PROJECT_ID_HERE') {
  console.warn('⚠️  Using placeholder WalletConnect Project ID')
  console.warn('    Get a real project ID from: https://cloud.reown.com')
  console.warn('    Set PUBLIC_WALLETCONNECT_PROJECT_ID in your .env file')
}

// Metadata for your dApp
export const metadata = {
  name: 'Matrix Hub',
  description: 'Matrix Hub - Tools, Modules, and MTX Token Ecosystem',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://matrix-hub.org',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://matrix-hub.org/favicon.ico']
}
