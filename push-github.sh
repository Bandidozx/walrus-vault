#!/bin/bash
# Push Walrus Vault to GitHub

set -e

echo "📤 PUSHING TO GITHUB"
echo "===================="
echo ""

cd /root/walrus-hackathon

# Check git status
echo "📊 Git status:"
git status --short
echo ""

# Add all changes
echo "📝 Staging changes..."
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "✅ No new changes to commit"
else
    echo "📝 Committing..."
    git commit -m "Final: 100% complete - contract deployed, all endpoints tested, ready for submission"
fi

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin master

echo ""
echo "✅ PUSHED TO GITHUB!"
echo "===================="
echo "Repo: https://github.com/Bandidozx/walrus-vault"
echo ""
