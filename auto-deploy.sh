#!/bin/bash
# Auto-deploy Walrus Vault contract when Sui CLI ready

set -e

echo "🚀 WALRUS VAULT - AUTO DEPLOYMENT"
echo "=================================="
echo ""

# Check if sui binary exists
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found. Waiting for cargo install..."
    exit 1
fi

echo "✅ Sui CLI found: $(which sui)"
echo "📍 Version: $(sui --version)"
echo ""

# Navigate to project
cd /root/walrus-hackathon

# Configure Sui client
echo "🔧 Configuring Sui client..."
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443 || true
sui client switch --env testnet

# Import wallet
echo "🔑 Importing wallet..."
WALLET_ADDR=$(cat .wallet.json | jq -r '.address')
echo "Wallet: $WALLET_ADDR"

# Check balance
echo "💰 Checking balance..."
sui client gas

# Publish contract
echo ""
echo "📤 Publishing contract..."
PUBLISH_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

# Extract package ID
PACKAGE_ID=$(echo "$PUBLISH_OUTPUT" | jq -r '.objectChanges[] | select(.type=="published") | .packageId')

if [ -z "$PACKAGE_ID" ] || [ "$PACKAGE_ID" == "null" ]; then
    echo "❌ Failed to extract package ID"
    echo "$PUBLISH_OUTPUT" | jq .
    exit 1
fi

echo ""
echo "✅ CONTRACT DEPLOYED!"
echo "📦 Package ID: $PACKAGE_ID"
echo ""

# Update deployment.json
echo "📝 Updating deployment.json..."
cat > deployment.json <<EOF
{
  "status": "deployed",
  "packageId": "$PACKAGE_ID",
  "wallet": "$WALLET_ADDR",
  "network": "testnet",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "bytecodeSize": 645,
  "contract": {
    "name": "walrus_vault",
    "module": "vault",
    "structs": ["FileVault", "AccessNFT"],
    "functions": ["upload_file", "transfer_access", "has_access", "get_file_info"]
  }
}
EOF

echo "✅ deployment.json updated"
echo ""

# Update server.js with real package ID
echo "📝 Updating server.js..."
sed -i "s/0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/$PACKAGE_ID/g" server.js

echo "✅ server.js updated"
echo ""

# Restart server
echo "🔄 Restarting server..."
pkill -f "node server.js" || true
sleep 2
nohup node server.js > /dev/null 2>&1 &
echo "✅ Server restarted"
echo ""

# Git commit
echo "📦 Committing to git..."
git add deployment.json server.js
git commit -m "Deploy contract to Sui testnet - Package ID: $PACKAGE_ID"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================="
echo "Package ID: $PACKAGE_ID"
echo "Wallet: $WALLET_ADDR"
echo "Server: http://localhost:3000"
echo ""
echo "Next: Push to GitHub"
echo "  git push origin master"
echo ""
