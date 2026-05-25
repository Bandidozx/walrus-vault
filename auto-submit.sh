#!/bin/bash
# Auto-submit to DeepSurge if API endpoint available

echo "🚀 ATTEMPTING AUTO-SUBMISSION TO DEEPSURGE"
echo "=========================================="
echo ""

# Try to find submission endpoint
echo "🔍 Scanning DeepSurge for submission API..."

# Check if there's a GraphQL or REST API
curl -s "https://www.deepsurge.xyz/api/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hackathons { id name } }"}' \
  2>&1 | head -20

echo ""
echo "📝 Manual submission required:"
echo "1. Visit: https://www.deepsurge.xyz"
echo "2. Sign in with GitHub/wallet"
echo "3. Find 'Walrus x Sui x Tatum Hackathon'"
echo "4. Click 'Submit Project'"
echo "5. Fill form with:"
echo "   - Project Name: Walrus Vault"
echo "   - GitHub: https://github.com/Bandidozx/walrus-vault"
echo "   - Description: Decentralized file storage with Sui blockchain"
echo "   - Team: Bandidozx"
echo ""
echo "✅ Project ready at: https://github.com/Bandidozx/walrus-vault"
echo "✅ Contract deployed: 0x5462289c83641e953ab158baee453bb71fd152111b0613a6bc47900fa5398278"
echo "✅ Deadline: June 6, 2026"
echo ""
