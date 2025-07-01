


          
I'll create a comprehensive README.md file for the CofeToken project that explains what the project is about, its structure, setup instructions, and how to use it. This will help users understand and navigate the Ethereum token sale application.
        
            
toolName: view_files
            
status: success
          
            
filePath: a:\AI-ML\Ethereum-market\cofetoken\contracts\MyToken.sol
a:\AI-ML\Ethereum-market\cofetoken\contracts\KycContract.sol
a:\AI-ML\Ethereum-market\cofetoken\contracts\MyTokenSale.sol
          
Now I'll check the Crowdsale contract and the client's App.jsx to understand the full functionality of the application before creating the README.
        
            
toolName: view_files
            
status: success
          
            
filePath: a:\AI-ML\Ethereum-market\cofetoken\contracts\Crowdsale.sol
a:\AI-ML\Ethereum-market\cofetoken\client\src\App.jsx
          
Let me check the client's App.css and package.json to understand the styling and dependencies before creating the README.
        
            
toolName: view_files
            
status: success
          
            
filePath: a:\AI-ML\Ethereum-market\cofetoken\client\src\App.css
a:\AI-ML\Ethereum-market\cofetoken\client\package.json
          
Let me check the truffle-config.js file to understand the project's network configuration and deployment settings before creating the README.
        
            
toolName: view_files
            
status: success
          
            
filePath: a:\AI-ML\Ethereum-market\cofetoken\truffle-config.js
          
Let me check the test files to understand how the contracts are tested, which will be useful information for the README.
        
            
toolName: view_files
            
status: success
          
            
filePath: a:\AI-ML\Ethereum-market\cofetoken\test\MyToken.test.js
          
Let me check the setupchai.js file to understand the testing setup, and also look at the scripts directory to understand the build process.
        
            
toolName: view_files
            
status: success
          
            
filePath: a:\AI-ML\Ethereum-market\cofetoken\test\setupchai.js
a:\AI-ML\Ethereum-market\cofetoken\scripts\copy-contracts.js
          
# CofeToken - Ethereum Token Sale Project

## Overview

CofeToken is a decentralized application (DApp) built on Ethereum that implements a token sale for CAPPU tokens. The project demonstrates how to create and deploy ERC20 tokens, implement KYC (Know Your Customer) verification, and set up a token crowdsale using smart contracts.

## Features

- ERC20 token implementation (CAPPU)
- KYC verification system for token purchases
- Token crowdsale with customizable rate
- Web3.js integration for blockchain interaction
- React-based user interface
- MetaMask wallet integration

## Project Structure

```
cofetoken/
├── build/                  # Compiled contract artifacts
├── client/                 # React frontend application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   └── webpack.config.js   # Webpack configuration
├── contracts/              # Solidity smart contracts
│   ├── Crowdsale.sol       # Base crowdsale implementation
│   ├── KycContract.sol     # KYC verification contract
│   ├── Migrations.sol      # Truffle migrations contract
│   ├── MyToken.sol         # ERC20 token implementation
│   └── MyTokenSale.sol     # Token sale implementation
├── migrations/             # Truffle migration scripts
├── scripts/                # Utility scripts
├── test/                   # Contract test files
└── truffle-config.js       # Truffle configuration
```

## Smart Contracts

- **MyToken.sol**: An ERC20 token implementation that inherits from OpenZeppelin's ERC20 contract.
- **KycContract.sol**: Manages KYC verification for addresses that want to participate in the token sale.
- **Crowdsale.sol**: Base implementation for token sales with rate, wallet, and token management.
- **MyTokenSale.sol**: Extends Crowdsale with KYC verification requirements.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)
- [Ganache](https://www.trufflesuite.com/ganache) (`npm install -g ganache`)
- [MetaMask](https://metamask.io/) browser extension

## Setup and Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd cofetoken
```

### 2. Install dependencies

```bash
npm install
cd client
npm install
```

### 3. Start Ganache

Start Ganache to run a local Ethereum blockchain:

```bash
ganache
```

Note the first private key from the list of accounts, which you'll need to import into MetaMask.

### 4. Configure MetaMask

1. Open MetaMask in your browser
2. Add a new network with the following details:
   - Network Name: Ganache
   - RPC URL: http://127.0.0.1:9545
   - Chain ID: 5777
   - Currency Symbol: ETH
3. Import the first account from Ganache using the private key

### 5. Deploy smart contracts

```bash
truffle migrate --network development
```

### 6. Copy contract artifacts to client

```bash
npm run copy-contracts
```

### 7. Start the client application

```bash
cd client
npm start
```

The application will be available at http://localhost:8080

## Usage

1. **KYC Verification**: Use the KYC Verification section to whitelist Ethereum addresses for token purchases.
2. **Purchase Tokens**: Once your address is whitelisted, you can purchase CAPPU tokens using the Purchase section.
3. **Check Balance**: View your CAPPU token balance in the Account Information section.

## Testing

Run the test suite to verify contract functionality:

```bash
truffle test
```

The tests verify:
- Token creation and initial supply
- Token transfers between accounts
- Transfer validation

## Development

### Frontend

The client application is built with React and uses:
- Web3.js for Ethereum interaction
- Webpack for bundling
- Tailwind CSS for styling
- Lucide React for icons

### Smart Contracts

The contracts are written in Solidity 0.8.20 and use OpenZeppelin contracts for standard implementations.

## License

MIT

## Resources

- [Truffle Documentation](https://www.trufflesuite.com/docs/truffle/overview)
- [React Documentation](https://reactjs.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Documentation](https://ethereum.org/)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)

        