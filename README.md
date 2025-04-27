# Builder_verse

Builder_verse is a decentralized application (dApp) that combines Web3 technologies with advanced AI capabilities to create a comprehensive platform for developers and builders. The platform integrates Filecoin storage solutions, sentiment analysis, and various blockchain operations.

## Features

### Core Components
- **Web3 Integration**: Seamless blockchain interaction with Coinbase Wallet and other Web3 providers
- **Filecoin Storage**: Secure and decentralized file storage management
- **Sentiment Analysis**: AI-powered sentiment analysis for text data
- **Token Operations**: Comprehensive token management and operations
- **NFT Operations**: NFT creation, management, and interaction
- **Base Balance**: Real-time balance tracking and management

### Technical Stack
- **Frontend**: Next.js with TypeScript
- **Smart Contracts**: Solidity with OpenZeppelin
- **Blockchain**: Filecoin Calibration Testnet
- **AI Integration**: Sentiment analysis capabilities
- **Web3**: Coinbase Wallet integration

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask or Coinbase Wallet
- tFIL tokens (from Calibration faucet)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/luckywemo/builder_Verse.git
cd builder_Verse
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
NEXT_PUBLIC_CHAIN_ID=314159
```

## Project Structure

```
builder_Verse/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── config/             # Configuration files
│   ├── contracts/          # Smart contracts
│   └── styles/             # Global styles
├── public/                 # Static assets
├── scripts/               # Deployment scripts
└── tests/                 # Test files
```

## Smart Contracts

### FilecoinStorageManager
- Manages storage deals on Filecoin
- Handles provider registration and staking
- Facilitates deal creation and verification
- Implements secure payment handling

## Components

### Web3Provider
- Manages Web3 connection and wallet integration
- Handles blockchain interactions
- Provides context for Web3 operations

### CoinbaseWallet
- Implements Coinbase Wallet integration
- Handles wallet connection and disconnection
- Manages account information

### TokenOperations
- Handles token transfers and approvals
- Manages token balances
- Implements token-related operations

### NftOperations
- Manages NFT creation and transfer
- Handles NFT metadata
- Implements NFT-related operations

### SentimentAnalyzer
- Provides sentiment analysis functionality
- Processes text data
- Returns sentiment scores

## Development

1. Start the development server:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

3. Deploy smart contracts:
```bash
npm run deploy
```

## Deployment

### Smart Contracts
1. Deploy to Filecoin Calibration:
```bash
npm run deploy:calibration
```

2. Verify contracts:
```bash
npm run verify
```

### Frontend
1. Build the application:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
npm run deploy:vercel
```

## Security Features

- Reentrancy protection
- Access control mechanisms
- Secure wallet integration
- Encrypted environment variables
- Comprehensive error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- OpenZeppelin for smart contract templates
- Filecoin for storage solutions
- Next.js team for the framework
- Coinbase for wallet integration
