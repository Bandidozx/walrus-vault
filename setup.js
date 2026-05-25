const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const fs = require('fs');
const path = require('path');

const WALLET_FILE = path.join(__dirname, '.wallet.json');

async function setupWallet() {
  console.log('=== WALRUS HACKATHON - WALLET SETUP ===\n');

  let keypair;
  let address;

  // Check if wallet exists
  if (fs.existsSync(WALLET_FILE)) {
    console.log('✓ Wallet found, loading...');
    const walletData = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'));
    keypair = Ed25519Keypair.fromSecretKey(Buffer.from(walletData.secretKey, 'base64'));
    address = keypair.toSuiAddress();
  } else {
    console.log('Creating new Sui wallet...');
    keypair = new Ed25519Keypair();
    address = keypair.toSuiAddress();

    // Save wallet
    const walletData = {
      address,
      publicKey: keypair.getPublicKey().toBase64(),
      secretKey: Buffer.from(keypair.getSecretKey()).toString('base64'),
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(WALLET_FILE, JSON.stringify(walletData, null, 2));
    fs.chmodSync(WALLET_FILE, 0o600);
    console.log('✓ Wallet created and saved');
  }

  console.log(`\nWallet Address: ${address}`);
  console.log(`Public Key: ${keypair.getPublicKey().toBase64()}`);

  // Save to .env
  const envContent = `SUI_WALLET_ADDRESS=${address}
SUI_NETWORK=testnet
WALRUS_NETWORK=testnet
TATUM_API_KEY=your_tatum_api_key_here
`;

  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('\n✓ .env file created');
  console.log('\nNext steps:');
  console.log('1. Get testnet SUI from faucet: https://faucet.testnet.sui.io');
  console.log('2. Register on DeepSurge: https://www.deepsurge.xyz');
  console.log('3. Start building the project');

  return { keypair, address };
}

setupWallet().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
