import { ActivityRules } from '@/components/ui/ActivityRules';
import { WalletConnect } from '@/components/ui/WalletConnect';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-hashkey-dark-100 to-hashkey-dark-300 text-white">
      {/* Navigation Bar */}
      <nav className="bg-hashkey-dark-200/80 backdrop-blur-sm border-b border-hashkey-dark-400/50 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/img/Chain-横-白字.png"
            alt="HashKey Chain Logo"
            width={150}
            height={40}
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </nav>

      {/* Header Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-hashkey-gradient z-10"></div>
        <div className="absolute inset-0 bg-[url('/banner-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-3xl md:text-5xl mb-4 flowing-title">HashKey Chain Mining Event</h1>
          <p className="text-lg md:text-xl text-white max-w-3xl">
            Participate in subscription and on-chain DeFi interactions to earn more points/token rewards
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Activity Rules */}
          <div className="lg:col-span-2 space-y-8">
            <ActivityRules />
          </div>
          
          {/* Right Side - User Data and Information */}
          <div className="space-y-6">
            <div className="bg-hashkey-dark-200/50 backdrop-blur rounded-lg border border-hashkey-dark-400/50 p-6 shadow-hashkey">
              <h2 className="text-xl font-bold mb-4 text-white">User Overview</h2>
              <div className="space-y-4">
                <p className="text-gray-300">Please connect your wallet to view your data</p>
              </div>
            </div>
            
            <div className="bg-hashkey-dark-200/50 backdrop-blur rounded-lg border border-hashkey-dark-400/50 p-6 shadow-hashkey">
              <h2 className="text-xl font-bold mb-4 text-white">Participating Projects</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Project Card Examples */}
                <div className="bg-hashkey-dark-300/70 rounded p-4 text-center hover:bg-hashkey-dark-300 transition-all duration-300 shadow-hashkey">
                  <div className="w-12 h-12 bg-hashkey-gradient rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">P1</span>
                  </div>
                  <p className="text-sm text-white">DEX Trading</p>
                </div>
                <div className="bg-hashkey-dark-300/70 rounded p-4 text-center hover:bg-hashkey-dark-300 transition-all duration-300 shadow-hashkey">
                  <div className="w-12 h-12 bg-hashkey-gradient rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">P2</span>
                  </div>
                  <p className="text-sm text-white">Liquidity Providing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-hashkey-dark-100/80 backdrop-blur-sm border-t border-hashkey-dark-400/30 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 MatrixDocx. Blockchain Mining Activity Platform</p>
        </div>
      </footer>
    </main>
  );
} 