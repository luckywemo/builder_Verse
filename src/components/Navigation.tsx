'use client';

import Link from 'next/link';
import { useAccount, useConnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

export default function Navigation() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  const handleConnect = () => {
    connect({ connector: coinbaseWallet({ appName: 'BuilderVerse' }) });
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">BuilderVerse</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleConnect}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 