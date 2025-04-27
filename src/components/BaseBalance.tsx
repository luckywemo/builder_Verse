'use client';

import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';

export function BaseBalance() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: 8453, // Base mainnet
  });

  if (!address) return null;

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Base Balance</h3>
      <p className="mt-2 text-gray-600">
        {balance ? `${formatEther(balance.value)} ${balance.symbol}` : 'Loading...'}
      </p>
    </div>
  );
} 