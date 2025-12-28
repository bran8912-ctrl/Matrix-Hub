# Matrix Hub MP3 Player - User Guide

## Overview

The Matrix Hub MP3 Player is a full-featured music player integrated into the Matrix Hub platform. It supports local and remote MP3 files, advanced audio mixing, multi-track layering, and dynamic playlists.

## Features

### Core Playback Controls
- **Play/Pause**: Start and stop music playback
- **Previous/Next Track**: Navigate through the playlist
- **Shuffle Mode**: Randomize track order
- **Loop Mode**: Repeat current track or playlist
- **Autoplay**: Automatically play next track when current ends

### Advanced Features

#### 🎚️ Audio Mixer
The mixer provides professional-grade audio controls:
- **Volume**: Adjust output level (0-150%)
- **Pan**: Balance audio between left/right channels
- **Bass**: Boost or cut low frequencies (-12dB to +12dB)
- **Mid**: Adjust middle frequencies (-12dB to +12dB)
- **Treble**: Control high frequencies (-12dB to +12dB)
- **Mute**: Silence output without stopping playback

All mixer settings are saved automatically to your browser's local storage.

#### 🎵 Layers Tab
Play multiple tracks simultaneously for enhanced atmosphere:
- Load a secondary track as a "layer"
- Adjust layer volume independently
- Sync playback between main track and layer
- Perfect for mixing ambient sounds with music

#### 📋 Playlist Management
- View all available tracks (40+ songs)
- Click any track to play immediately
- See current track highlighted
- Tracks include both remote (Mixkit) and local files

### Track Sources

#### Remote Tracks (via Mixkit)
- 30+ royalty-free tracks from professional artists
- Alejandro Magaña, Eugenio Mininni, Andrew Ev, Arulo
- Genres: Cyberpunk, Techno, Ambient, Trance, Sci-Fi
- All tracks free for commercial use under Mixkit license

#### Local Tracks (Matrix Hub Originals)
Located in `/music/` directory:
- Dreamwalker
- Cipher (Kevin MacLeod - CC BY 4.0)
- Digital Ghost (Kevin MacLeod - CC BY 4.0)
- Sci-Fi Ambient 1 & 2 (Kevin MacLeod - CC BY 4.0)
- Night Owl (Broke For Free - CC)
- The Ambient (Ketsa - CC)
- Dark Sci-Fi Synth (Mixkit)
- Industrial Cyberpunk (TAVAmusic)

## Usage Instructions

### Basic Playback
1. The player loads automatically when you visit the Matrix Hub homepage
2. Click the **Play (▶)** button to start playback
3. Use **Previous (⏮)** and **Next (⏭)** to navigate tracks
4. Click **Pause (⏸)** to temporarily stop playback

### Using the Mixer
1. Click the **🎚 MIXER** button to reveal mixer controls
2. Adjust sliders to shape the sound:
   - Drag Volume right to increase loudness
   - Move Pan left/right for stereo positioning
   - Boost Bass for deeper low-end
   - Adjust Mid for vocal clarity
   - Increase Treble for brighter sound
3. Click **Reset** to return all controls to defaults
4. Use **Mute** for quick silence without losing settings

### Working with Layers
1. Click the **LAYERS** tab at the top of the player
2. Browse available layer tracks in the dropdown
3. Click **LOAD** to load a layer track
4. Use **▶ Play** to start the layer
5. Adjust **Layer Vol** slider to balance with main track
6. Click **⏱ SYNC BOTH** to start both tracks simultaneously
7. Use **⏹ STOP LAYER** to stop only the layer track

### Playlist Features
1. Click **📋 PLAYLIST** to show all tracks
2. Scroll through the complete track list
3. Click any track to play it immediately
4. Currently playing track is highlighted
5. Click **📋 PLAYLIST** again to hide the list

### Player Modes
- **Shuffle (🔀)**: Randomizes track order for variety
- **Loop (🔁)**: Repeats the current track indefinitely
- **Autoplay (🔊)**: Continues to next track automatically (default ON)

