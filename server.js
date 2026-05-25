import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load wallet
const walletData = JSON.parse(fs.readFileSync('.wallet.json', 'utf8'));

// In-memory storage (MVP - will integrate Walrus later)
const fileStore = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    wallet: walletData.address,
    network: 'testnet',
    timestamp: new Date().toISOString()
  });
});

// Upload file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Simulate Walrus upload
    const walrusBlobId = `walrus_${fileHash}`;
    
    // Store file metadata
    const fileMetadata = {
      id: fileHash,
      walrusBlobId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      owner: walletData.address,
      localPath: req.file.path
    };
    
    fileStore.set(fileHash, fileMetadata);
    
    // Simulate NFT minting
    const nftId = `nft_${fileHash.substring(0, 16)}`;
    
    res.json({
      success: true,
      fileId: fileHash,
      walrusBlobId,
      nftId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      message: 'File uploaded successfully'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List files
app.get('/api/files', (req, res) => {
  const files = Array.from(fileStore.values()).map(f => ({
    id: f.id,
    fileName: f.fileName,
    fileSize: f.fileSize,
    uploadedAt: f.uploadedAt,
    walrusBlobId: f.walrusBlobId
  }));
  
  res.json({ files });
});

// Download file
app.get('/api/download/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const fileMetadata = fileStore.get(fileId);
  
  if (!fileMetadata) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(fileMetadata.localPath, fileMetadata.fileName);
});

// Get wallet info
app.get('/api/wallet', async (req, res) => {
  res.json({
    address: walletData.address,
    balance: '0',
    network: 'testnet'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n=== WALRUS VAULT API ===`);
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Wallet: ${walletData.address}`);
  console.log(`Status: MVP Running (Walrus + Sui integration pending)`);
});
