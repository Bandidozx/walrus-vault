import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import crypto from 'crypto';

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

// In-memory file registry
const fileRegistry = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get wallet info
app.get('/api/wallet', (req, res) => {
  try {
    const walletData = JSON.parse(fs.readFileSync('.wallet.json', 'utf8'));
    res.json({
      address: walletData.address,
      network: 'testnet',
      balance: '1 SUI'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file (local storage with Walrus mock)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const filePath = req.file.path;

    console.log(`Uploading ${fileName} (${fileSize} bytes)...`);

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
      console.log(`✓ Uploaded to Walrus: ${blobId}`);
    } catch (walrusError) {
      // Fallback: use local storage with mock blob ID
      blobId = `local_${crypto.randomBytes(16).toString('hex')}`;
      walrusUrl = `/api/download/${blobId}`;
      console.log(`⚠️  Walrus unavailable, using local storage: ${blobId}`);
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
      storage: blobId.startsWith('local_') ? 'local' : 'walrus'
    });

    console.log(`✓ File registered: ${fileId}`);

    res.json({
      success: true,
      fileId,
      fileName,
      fileSize,
      blobId,
      storage: blobId.startsWith('local_') ? 'local' : 'walrus',
      walrusUrl
    });

  } catch (error) {
    console.error('Upload error:', error.message);
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
    storage: f.storage
  }));
  
  res.json({
    count: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    files
  });
});

// Download file
app.get('/api/download/:fileId', (req, res) => {
  try {
    const file = fileRegistry.get(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`Downloading ${file.name}...`);

    if (file.storage === 'local') {
      // Serve from local storage
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.sendFile(file.localPath);
    } else {
      // Redirect to Walrus (would work if API available)
      res.redirect(file.walrusUrl);
    }

  } catch (error) {
    console.error('Download error:', error.message);
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
    blobId: file.blobId
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Walrus Vault API running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🌐 Walrus endpoint: ${WALRUS_API}\n`);
});
