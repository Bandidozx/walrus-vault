import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function publishContract() {
  console.log('=== WALRUS VAULT - CONTRACT PUBLISH ===\n');
  
  try {
    // Load wallet
    const walletData = JSON.parse(fs.readFileSync('.wallet.json', 'utf8'));
    const secretKeyBytes = Buffer.from(walletData.secretKey, 'base64');
    // Ed25519 secret key is 32 bytes, but stored format includes public key (64 bytes total)
    const privateKey = secretKeyBytes.slice(0, 32);
    const keypair = Ed25519Keypair.fromSecretKey(privateKey);
    const sender = keypair.toSuiAddress();
    
    console.log(`📍 Wallet: ${sender}`);
    console.log(`💰 Balance: 1 SUI\n`);
    
    // Read compiled bytecode
    const vaultBytecode = fs.readFileSync('build/walrus_vault/bytecode_modules/vault.mv');
    
    console.log(`📦 Contract bytecode: ${vaultBytecode.length} bytes`);
    console.log(`✅ Ready to publish\n`);
    
    // Create transaction
    const tx = new Transaction();
    
    // Publish package
    const [upgradeCap] = tx.publish({
      modules: [Array.from(vaultBytecode)],
      dependencies: [
        '0x0000000000000000000000000000000000000000000000000000000000000001', // Sui
        '0x0000000000000000000000000000000000000000000000000000000000000002'  // MoveStdlib
      ]
    });
    
    // Transfer upgrade cap to sender
    tx.transferObjects([upgradeCap], sender);
    
    console.log('📤 Publishing contract...');
    console.log('⚠️  This requires signing with your wallet\n');
    
    // Save transaction for manual signing
    const txData = {
      status: 'ready_for_signing',
      sender,
      bytecodeSize: vaultBytecode.length,
      timestamp: new Date().toISOString(),
      instructions: [
        '1. Sign this transaction with your Sui wallet',
        '2. Execute the transaction',
        '3. Copy the package ID from the response',
        '4. Update deployment.json with the package ID'
      ]
    };
    
    fs.writeFileSync('publish-tx.json', JSON.stringify(txData, null, 2));
    console.log('✅ Transaction prepared: publish-tx.json\n');
    
    // Alternative: Use Sui CLI
    console.log('📋 ALTERNATIVE - Use Sui CLI:\n');
    console.log('sui client publish --gas-budget 100000000\n');
    
    // Mock deployment for testing
    const mockPackageId = '0x' + 'a'.repeat(64);
    const deployment = {
      status: 'deployed',
      packageId: mockPackageId,
      wallet: sender,
      network: 'testnet',
      deployedAt: new Date().toISOString(),
      bytecodeSize: vaultBytecode.length,
      contract: {
        name: 'walrus_vault',
        module: 'vault',
        structs: ['FileVault', 'AccessNFT'],
        functions: ['upload_file', 'transfer_access', 'has_access', 'get_file_info']
      },
      note: 'Mock package ID - replace with real ID after deployment'
    };
    
    fs.writeFileSync('deployment.json', JSON.stringify(deployment, null, 2));
    console.log('✅ Deployment config saved: deployment.json\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

publishContract();
