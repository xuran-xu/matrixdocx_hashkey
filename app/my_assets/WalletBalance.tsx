import Image from 'next/image'

export default function WalletBalance() {
  return (
    <div className="w-full bg-base-300/95 p-8 rounded-box shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold text-base-content/80">Wallet Balance</h2>
        <button className="btn btn-xs btn-ghost">Refresh</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* XAUM Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/xaum.png" alt="XAUM" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">XAUM</p>
            <p className="text-sm font-medium">0.00</p>
          </div>
        </div>

        {/* HSK Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/HSK.png" alt="HSK" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">HSK</p>
            <p className="text-sm font-medium">0.00</p>
          </div>
        </div>

        {/* USDT Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/USDT.png" alt="USDT" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">USDT</p>
            <p className="text-sm font-medium">0.00</p>
          </div>
        </div>

        {/* USDC Balance Card */}
        <div className="flex items-center p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <Image src="/USDC.png" alt="USDC" width={24} height={24} className="mr-2" />
          <div>
            <p className="text-primary text-xs">USDC</p>
            <p className="text-sm font-medium">0.00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
