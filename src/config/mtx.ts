// Live MTX contract address on Ethereum mainnet
export const MTX = {
  address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  symbol: "MTX",
  decimals: 18,
  chainId: 1,
  name: "Matrix Hub Coin",
  // Fixed ETH to MTX rate for direct mint: 1 ETH = 1000 MTX
  ethToMtxRate: 1000,
  get uniswapUrl() {
    return `https://app.uniswap.org/#/swap?outputCurrency=${this.address}&chain=ethereum`;
  }
};
