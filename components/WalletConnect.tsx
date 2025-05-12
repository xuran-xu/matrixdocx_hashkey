import { useEffect, useState } from 'react'
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { hashkeyTestnet } from '../config/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// 使用 publicProvider 以确保不会有 RPC 限制问题
const { chains, publicClient } = configureChains(
  [hashkeyTestnet],
  [publicProvider()],
  {
    pollingInterval: 5000, // 增加轮询间隔，减少请求次数
    stallTimeout: 5000, // 增加超时时间
  }
)

// 获取默认钱包配置
const { connectors } = getDefaultWallets({
  appName: 'MatrixDocx HashKey',
  projectId,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: false, // 设置为false，让用户主动连接
  connectors,
  publicClient,
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme()}
        modalSize="compact"
        initialChain={hashkeyTestnet}
        appInfo={{
          appName: 'MatrixDocx HashKey',
          learnMoreUrl: 'https://docs.hsk.xyz',
        }}
        showRecentTransactions={true}
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default WalletProvider 