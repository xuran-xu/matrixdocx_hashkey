'use client';

import * as React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { hashkeyChain } from '../config/wagmi';

const queryClient = new QueryClient();

// 使用ConnectKit配置
export const config = createConfig(
  getDefaultConfig({
    appName: "HashKey Chain X",
    appDescription: "HashKey Chain质押应用",
    walletConnectProjectId: "38a492ad0c37213a6fd017ba2fb50874",
    chains: [hashkeyChain],
    transports: {
      [hashkeyChain.id]: http(hashkeyChain.rpcUrls.default.http[0]),
    },
    ssr: true,
  })
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto" mode="dark">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}