#!/bin/bash
# Submit Walrus Vault to DeepSurge Hackathon

echo "📋 WALRUS VAULT - DEEPSURGE SUBMISSION"
echo "======================================"
echo ""

# Project info
PROJECT_NAME="Walrus Vault"
GITHUB_REPO="https://github.com/Bandidozx/walrus-vault"
DESCRIPTION="Decentralized file storage with Sui blockchain integration, Walrus storage, and Tatum payments"
TEAM_NAME="Bandidozx"
EMAIL="daffaaridzky02@gmail.com"

echo "📝 Submission Details:"
echo "  Project: $PROJECT_NAME"
echo "  GitHub: $GITHUB_REPO"
echo "  Team: $TEAM_NAME"
echo "  Email: $EMAIL"
echo ""

# Create submission document
cat > /root/walrus-hackathon/DEEPSURGE_SUBMISSION.md << 'EOF'
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
EOF

echo "✅ Submission document created: DEEPSURGE_SUBMISSION.md"
echo ""

# Instructions for manual submission
cat > /root/walrus-hackathon/SUBMIT_INSTRUCTIONS.txt << 'EOF'
MANUAL SUBMISSION STEPS:

1. Go to https://www.deepsurge.xyz
2. Sign in or create account
3. Find "Walrus x Sui x Tatum Hackathon"
4. Click "Submit Project"
5. Fill in form:
   - Project Name: Walrus Vault
   - Description: Decentralized file storage with Sui blockchain integration
   - GitHub URL: https://github.com/Bandidozx/walrus-vault
   - Team Name: Bandidozx
   - Email: daffaaridzky02@gmail.com
6. Submit

ALTERNATIVE: Email submission
- To: hackathon@deepsurge.xyz (or contact email)
- Subject: Walrus Vault - Hackathon Submission
- Body: Include GitHub link + description
- Attach: DEEPSURGE_SUBMISSION.md

PROJECT LINKS:
- GitHub: https://github.com/Bandidozx/walrus-vault
- Live Demo: http://localhost:3000 (local)
- Contract: 0x5462289c83641e953ab158baee453bb71fd152111b0613a6bc47900fa5398278
EOF

echo "📋 Submission instructions saved: SUBMIT_INSTRUCTIONS.txt"
echo ""

echo "🎉 READY FOR SUBMISSION!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Go to https://www.deepsurge.xyz"
echo "2. Sign in/create account"
echo "3. Find Walrus x Sui x Tatum Hackathon"
echo "4. Submit project with GitHub link"
echo ""
echo "GitHub: https://github.com/Bandidozx/walrus-vault"
echo ""
