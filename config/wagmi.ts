import { Chain } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

export const hashkeyTestnet = {
  id: 133,
  name: 'HashKey Chain Testnet',
  network: 'hashkey-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    public: { http: ['https://hashkeychain-testnet.alt.technology'] },
    default: { http: ['https://hashkeychain-testnet.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'HashKey Explorer', url: 'https://hashkeychain-testnet-explorer.alt.technology' },
  },
  testnet: true,
} as const satisfies Chain

export const getWalletConnectors = (projectId: string, chains: Chain[]) => {
  const { connectors } = getDefaultWallets({
    appName: 'MatrixDocx HashKey',
    projectId,
    chains,
  })
  return connectors
} 