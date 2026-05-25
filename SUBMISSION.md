# Walrus Vault - Hackathon Submission

**Walrus x Sui x Tatum Hackathon 2026**  
**Submission Date:** May 25, 2026  
**Deadline:** June 6, 2026

## Project Overview

Walrus Vault is a decentralized file storage application that combines:
- **Walrus** for distributed file storage
- **Sui blockchain** for access control and ownership verification
- **Tatum** for payment integration (optional premium features)

Users can upload files securely, mint access NFTs on the Sui blockchain, and share files with others through NFT transfers.

## Features

### ✅ Implemented
- **File Upload**: Drag-and-drop interface with Walrus integration (fallback to local storage)
- **File Management**: List, download, and delete files
- **Wallet Integration**: Display Sui testnet wallet address and balance
- **Modern UI**: Responsive design with real-time file stats
- **Local Storage Fallback**: Works offline when Walrus API is unavailable
- **Move Smart Contract**: FileVault and AccessNFT structs for on-chain access control

### 🔄 In Progress
- Deploy Move contract to Sui testnet
- Mint AccessNFT on file upload
- Transfer access NFTs between users
- Verify access before download

### 📋 Planned
- Tatum payment integration for premium storage
- File encryption before upload
- Batch file operations
- File sharing with expiration dates
- Analytics dashboard

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Storage**: Walrus (primary), Local filesystem (fallback)
- **Blockchain**: Sui (Move smart contracts)
- **Deployment**: Docker (optional)

## Project Structure

```
walrus-vault/
├── public/
│   └── index.html           # Frontend UI
├── sources/
│   └── vault.move           # Sui Move contract
├── server.js                # Express API server
├── setup.js                 # Wallet generation utility
├── deploy.js                # Contract deployment helper
├── publish.js               # Contract publishing script
├── Move.toml                # Move package config
├── package.json             # Node.js dependencies
├── README.md                # Project documentation
└── uploads/                 # Local file storage
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/wallet` | Get wallet info |
| POST | `/api/upload` | Upload file |
| GET | `/api/files` | List all files |
| GET | `/api/file/:fileId` | Get file details |
| GET | `/api/download/:fileId` | Download file |
| DELETE | `/api/file/:fileId` | Delete file |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Sui testnet wallet (auto-generated)

### Installation

```bash
# Clone repository
git clone https://github.com/Bandidozx/walrus-vault.git
cd walrus-vault

# Install dependencies
npm install

# Generate wallet
node setup.js

# Start server
node server.js
```

Server runs on `http://localhost:3000`

## Usage

1. **Upload Files**: Drag files to the upload zone or click to select
2. **View Files**: See all uploaded files with size and storage type
3. **Download Files**: Click download button to retrieve files
4. **Delete Files**: Remove files from vault

## Wallet Details

- **Network**: Sui Testnet
- **Address**: `0x7e11e4e521b6d61dc0d2e428a03b18a36bf1b4413406841e41a1938015673a71`
- **Balance**: 1 SUI (1,000,000,000 MIST)
- **Private Key**: Stored in `.wallet.json` (gitignored)

## Smart Contract

### FileVault Struct
```move
public struct FileVault has key, store {
    id: UID,
    owner: address,
    walrus_blob_id: String,
    file_name: String,
    file_size: u64,
    created_at: u64,
}
```

### AccessNFT Struct
```move
public struct AccessNFT has key, store {
    id: UID,
    owner: address,
    file_name: String,
    created_at: u64,
}
```

## Testing

### Manual Testing
```bash
# Upload test file
curl -X POST http://localhost:3000/api/upload -F "file=@test.txt"

# List files
curl http://localhost:3000/api/files

# Download file
curl http://localhost:3000/api/download/file_1779702950326_k4vfeafv0
```

### Test Results
- ✅ Server health check: PASS
- ✅ File upload: PASS (local storage)
- ✅ File listing: PASS
- ✅ File download: PASS
- ✅ Wallet integration: PASS

## Deployment

### Docker (Optional)
```bash
docker build -t walrus-vault .
docker run -p 3000:3000 walrus-vault
```

### Production
- Deploy to Vercel, Railway, or Heroku
- Use environment variables for Walrus API keys
- Enable HTTPS
- Set up database for file metadata

## Next Steps

1. **Deploy Move Contract** (May 26)
   - Compile with Sui CLI
   - Publish to testnet
   - Update package ID in server.js

2. **Integrate Blockchain** (May 27-28)
   - Mint AccessNFT on upload
   - Verify ownership on download
   - Add transfer functionality

3. **Add Tatum Integration** (May 29-30)
   - Payment processing
   - Premium storage tiers
   - Subscription management

4. **Testing & Polish** (May 31 - June 2)
   - End-to-end testing
   - UI/UX improvements
   - Performance optimization

5. **Demo & Submission** (June 3-6)
   - Create demo video
   - Write submission documentation
   - Submit to DeepSurge

## Team

- **Developer**: Bandidozx
- **GitHub**: https://github.com/Bandidozx/walrus-vault

## Links

- **GitHub Repository**: https://github.com/Bandidozx/walrus-vault
- **Live Demo**: http://localhost:3000 (local)
- **Hackathon**: https://www.deepsurge.xyz
- **Walrus Docs**: https://docs.walrus.site
- **Sui Docs**: https://docs.sui.io

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Walrus Protocol for distributed storage
- Sui Foundation for blockchain infrastructure
- Tatum for payment APIs
- DeepSurge for hosting the hackathon

---

**Status**: MVP Complete ✅ | Contract Deployment: Pending | Blockchain Integration: In Progress

**Last Updated**: May 25, 2026
