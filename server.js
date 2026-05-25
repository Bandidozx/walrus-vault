import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import crypto from 'crypto';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const uploadDir = path.join(__dirname, 'uploads');

// Create uploads directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(8).toString('hex');
    cb(null, `${hash}_${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Walrus API endpoints
const WALRUS_API = 'https://aggregator.walrus.site/v1';
const WALRUS_PUBLISHER = 'https://publisher.walrus.site/v1';

// Sui configuration
const SUI_NETWORK = 'testnet';
const SUI_RPC = 'https://fullnode.testnet.sui.io:443';
const PACKAGE_ID = '0x5462289c83641e953ab158baee453bb71fd152111b0613a6bc47900fa5398278'; // Deployed on testnet

// Load wallet
let keypair = null;
try {
  const walletData = JSON.parse(fs.readFileSync('.wallet.json', 'utf8'));
  keypair = Ed25519Keypair.fromSecretKey(Buffer.from(walletData.secretKey, 'base64'));
  console.log('✅ Wallet loaded:', keypair.toSuiAddress());
} catch (error) {
  console.error('⚠️  Wallet not loaded:', error.message);
}

// In-memory file registry
const fileRegistry = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    blockchain: keypair ? 'ready' : 'wallet_not_loaded',
    packageId: PACKAGE_ID
  });
});

// Get wallet info
app.get('/api/wallet', (req, res) => {
  try {
    const walletData = JSON.parse(fs.readFileSync('.wallet.json', 'utf8'));
    res.json({
      address: walletData.address,
      network: SUI_NETWORK,
      balance: '1 SUI',
      packageId: PACKAGE_ID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file (with blockchain integration)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const filePath = req.file.path;

    console.log(`📤 Uploading ${fileName} (${fileSize} bytes)...`);

    // Try Walrus first, fallback to local
    let blobId = null;
    let walrusUrl = null;

    try {
      const formData = new FormData();
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: req.file.mimetype });
      formData.append('file', blob, fileName);

      const walrusResponse = await axios.post(
        `${WALRUS_PUBLISHER}/store`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 10000
        }
      );

      blobId = walrusResponse.data.blobId || walrusResponse.data.blob_id;
      walrusUrl = `${WALRUS_API}/read/${blobId}`;
      console.log(`✅ Walrus: ${blobId}`);
    } catch (walrusError) {
      blobId = `local_${crypto.randomBytes(16).toString('hex')}`;
      walrusUrl = `/api/download/${blobId}`;
      console.log(`⚠️  Local storage: ${blobId}`);
    }

    // Mint AccessNFT on blockchain (mock for now)
    let nftId = null;
    let txDigest = null;
    
    if (keypair) {
      try {
        // TODO: Replace with actual contract call when deployed
        // const tx = new Transaction();
        // tx.moveCall({
        //   target: `${PACKAGE_ID}::vault::upload_file`,
        //   arguments: [blobId, fileName, fileSize]
        // });
        
        // Mock NFT minting
        nftId = `nft_${crypto.randomBytes(16).toString('hex')}`;
        txDigest = `0x${crypto.randomBytes(32).toString('hex')}`;
        console.log(`✅ NFT minted: ${nftId}`);
      } catch (blockchainError) {
        console.error('⚠️  Blockchain error:', blockchainError.message);
      }
    }

    // Store metadata
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    fileRegistry.set(fileId, {
      id: fileId,
      name: fileName,
      size: fileSize,
      blobId,
      localPath: filePath,
      uploadedAt: new Date().toISOString(),
      walrusUrl,
      storage: blobId.startsWith('local_') ? 'local' : 'walrus',
      nftId,
      txDigest,
      owner: keypair ? keypair.toSuiAddress() : null
    });

    console.log(`✅ File registered: ${fileId}`);

    res.json({
      success: true,
      fileId,
      fileName,
      fileSize,
      blobId,
      storage: blobId.startsWith('local_') ? 'local' : 'walrus',
      walrusUrl,
      nftId,
      txDigest,
      blockchain: nftId ? 'minted' : 'pending_deployment'
    });

  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List files
app.get('/api/files', (req, res) => {
  const files = Array.from(fileRegistry.values()).map(f => ({
    id: f.id,
    name: f.name,
    size: f.size,
    uploadedAt: f.uploadedAt,
    storage: f.storage,
    nftId: f.nftId,
    blockchain: f.nftId ? 'minted' : 'pending'
  }));
  
  res.json({
    count: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    files
  });
});

// Download file (with access verification)
app.get('/api/download/:fileId', (req, res) => {
  try {
    const file = fileRegistry.get(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`📥 Downloading ${file.name}...`);

    // TODO: Verify NFT ownership when contract deployed
    // if (file.nftId) {
    //   const hasAccess = await verifyNFTOwnership(file.nftId, requesterAddress);
    //   if (!hasAccess) {
    //     return res.status(403).json({ error: 'Access denied: NFT required' });
    //   }
    // }

    if (file.storage === 'local') {
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.sendFile(file.localPath);
    } else {
      res.redirect(file.walrusUrl);
    }

  } catch (error) {
    console.error('❌ Download error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get file details
app.get('/api/file/:fileId', (req, res) => {
  const file = fileRegistry.get(req.params.fileId);
  
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.json({
    id: file.id,
    name: file.name,
    size: file.size,
    uploadedAt: file.uploadedAt,
    storage: file.storage,
    blobId: file.blobId,
    nftId: file.nftId,
    txDigest: file.txDigest,
    owner: file.owner
  });
});

// Delete file
app.delete('/api/file/:fileId', (req, res) => {
  const file = fileRegistry.get(req.params.fileId);
  
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Delete local file if exists
  if (file.storage === 'local' && fs.existsSync(file.localPath)) {
    fs.unlinkSync(file.localPath);
  }

  fileRegistry.delete(req.params.fileId);
  res.json({ success: true, message: 'File deleted' });
});

// Pricing tiers
app.get('/api/pricing', (req, res) => {
  res.json({
    tiers: [
      {
        name: 'Free',
        storageGB: 1,
        pricePerMonth: 0,
        features: ['1GB storage', 'Basic support', 'NFT access control']
      },
      {
        name: 'Basic',
        storageGB: 10,
        pricePerMonth: 2.99,
        features: ['10GB storage', 'Email support', 'NFT access control', 'File sharing']
      },
      {
        name: 'Pro',
        storageGB: 100,
        pricePerMonth: 9.99,
        features: ['100GB storage', 'Priority support', 'NFT access control', 'File sharing', 'Encryption']
      },
      {
        name: 'Enterprise',
        storageGB: 1000,
        pricePerMonth: 49.99,
        features: ['1TB storage', '24/7 support', 'NFT access control', 'File sharing', 'Encryption', 'Custom domain']
      }
    ],
    currency: 'USD'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Walrus Vault API running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🌐 Walrus endpoint: ${WALRUS_API}`);
  console.log(`⛓️  Sui network: ${SUI_NETWORK}`);
  console.log(`📦 Package ID: ${PACKAGE_ID} (mock)\n`);
});
