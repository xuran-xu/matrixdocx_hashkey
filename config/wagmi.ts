import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';
import { http } from 'viem';

export const hashkeyChain = {
  id: 177,
  name: 'HashKey Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'HSK',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.hsk.xyz'] },
    public: { http: ['https://mainnet.hsk.xyz'] },
  },
  blockExplorers: {
    default: { name: 'HashKey Explorer', url: 'https://explorer.hsk.xyz' },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'HashKey Chain DApp',
  projectId: '38a492ad0c37213a6fd017ba2fb50874',
  chains: [hashkeyChain],
  transports: {
    [hashkeyChain.id]: http('https://mainnet.hsk.xyz'),
  },
  ssr: true,
}); 