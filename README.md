# Filecoin Storage Manager

A smart contract for managing Filecoin storage deals on the Calibration testnet. This contract facilitates the creation, verification, and completion of storage deals between clients and providers.

## Features

- Provider registration and staking
- Deal creation with Filecoin-specific parameters
- Deal verification and completion
- FIL token integration
- Upgradeable contract design
- Comprehensive event logging

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask or similar wallet
- tFIL tokens (from Calibration faucet)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd builder-verse
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PRIVATE_KEY=your_private_key_here
```

## Deployment

1. Get tFIL tokens from the Calibration faucet:
   - Visit: https://faucet.calibration.fildev.network/
   - Request tFIL for your address

2. Deploy the contract:
```bash
npm run deploy
```

## Contract Functions

### Provider Functions
- `registerProvider(name, providerId)`: Register as a storage provider
- `stakeProvider()`: Stake tFIL tokens to become active
- `unstakeProvider()`: Unstake and withdraw tokens

### Deal Functions
- `createDeal(provider, size, price, duration, pieceCid, dataCid, dealProposalId)`: Create a new storage deal
- `verifyDeal(dealId, verified)`: Verify a deal
- `completeDeal(dealId)`: Complete and finalize a deal
- `updateDealProposal(dealId, newDealProposalId)`: Update deal proposal ID

### View Functions
- `getClientDeals(client)`: Get all deals for a client
- `getProviderDeals(provider)`: Get all deals for a provider
- `getDealDetails(dealId)`: Get details of a specific deal
- `getProviderDetails(provider)`: Get details of a provider

## Network Configuration

- Network: Filecoin Calibration
- Chain ID: 314159
- RPC URL: https://api.calibration.node.glif.io/rpc/v1
- tFIL Token: 0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153

## Security Features

- Reentrancy protection
- Pausable functionality
- Provider staking requirements
- Comprehensive access control
- Upgradeable contract design

## License

MIT
