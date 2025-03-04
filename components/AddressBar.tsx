import React from 'react';
import { useWatchAsset } from 'wagmi';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const stHSKAddress = '0x81f4B01E26707Edbaf2168Ed4E20C17f8d28fd8F';

const AddressBar: React.FC = () => {
  const { watchAsset } = useWatchAsset();

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
      <span className="text-white font-mono">{stHSKAddress}</span>
      <CopyToClipboard text={stHSKAddress}>
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Copy
        </button>
      </CopyToClipboard>
      <button
        onClick={() => watchAsset({
            type: 'ERC20',
            options: {
              address: stHSKAddress,
              symbol: 'stHSK',
              decimals: 18,
            },
          })}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Add to Wallet
      </button>
    </div>
  );
};

export default AddressBar; 