import { CustomConnectButton } from '../components/ConnectButton'
import { MetaMaskConnector } from '../components/MetaMaskConnector'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="mb-8 text-3xl font-bold">MatrixDocx HashKey 钱包连接演示</h1>
      
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="mb-4 text-xl font-semibold">选择连接方式</h2>
        
        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="mb-3 text-lg font-medium">方法 1: 直接连接 MetaMask</h3>
            <p className="mb-4 text-gray-600">
              使用这个按钮可以直接连接到 MetaMask，不会弹出钱包选择器
            </p>
            <MetaMaskConnector />
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="mb-3 text-lg font-medium">方法 2: 使用定制连接按钮</h3>
            <p className="mb-4 text-gray-600">
              使用我们定制的连接按钮，提供更好的用户体验
            </p>
            <div className="flex justify-center">
              <CustomConnectButton />
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="mb-3 text-lg font-medium">方法 3: 使用默认连接按钮</h3>
            <p className="mb-4 text-gray-600">
              使用 RainbowKit 默认的连接按钮
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 