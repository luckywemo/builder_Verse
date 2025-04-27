'use client';

import { useState } from 'react';
import { useOnchainKit } from '@coinbase/onchainkit';
import { useContractWrite } from 'wagmi';
import { parseEther } from 'viem';

// ERC20 ABI for basic token operations
const ERC20_ABI = [
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Example USDC contract on Base
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export function TokenOperations() {
  const [mounted, setMounted] = useState(false);
  const { address } = useOnchainKit();
  const { write, isLoading: isWriteLoading } = useContractWrite({
    address: USDC_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'transfer',
  });
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!address || !recipient || !amount) return;
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await write({
        args: [recipient as `0x${string}`, parseEther(amount)],
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Token Operations</h3>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0x..."
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (USDC)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0.0"
          />
        </div>
        <button
          onClick={handleTransfer}
          disabled={!address || !recipient || !amount || isLoading || isWriteLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading || isWriteLoading ? 'Sending...' : 'Send USDC'}
        </button>
        {isSuccess && (
          <p className="text-sm text-green-600">Transaction successful!</p>
        )}
      </div>
    </div>
  );
} 