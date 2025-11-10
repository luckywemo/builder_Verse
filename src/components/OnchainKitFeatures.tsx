'use client';

import { useAccount, useBalance, useConnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

export function OnchainKitFeatures() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { data: balance } = useBalance({
    address,
  });

  const handleConnect = () => {
    connect({ connector: coinbaseWallet({ appName: 'BuilderVerse' }) });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">OnchainKit Features</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Connection Status:</span>
          <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {isConnected && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-gray-900 break-all">
                {address}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Balance:</span>
              <span className="font-medium text-gray-900">
                {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}
              </span>
            </div>
          </>
        )}

        <div className="pt-4">
          <button
            onClick={handleConnect}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
} 