#!/bin/bash

# 1. Ensure astro.config.mjs sets outDir to 'docs' (will overwrite if exists)
ASTRO_CONFIG="astro.config.mjs"
cat > "$ASTRO_CONFIG" <<EOF
import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: 'docs',
  // Add other config as needed
});
EOF
echo "Astro config updated to build output into /docs"

# 2. Clean docs/ directory (except .git if it exists)
find docs -mindepth 1 ! -regex '^docs/\.git\(/.*\)?' -delete
echo "Old docs content removed"

# 3. Install dependencies (skip if already done)
if [ ! -d "node_modules" ]; then
  npm install
fi

# 4. Build Astro site
npm run build

# 5. Confirm casino subpages exist in docs/ (basic check)
echo "Checking for playable casino games pages:"
for GAME in slots blackjack roulette; do
  if [ -f "docs/games/casino/$GAME/index.html" ]; then
    echo "  ✔ docs/games/casino/$GAME/index.html found!"
  else
    echo "  ✘ docs/games/casino/$GAME/index.html NOT FOUND – check your Astro page files!"
  fi
done

# 6. Prompt to commit and push changes
read -p "Do you want to git add, commit, and push to branch Hub1 now? (y/n): " yn
if [[ "$yn" =~ ^[Yy]$ ]]; then
  git add docs astro.config.mjs
  git commit -m "Build and deploy casino games to docs/ for GitHub Pages"
  git push origin Hub1
  echo "Changes pushed! Check your GitHub Pages site after a few minutes."
else
  echo "Build complete. Review docs/ and push when ready."
fi
