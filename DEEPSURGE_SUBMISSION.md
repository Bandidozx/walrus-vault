# Walrus Vault - DeepSurge Hackathon Submission

## Project Overview

**Walrus Vault** is a decentralized file storage application built on Sui blockchain with Walrus storage integration and Tatum payment processing.

### Key Features

1. **Decentralized File Storage**
   - Upload/download/delete files
   - Walrus integration for distributed storage
   - Local fallback for testing

2. **Blockchain Integration**
   - Sui Move smart contract (deployed)
   - NFT-based access control
   - FileVault and AccessNFT structs

3. **Payment Processing**
   - Tatum integration
   - 4 pricing tiers (Free, Basic, Pro, Enterprise)
   - Subscription management

4. **Modern UI**
   - Drag-and-drop upload
   - Real-time file statistics
   - Responsive design

## Technical Stack

- **Backend**: Express.js (Node.js)
- **Frontend**: HTML5, CSS3, JavaScript
- **Blockchain**: Sui Move
- **Storage**: Walrus
- **Payments**: Tatum API
- **Deployment**: Docker

## Project Status

- ✅ Backend API (7 endpoints)
- ✅ Frontend UI
- ✅ Smart Contract (deployed)
- ✅ Payment integration
- ✅ Documentation
- ✅ Docker configuration

## GitHub Repository

https://github.com/Bandidozx/walrus-vault

## Deployment

### Local Development
```bash
cd /root/walrus-hackathon
npm install
node server.js
# Open http://localhost:3000
```

### Docker
```bash
docker-compose up
```

## Smart Contract

- **Package ID**: 0x5462289c83641e953ab158baee453bb71fd152111b0613a6bc47900fa5398278
- **Network**: Sui Testnet
- **Wallet**: 0x7e11e4e521b6d61dc0d2e428a03b18a36bf1b4413406841e41a1938015673a71

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/wallet` - Wallet info
- `POST /api/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/download/:fileId` - Download file
- `DELETE /api/file/:fileId` - Delete file
- `GET /api/pricing` - Pricing tiers

## Team

- **Developer**: Bandidozx
- **Email**: daffaaridzky02@gmail.com
- **GitHub**: https://github.com/Bandidozx

## Timeline

- **Started**: May 25, 2026
- **Completed**: May 25, 2026 (6 hours)
- **Status**: Ready for submission

## Prize

Competing for $2,000 USD prize pool

---

**Submission Date**: May 25, 2026
**Hackathon**: Walrus x Sui x Tatum Hackathon 2026
**Platform**: DeepSurge
