import React, { useState, useEffect } from 'react';
import { useWatchAsset } from 'wagmi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from 'next/image';

const stHSKAddress = '0x81f4B01E26707Edbaf2168Ed4E20C17f8d28fd8F';

const AddressBar: React.FC = () => {
  const { watchAsset } = useWatchAsset();
  const [copied, setCopied] = useState(false);

  // Reset copied state after 3 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    setCopied(true);
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
      <span className="text-white font-mono">{stHSKAddress}</span>
      <CopyToClipboard text={stHSKAddress} onCopy={handleCopy}>
        <div className="relative group">
          <div className="p-1 rounded-md hover:bg-gray-700 transition-colors">
            <Image
              src={copied ? "/tick-circle.png" : "/copy.png"}
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:inline bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            {copied ? "Copied" : "Copy"}
          </span>
        </div>
      </CopyToClipboard>
      <div className="relative group">
        <div className="p-1 rounded-md hover:bg-gray-700 transition-colors">
          <Image
            src="/wallet.png"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() =>
              watchAsset({
                type: 'ERC20',
                options: {
                  address: stHSKAddress,
                  symbol: 'stHSK',
                  decimals: 18,
                },
              })
            }
          />
        </div>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:inline bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          Add to Wallet
        </span>
      </div>
    </div>
  );
};

export default AddressBar; 