## Adding New Tracks

### Local MP3 Files
1. Place MP3 files in `/public/music/` directory
2. Update the playlist in `MusicPlayer.astro` or `docs/index.html`
3. Add track info: `{ title: "Song Name", artist: "Artist Name", url: "/music/filename.mp3" }`
4. Update `music/CREDITS.txt` or `music/LICENSE.md` with attribution
5. See [Music Submission Guide](music/SUBMIT_MUSIC.md) for requirements

### Requirements for New Tracks
- **Format**: MP3
- **Quality**: 192kbps or higher recommended
- **Filename**: lowercase-with-dashes.mp3
- **License**: Must be royalty-free or Creative Commons
- **Attribution**: Required documentation in LICENSE.md or CREDITS.txt

## Technical Details

### Audio Processing
- Uses Web Audio API for advanced mixing
- Cross-origin resource sharing (CORS) enabled for remote tracks
- Real-time audio analysis for visual effects
- EQ filters for bass/mid/treble control
- Stereo panner for left/right balance

### Storage
- Player settings saved to browser localStorage
- Remembers mixer settings between sessions
- Autoplay preference persists
- Theme-aware color scheme

### Browser Compatibility
- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile support via responsive design
- Touch-friendly controls

## Troubleshooting

### No Sound
- Check browser autoplay policy (click play overlay if shown)
- Verify browser audio isn't muted
- Check mixer volume is not at 0
- Ensure Mute button is not active

### Tracks Won't Load
- Check internet connection for remote tracks
- Verify local MP3 files exist in `/public/music/`
- Clear browser cache and reload
- Check browser console for CORS errors

### Mixer Not Working
- Refresh page to reinitialize Web Audio context
- Check that you clicked Play at least once (required for audio context)
- Try resetting mixer to defaults
- Disable browser extensions that might block Web Audio

### Layer Sync Issues
- Stop and restart both tracks using SYNC BOTH
- Check that both audio elements have loaded
- Verify layer track URL is accessible
- Try a different layer track

## Licensing & Attribution

### Mixkit Tracks
All remote tracks from Mixkit are 100% free under the [Mixkit Free License](https://mixkit.co/license/):
- ✅ Free for commercial and personal use
- ✅ No attribution required
- ✅ Unlimited downloads
- ✅ Edit and customize as needed

### Creative Commons Tracks
Local tracks by Kevin MacLeod, Ketsa, and Broke For Free:
- Licensed under Creative Commons (CC BY 4.0 or similar)
- **Attribution Required**: "Music by [Artist Name], licensed under CC BY 4.0"
- See [music/LICENSE.md](music/LICENSE.md) for full details

### Contributing Music
Want to add your music to Matrix Hub?
- Review [music/SUBMIT_MUSIC.md](music/SUBMIT_MUSIC.md)
- Ensure proper licensing
- Include all required attribution
- Submit via GitHub pull request

## Integration Notes

### For Developers
The MP3 player is implemented in two versions:

1. **Astro Component** (`src/components/MusicPlayer.astro`)
   - Used in the main Astro-generated site
   - Simplified version with core features
   - Integrated with Panel component system

2. **Standalone Version** (`docs/index.html`)
   - Full-featured version with all advanced controls
   - Self-contained HTML/CSS/JS
   - Includes mixer, layers, playlist, and all features

Both versions share:
- Same track library
- Same music files in `/public/music/`
- Same licensing and documentation
- Theme-aware styling

## Support & Feedback

For issues, suggestions, or contributions:
- Open an issue on [GitHub](https://github.com/bran8912-ctrl/Matrix-Hub.org)
- Join the [Telegram Channel](https://t.me/matrixhuborg)
- See [CONTRIBUTORS.md](CONTRIBUTORS.md) for contributor recognition

---

**Matrix Hub** - Signal over noise.
