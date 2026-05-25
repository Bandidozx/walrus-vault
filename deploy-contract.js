import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walletData = JSON.parse(fs.readFileSync('.wallet.json', 'utf8'));
const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(walletData.secretKey, 'base64'));
const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

async function deployContract() {
  console.log('=== WALRUS VAULT - CONTRACT DEPLOYMENT ===\n');
  
  try {
    const sender = keypair.toSuiAddress();
    console.log(`📍 Wallet: ${sender}`);
    
    // Check balance
    const balance = await client.getBalance({ owner: sender });
    const suiBalance = parseInt(balance.totalBalance) / 1e9;
    console.log(`💰 Balance: ${suiBalance} SUI\n`);
    
    if (parseInt(balance.totalBalance) < 100000000) {
      console.log('❌ Insufficient balance (need 0.1 SUI minimum)');
      process.exit(1);
    }
    
    console.log('⚠️  IMPORTANT: Move contract deployment requires Sui CLI\n');
    console.log('📋 DEPLOYMENT STEPS:\n');
    
    console.log('1. Install Sui CLI:');
    console.log('   curl -fsSL https://sui-releases.s3.us-east-1.amazonaws.com/sui-linux-x86_64-latest.tar.gz | tar xz');
    console.log('   sudo mv sui /usr/local/bin/\n');
    
    console.log('2. Configure Sui CLI:');
    console.log('   sui client new-address ed25519');
    console.log('   sui client switch --address ' + sender + '\n');
    
    console.log('3. Request testnet SUI (if needed):');
    console.log('   curl --location --request POST "https://faucet.testnet.sui.io/gas"');
    console.log('   --header "Content-Type: application/json"');
    console.log('   --data-raw "{\\"FixedAmountRequest\\":{\\"recipient\\":\\"' + sender + '\\"}}"\\n');
    
    console.log('4. Deploy contract:');
    console.log('   cd /root/walrus-hackathon');
    console.log('   sui client publish --gas-budget 100000000\n');
    
    console.log('5. Copy package ID from output and update deployment.json\n');
    
    // Create deployment template
    const deploymentTemplate = {
      status: 'pending_cli_deployment',
      wallet: sender,
      network: 'testnet',
      balance: suiBalance,
      contract: {
        name: 'walrus_vault',
        module: 'vault',
        structs: ['FileVault', 'AccessNFT'],
        functions: ['upload_file', 'transfer_access', 'has_access', 'get_file_info']
      },
      steps: [
        'Install Sui CLI',
        'Configure wallet',
        'Request testnet SUI',
        'Run: sui client publish --gas-budget 100000000',
        'Copy package ID',
        'Update deployment.json'
      ],
      createdAt: new Date().toISOString(),
      packageId: null,
      deploymentTx: null
    };
    
    fs.writeFileSync('deployment.json', JSON.stringify(deploymentTemplate, null, 2));
    console.log('✅ Deployment template saved to deployment.json\n');
    
    // Alternative: Try to use sui-cli if available
    console.log('🔍 Checking for Sui CLI...');
    try {
      const { execSync } = await import('child_process');
      const result = execSync('which sui', { encoding: 'utf8' });
      console.log('✅ Sui CLI found at: ' + result.trim());
      console.log('\n🚀 Ready to deploy! Run: sui client publish --gas-budget 100000000\n');
    } catch (e) {
      console.log('⚠️  Sui CLI not found in PATH');
      console.log('📥 Download from: https://github.com/MystenLabs/sui/releases\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployContract();
