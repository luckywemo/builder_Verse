'use client';

import { useAccount, useBalance, useConnect } from 'wagmi';
import { formatEther } from 'viem';
import { coinbaseWallet } from 'wagmi/connectors';

export function CoinbaseWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { data: balance } = useBalance({
    address,
    chainId: 8453, // Base mainnet
  });

  const handleConnect = () => {
    connect({ connector: coinbaseWallet({ appName: 'BuilderVerse' }) });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Coinbase Wallet</h3>
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Connect Coinbase Wallet
        </button>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Connected Address:</p>
          <p className="mt-1 text-sm font-medium text-gray-900 break-all">
            {address}
          </p>
          {balance && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Balance:</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatEther(balance.value)} {balance.symbol}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 