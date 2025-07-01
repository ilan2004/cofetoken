


          
# CofeToken - Ethereum Token Sale Project

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![Truffle](https://img.shields.io/badge/Truffle-5.x-orange)](https://trufflesuite.com/)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

CofeToken is a decentralized application (DApp) built on Ethereum that implements a token sale for CAPPU tokens. The project demonstrates how to create and deploy ERC20 tokens, implement KYC (Know Your Customer) verification, and set up a token crowdsale using smart contracts.

![CofeToken Interface](https://via.placeholder.com/800x400?text=CofeToken+Interface)

## Features

- ☕ ERC20 token implementation (CAPPU)
- 🔒 KYC verification system for token purchases
- 💰 Token crowdsale with customizable rate
- 🌐 Web3.js integration for blockchain interaction
- ⚛️ React-based user interface
- 🦊 MetaMask wallet integration

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
git clone https://github.com/yourusername/cofetoken.git
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Truffle Documentation](https://www.trufflesuite.com/docs/truffle/overview)
- [React Documentation](https://reactjs.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Documentation](https://ethereum.org/)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Truffle Suite](https://www.trufflesuite.com/) for development tools
- [Web3.js](https://web3js.readthedocs.io/) for Ethereum JavaScript API
        