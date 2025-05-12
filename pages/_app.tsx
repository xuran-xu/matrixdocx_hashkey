import type { AppProps } from 'next/app'
import { WalletProvider } from '../components/WalletConnect'
import '@rainbow-me/rainbowkit/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}

export default MyApp 