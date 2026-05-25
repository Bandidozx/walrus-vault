# Walrus Vault - Decentralized File Storage

**Hackathon:** Walrus x Sui x Tatum  
**Timeline:** May 23 - June 6, 2026  
**Prize:** $2,000 USD

## Project Overview

Walrus Vault is a decentralized file storage application that combines:
- **Walrus Protocol** - Decentralized blob storage
- **Sui Blockchain** - Access control via smart contracts
- **Tatum API** - Cross-chain integration and API tooling

## Features

### MVP (Minimum Viable Product)
1. **File Upload** - Upload files to Walrus decentralized storage
2. **Access Control** - Mint NFT on Sui blockchain as access token
3. **File Retrieval** - Download files using NFT ownership proof
4. **Dashboard** - Simple web interface to manage files

### Architecture

```
User → Web UI → Backend API → Walrus (Storage) + Sui (Access Control)
```

**Flow:**
1. User uploads file
2. File stored on Walrus → returns blob ID
3. Smart contract on Sui mints access NFT with blob ID metadata
4. User can retrieve file by proving NFT ownership

## Tech Stack

- **Frontend:** HTML/CSS/JavaScript (simple, no framework)
- **Backend:** Node.js + Express
- **Blockchain:** Sui (Move smart contracts)
- **Storage:** Walrus Protocol
- **API:** Tatum for cross-chain features

## Setup

```bash
npm install
node setup.js  # Creates Sui wallet
```

## Wallet

- **Address:** 0x7e11e4e521b6d61dc0d2e428a03b18a36bf1b4413406841e41a1938015673a71
- **Network:** Testnet
- **Faucet:** https://faucet.testnet.sui.io

## Development Timeline

- **Day 1-2:** Setup + Research ✓
- **Day 3-4:** Smart contract development
- **Day 5-7:** Backend API + Walrus integration
- **Day 8-9:** Frontend UI
- **Day 10-11:** Testing + Documentation
- **Day 12:** Submission

## Submission Checklist

- [ ] GitHub repository (public)
- [ ] Live demo (deployed)
- [ ] Documentation (README + architecture)
- [ ] Demo video (3-5 minutes)
- [ ] Submit to DeepSurge platform

## License

MIT
