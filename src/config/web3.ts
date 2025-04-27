import { base } from 'viem/chains';
import { createConfig } from 'wagmi';
import { http } from 'wagmi';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

export const onchainKitConfig = {
  appName: 'BuilderVerse',
  appDescription: 'Web3 Education & Community Hub',
  appUrl: 'https://builder-verse.vercel.app',
  appIcon: 'https://builder-verse.vercel.app/icon.png',
  chainId: base.id,
  apiKey: process.env.NEXT_PUBLIC_BASE_API_KEY || '',
  theme: 'dark',
  connectOptions: {
    appName: 'BuilderVerse'
  }
} as const; 