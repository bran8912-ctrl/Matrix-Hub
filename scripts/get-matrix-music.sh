#!/usr/bin/env bash
set -e

echo "Initializing Matrix-Hub music assets…"

mkdir -p public/music

echo "Downloading Cipher…"
curl -L -o public/music/cipher.mp3 \
"https://incompetech.com/music/royalty-free/mp3/Cipher.mp3"

echo "Downloading Digital Ghost…"
curl -L -o public/music/digital-ghost.mp3 \
"https://incompetech.com/music/royalty-free/mp3/Digital%20Ghost.mp3"

echo "Downloading The Ambient…"
curl -L -o public/music/the-ambient.mp3 \
"https://freemusicarchive.org/track/the-ambient/download/"

echo "Downloading Night Owl…"
curl -L -o public/music/night-owl.mp3 \
"https://freemusicarchive.org/track/night-owl/download/"

echo "Downloading Dark Sci-Fi Synth…"
curl -L -o public/music/dark-sci-fi-synth.mp3 \
"https://assets.mixkit.co/music/preview/mixkit-dark-sci-fi-synth-948.mp3"

echo "Creating credits file…"
cat <<EOF > public/music/CREDITS.txt
Music Credits – Matrix Hub

Cipher – Kevin MacLeod (incompetech.com)
Digital Ghost – Kevin MacLeod (incompetech.com)
The Ambient – Ketsa (freemusicarchive.org)
Night Owl – Broke For Free (freemusicarchive.org)
Dark Sci-Fi Synth – Mixkit (mixkit.co)

All tracks used under their respective royalty-free licenses.
EOF

echo "Creating playlist…"
cat <<EOF > public/music/matrix-hub.m3u
cipher.mp3
digital-ghost.mp3
the-ambient.mp3
night-owl.mp3
dark-sci-fi-synth.mp3
EOF

echo "✔ Music assets installed successfully."
