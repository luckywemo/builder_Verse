'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useContractWrite, useSimulateContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

// ERC721 ABI for NFT operations
const ERC721_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Example NFT contract on Base
const NFT_CONTRACT = '0x4d224452801ACEd8B2F0ebeb0Daa1e1A7e253289'; // Example contract

export function NftOperations() {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  
  const { data: owner } = useReadContract({
    address: NFT_CONTRACT,
    abi: ERC721_ABI,
    functionName: 'ownerOf',
    args: [BigInt(tokenId || '0')],
    // enabled: Boolean(tokenId),
  });

  const { data } = useSimulateContract({
    address: NFT_CONTRACT,
    abi: ERC721_ABI,
    functionName: 'transferFrom',
    args: [address as `0x${string}`, recipient as `0x${string}`, BigInt(tokenId || '0')],
    enabled: Boolean(address && recipient && tokenId),
  });

  const { writeContract } = useWriteContract()
  // const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">NFT Operations</h3>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
            Token ID
          </label>
          <input
            type="text"
            id="tokenId"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter token ID"
          />
        </div>
        {owner && (
          <div className="text-sm text-gray-500">
            Current Owner: {owner}
          </div>
        )}
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
        <button
         onClick={async () => {
          if (!data?.request) return;
          setIsLoading(true);
          setIsSuccess(false);
          try {
            await writeContract(data.request);
            setIsSuccess(true);
          } catch (error) {
            // Optionally handle error
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={!Boolean(data?.request) || isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Transferring...' : 'Transfer NFT'}
        </button>
        {isSuccess && (
          <p className="text-sm text-green-600">Transfer successful!</p>
        )}
      </div>
    </div>
  );
} 