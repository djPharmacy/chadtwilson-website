#!/bin/bash
# Push chadtwilson-website to GitHub
set -e

cd "$(dirname "$0")"

# Clean up stale lock if present
rm -f .git/index.lock

# Stage and commit
git add -A
git commit -m "Initial commit: personal website

Static site with index.html, CSS, JS, and profile data.
Deployed to SiteGround at chadtwilson.com."

# Create GitHub repo and push
if ! git remote | grep -q origin; then
  gh repo create chadtwilson-website --public --source=. --remote=origin --push
else
  git push -u origin main
fi

echo ""
echo "✅ Pushed to GitHub!"
echo "🔗 https://github.com/$(gh api user -q .login)/chadtwilson-website"

# Clean up this script
rm -f github-push.sh
