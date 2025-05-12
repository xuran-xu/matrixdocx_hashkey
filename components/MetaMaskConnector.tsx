import { useConnect } from 'wagmi'
import { useState } from 'react'

export const MetaMaskConnector = () => {
  const { connectors, connect, error } = useConnect()
  const [isConnecting, setIsConnecting] = useState(false)

  // 找到MetaMask连接器
  const metaMaskConnector = connectors.find(
    connector => connector.id === 'metaMask'
  )

  const handleConnect = async () => {
    if (metaMaskConnector) {
      setIsConnecting(true)
      try {
        // 直接连接到MetaMask，跳过钱包选择器
        await connect({ connector: metaMaskConnector })
      } catch (err) {
        console.error('Failed to connect to MetaMask:', err)
      } finally {
        setIsConnecting(false)
      }
    } else {
      console.error('MetaMask connector not found')
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
          alt="MetaMask" 
          className="w-6 h-6 mr-2"
        />
        {isConnecting ? '连接中...' : '连接 MetaMask'}
      </button>
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error.message}
        </div>
      )}
    </div>
  )
} 