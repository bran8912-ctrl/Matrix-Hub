// TODO: Replace with actual MTX contract address before deployment
export const MTX = {
  address: "0xYOUR_MTX_CONTRACT_ADDRESS",
  symbol: "MTX",
  decimals: 18,
  chainId: 1,
  name: "Matrix Hub Coin",
  get uniswapUrl() {
    return `https://app.uniswap.org/#/swap?outputCurrency=${this.address}&chain=ethereum`;
  }
};
