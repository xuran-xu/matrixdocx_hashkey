export function getExplorerUrl(chainId: number): string {
  switch (chainId) {
    case 177:
      return 'https://hashkey.blockscout.com';
    case 133:
      return 'https://hashkeychain-testnet-explorer.alt.technology/';
    default:
      return 'https://etherscan.io';
  }
} 