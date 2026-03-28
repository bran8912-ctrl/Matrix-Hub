import { useState, useEffect, useRef, useCallback } from 'react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

const matrixPlaylist: Track[] = [
  // Remote Mixkit tracks
  { title: "Cyberpunk City", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/140/140.mp3" },
  { title: "Deep Techno Ambience", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/134/134.mp3" },
  { title: "Techno Fest Vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/124/124.mp3" },
  { title: "Hazy After Hours", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/132/132.mp3" },
  { title: "Minimal Techno 01", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/162/162.mp3" },
  { title: "Minimal Emotion", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/160/160.mp3" },
  { title: "Machine Drum Vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/117/117.mp3" },
  { title: "Dub Techno Groove", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/133/133.mp3" },
  { title: "Trance Party", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/166/166.mp3" },
  { title: "Infected Vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/157/157.mp3" },
  { title: "Goa Trance Mantra", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/137/137.mp3" },
  { title: "Tech House vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/130/130.mp3" },
  { title: "Kodama Night Town", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/114/114.mp3" },
  { title: "Digital Clouds", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/175/175.mp3" },
  { title: "Slow Rain", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/122/122.mp3" },
  { title: "Sun in Your Eyes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/131/131.mp3" },
  { title: "Better Times are Coming", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/173/173.mp3" },
  { title: "Lonerism", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/159/159.mp3" },
  { title: "B.O.R.N", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/620/620.mp3" },
  { title: "Deep Urban", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/623/623.mp3" },
  { title: "Feedback Dreams", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/588/588.mp3" },
  { title: "Fragments Of Bangkok", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/625/625.mp3" },
  { title: "Skyline", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/601/601.mp3" },
  { title: "Silent Descent", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/614/614.mp3" },
  { title: "Echoes", artist: "Andrew Ev", url: "https://assets.mixkit.co/music/188/188.mp3" },
  { title: "Sci-Fi Game", artist: "Arulo", url: "https://assets.mixkit.co/music/395/395.mp3" },
  { title: "Sci-Fi Score", artist: "Arulo", url: "https://assets.mixkit.co/music/464/464.mp3" },
  { title: "Neon Skyline", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/626/626.mp3" },
  { title: "Digital Mirage", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/627/627.mp3" },
  { title: "Night Drive", artist: "Arulo", url: "https://assets.mixkit.co/music/396/396.mp3" },
  { title: "Retro Future", artist: "Arulo", url: "https://assets.mixkit.co/music/397/397.mp3" },
  { title: "Dream Sequence", artist: "Andrew Ev", url: "https://assets.mixkit.co/music/189/189.mp3" },
  // Local music files
  { title: "Dreamwalker", artist: "Matrix Hub", url: "/music/dreamwalker.mp3" },
  { title: "Cipher", artist: "Matrix Hub", url: "/music/cipher.mp3" },
  { title: "Digital Ghost", artist: "Matrix Hub", url: "/music/digital-ghost.mp3" },
  { title: "Sci-Fi Ambient 2", artist: "Matrix Hub", url: "/music/sci-fi-ambient-2.mp3" },
  { title: "Night Owl", artist: "Matrix Hub", url: "/music/night-owl.mp3" },
  { title: "Dark Sci-Fi Synth", artist: "Matrix Hub", url: "/music/dark-sci-fi-synth.mp3" },
  { title: "Industrial Cyberpunk", artist: "Matrix Hub", url: "/music/industrial-cyberpunk.mp3" },
  { title: "Sci-Fi Ambient 1", artist: "Matrix Hub", url: "/music/sci-fi-ambient-1.mp3" },
  { title: "The Ambient", artist: "Matrix Hub", url: "/music/the-ambient.mp3" },
];

export default function PersistentMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isLoopOn, setIsLoopOn] = useState(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [playedTracks, setPlayedTracks] = useState<number[]>([]);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Load all persisted state on mount
  useEffect(() => {
    const savedEnabled = localStorage.getItem('matrixPlayerEnabled');
    const savedIndex = localStorage.getItem('matrixPlayerIndex');
    const savedShuffle = localStorage.getItem('matrixPlayerShuffle');
    const savedLoop = localStorage.getItem('matrixPlayerLoop');
    const savedAutoplay = localStorage.getItem('matrixPlayerAutoplay');
    const savedMinimized = localStorage.getItem('matrixPlayerMinimized');
    const savedVolume = localStorage.getItem('matrixPlayerVolume');
    const savedMuted = localStorage.getItem('matrixPlayerMuted');

    if (savedEnabled) setIsEnabled(savedEnabled === 'true');
    if (savedIndex !== null) {
      const parsedIndex = parseInt(savedIndex, 10);
      if (!isNaN(parsedIndex)) setCurrentTrackIndex(parsedIndex);
    }
    if (savedShuffle) setIsShuffleOn(savedShuffle === 'true');
    if (savedLoop) setIsLoopOn(savedLoop === 'true');
    if (savedAutoplay) setIsAutoplayOn(savedAutoplay === 'true');
    if (savedMinimized) setIsMinimized(savedMinimized === 'true');
    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === 'true');
  }, []);

  // Sync audio element volume/mute whenever those states change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Persist each state value individually
  useEffect(() => {
    localStorage.setItem('matrixPlayerEnabled', isEnabled.toString());
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('matrixPlayerIndex', currentTrackIndex.toString());
  }, [currentTrackIndex]);

  useEffect(() => {
    localStorage.setItem('matrixPlayerShuffle', isShuffleOn.toString());
  }, [isShuffleOn]);

  useEffect(() => {
    localStorage.setItem('matrixPlayerLoop', isLoopOn.toString());
  }, [isLoopOn]);

  useEffect(() => {
    localStorage.setItem('matrixPlayerAutoplay', isAutoplayOn.toString());
  }, [isAutoplayOn]);

  useEffect(() => {
    localStorage.setItem('matrixPlayerMinimized', isMinimized.toString());
  }, [isMinimized]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      localStorage.setItem('matrixPlayerVolume', volume.toString());
    }, 150);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('matrixPlayerMuted', isMuted.toString());
  }, [isMuted]);

  // Restore saved playback position after track loads
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const savedTime = localStorage.getItem('matrixPlayerTime');

    const onLoaded = () => {
      if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
      }
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    return () => audio.removeEventListener('loadedmetadata', onLoaded);
  }, [currentTrackIndex]);

  // Save playback position every 5 seconds of play time
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        localStorage.setItem('matrixPlayerTime', audio.currentTime.toString());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API: set up AudioContext + AnalyserNode on first enable
  const setupAudioContext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioContextRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;

      // Animate --matrix-bass from low-frequency bins each frame
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(frequencyData);
        // Average the first 8 bins (bass frequencies)
        let bassSum = 0;
        for (let binIndex = 0; binIndex < 8; binIndex++) bassSum += frequencyData[binIndex];
        const bassAvg = bassSum / 8 / 255;
        document.documentElement.style.setProperty('--matrix-bass', bassAvg.toFixed(3));
        animFrameRef.current = requestAnimationFrame(tick);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    } catch (err) {
      console.error('Web Audio API setup failed:', err);
    }
  }, []);

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      audioContextRef.current?.close().catch(() => {});
    };
  }, []);

  // Resume AudioContext on user interaction (browsers require it)
  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
  }, []);

  const handleEnable = useCallback(() => {
    setIsEnabled(true);
    setupAudioContext();
    const audio = audioRef.current;
    if (audio) {
      resumeAudioContext();
      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [setupAudioContext, resumeAudioContext]);

  const handlePlay = useCallback(() => {
    setupAudioContext();
    resumeAudioContext();
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [setupAudioContext, resumeAudioContext]);

  const handlePause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const getNextShuffledTrack = useCallback(
    () => {
      // Use functional update exclusively so history is never stale on rapid clicks.
      // We compute the return value first using the most recent playedTracks ref value,
      // then commit via functional setState.
      let selected = 0;

      setPlayedTracks((prevPlayed) => {
        // Treat the current track as "played" in this shuffle step
        const playedSet = new Set<number>(prevPlayed);
        playedSet.add(currentTrackIndex);

        const unplayed = matrixPlaylist
          .map((_, trackIndex) => trackIndex)
          .filter((trackIndex) => !playedSet.has(trackIndex));

        if (unplayed.length === 0) {
          // All tracks have played — start a new shuffle cycle.
          // Record both currentTrackIndex and the new selection so neither can repeat immediately.
          selected = Math.floor(Math.random() * matrixPlaylist.length);
          return Array.from(new Set([currentTrackIndex, selected]));
        }

        selected = unplayed[Math.floor(Math.random() * unplayed.length)];
        playedSet.add(selected);
        return Array.from(playedSet);
      });

      return selected;
    },
    [currentTrackIndex]
  );

  const handlePrevious = useCallback(() => {
    const newIndex = isShuffleOn
      ? getNextShuffledTrack()
      : (currentTrackIndex - 1 + matrixPlaylist.length) % matrixPlaylist.length;

    // Reset saved position when changing tracks
    localStorage.removeItem('matrixPlayerTime');
    setCurrentTrackIndex(newIndex);

    if (isPlaying) {
      // play() is triggered via the onLoadedMetadata flow; request it after state update
      setTimeout(() => {
        audioRef.current?.play().catch((err) => {
          console.error('Audio playback failed:', err);
          setIsPlaying(false);
        });
      }, 0);
    }
  }, [currentTrackIndex, isShuffleOn, isPlaying, getNextShuffledTrack]);

  const handleNext = useCallback(() => {
    const newIndex = isShuffleOn
      ? getNextShuffledTrack()
      : (currentTrackIndex + 1) % matrixPlaylist.length;

    localStorage.removeItem('matrixPlayerTime');
    setCurrentTrackIndex(newIndex);

    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch((err) => {
          console.error('Audio playback failed:', err);
          setIsPlaying(false);
        });
      }, 0);
    }
  }, [currentTrackIndex, isShuffleOn, isPlaying, getNextShuffledTrack]);

  const handleEnded = useCallback(() => {
    if (isAutoplayOn && !isLoopOn) {
      // Autoplay is on and not looping: advance to the next track, keep isPlaying true
      handleNext();
    } else if (!isLoopOn) {
      // Autoplay is off and not looping: playback has stopped, reflect that in state
      setIsPlaying(false);
    }
  }, [isAutoplayOn, isLoopOn, handleNext]);

  // Media Session API for background / lock-screen controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const track = matrixPlaylist[currentTrackIndex];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: 'Matrix Hub Playlist',
      artwork: [{ src: '/favicon.ico', sizes: '96x96', type: 'image/x-icon' }],
    });

    // Route through handleEnable/handlePlay so AudioContext is initialised/resumed
    // and isEnabled is set correctly, keeping behaviour consistent with in-UI controls.
    navigator.mediaSession.setActionHandler('play', () => {
      if (!isEnabled) {
        handleEnable();
      } else {
        handlePlay();
      }
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
    navigator.mediaSession.setActionHandler('nexttrack', handleNext);
  }, [currentTrackIndex, isEnabled, handleEnable, handlePlay, handlePrevious, handleNext]);

  const currentTrack = matrixPlaylist[currentTrackIndex];

  return (
    <div className={`persistent-music-player${isMinimized ? ' minimized' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="auto"
        crossOrigin="anonymous"
        loop={isLoopOn}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Header — always visible */}
      <div className="player-header">
        <button
          className="minimize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? 'Expand Player' : 'Minimize Player'}
          aria-label={isMinimized ? 'Expand Player' : 'Minimize Player'}
        >
          {isMinimized ? '▼' : '▲'}
        </button>
        <span className="player-title">MATRIX MP3 PLAYER</span>

        {/* Enable Music button — always visible for autoplay policy compliance */}
        {!isEnabled ? (
          <button
            className="enable-btn"
            onClick={handleEnable}
            aria-label="Enable music playback"
          >
            ▶ ENABLE MUSIC
          </button>
        ) : (
          <span className="now-playing-mini">
            {isPlaying ? '♫ ' : '⏸ '}
            {currentTrack.title}
          </span>
        )}
      </div>

      {/* Expanded content */}
      {!isMinimized && (
        <div className="player-content">
          <div className="now-playing">
            <div className="now-playing-label">Now Playing</div>
            <div className="track-title">{currentTrack.title}</div>
            <div className="track-artist">{currentTrack.artist}</div>
            <div className="track-number">
              Track {currentTrackIndex + 1} of {matrixPlaylist.length}
            </div>
          </div>

          <div className="player-controls">
            <button onClick={handlePrevious} title="Previous" aria-label="Previous track">
              ⏮
            </button>
            {isPlaying ? (
              <button onClick={handlePause} title="Pause" aria-label="Pause">
                ⏸
              </button>
            ) : (
              <button onClick={handlePlay} title="Play" aria-label="Play">
                ▶
              </button>
            )}
            <button onClick={handleNext} title="Next" aria-label="Next track">
              ⏭
            </button>
          </div>

          <div className="secondary-controls">
            <button
              className={isShuffleOn ? 'active' : ''}
              onClick={() => setIsShuffleOn(!isShuffleOn)}
              title="Shuffle"
              aria-label="Toggle shuffle"
              aria-pressed={isShuffleOn}
            >
              🔀
            </button>
            <button
              className={isLoopOn ? 'active' : ''}
              onClick={() => setIsLoopOn(!isLoopOn)}
              title="Loop"
              aria-label="Toggle loop"
              aria-pressed={isLoopOn}
            >
              🔁
            </button>
            <button
              className={isAutoplayOn ? 'active' : ''}
              onClick={() => setIsAutoplayOn(!isAutoplayOn)}
              title="Autoplay"
              aria-label="Toggle autoplay"
              aria-pressed={isAutoplayOn}
            >
              🔊
            </button>
          </div>

          {/* Volume and mute controls */}
          <div className="volume-controls">
            <button
              className={isMuted ? 'active' : ''}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              aria-pressed={isMuted}
            >
              {isMuted ? '🔇' : '🔉'}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (isMuted && newVolume > 0) setIsMuted(false);
              }}
              aria-label="Volume"
              className="volume-slider"
            />
            <span className="volume-display">{isMuted ? '0' : Math.round(volume * 100)}%</span>
          </div>

          <div className="player-status">
            Loop: {isLoopOn ? 'ON' : 'OFF'} | Shuffle: {isShuffleOn ? 'ON' : 'OFF'} | Autoplay:{' '}
            {isAutoplayOn ? 'ON' : 'OFF'}
          </div>

          <div className="music-notice">
            <strong>Music License:</strong> All tracks are royalty-free or licensed under Creative
            Commons.
            <br />
            <span style={{ fontSize: '0.85em' }}>
              Kevin MacLeod (incompetech.com): CC BY 4.0 |{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://creativecommons.org/licenses/by/4.0/
              </a>
            </span>
          </div>
        </div>
      )}

      <style>{`
        .persistent-music-player {
          position: sticky;
          top: 0;
          z-index: var(--z-index-music-player, 1001);
          background: var(--theme-bg-panel, rgba(0, 20, 0, 0.95));
          border-bottom: 2px solid var(--theme-primary, #00ff00);
          box-shadow: 0 4px 20px var(--theme-glow, rgba(0, 255, 0, 0.3));
          font-family: 'Courier New', monospace;
          backdrop-filter: blur(10px);
        }

        .player-header {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .minimize-btn {
          background: transparent;
          color: var(--theme-primary, #00ff00);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 4px 10px;
          cursor: pointer;
          font-family: inherit;
          border-radius: 4px;
          transition: 0.2s;
          font-size: 12px;
          flex-shrink: 0;
        }

        .minimize-btn:hover {
          background: var(--theme-primary, #00ff00);
          color: black;
        }

        .player-title {
          font-size: 14px;
          color: var(--theme-primary, #00ff00);
          text-shadow: 0 0 8px var(--theme-glow, rgba(0, 255, 0, 0.5));
          flex-shrink: 0;
        }

        .enable-btn {
          background: var(--theme-primary, #00ff00);
          color: black;
          border: none;
          padding: 5px 14px;
          cursor: pointer;
          font-family: inherit;
          border-radius: 4px;
          transition: 0.2s;
          font-size: 12px;
          font-weight: bold;
          flex-shrink: 0;
          animation: pulse-glow 1.8s ease-in-out infinite;
        }

        .enable-btn:hover {
          opacity: 0.85;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 6px var(--theme-glow, rgba(0, 255, 0, 0.6)); }
          50% { box-shadow: 0 0 18px var(--theme-glow, rgba(0, 255, 0, 0.9)); }
        }

        .now-playing-mini {
          font-size: 12px;
          color: var(--theme-secondary, #00ffff);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .player-content {
          padding: 16px;
          border-top: 1px solid var(--theme-border, rgba(0, 255, 0, 0.3));
        }

        .now-playing {
          background: rgba(0, 255, 65, 0.08);
          border: 1px solid var(--theme-border, #00ff00);
          border-radius: 5px;
          padding: 12px;
          margin-bottom: 15px;
          text-align: center;
        }

        .now-playing-label {
          font-size: 10px;
          color: var(--theme-primary, #00ff00);
          margin-bottom: 5px;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .track-title {
          font-size: 14px;
          color: var(--theme-primary, #00ff00);
          font-weight: bold;
          margin-bottom: 3px;
          text-shadow: 0 0 5px var(--theme-glow, rgba(0, 255, 0, 0.5));
        }

        .track-artist {
          font-size: 12px;
          color: var(--theme-secondary, #00ffff);
        }

        .track-number {
          font-size: 11px;
          color: var(--theme-text, #00ffff);
          margin-top: 5px;
          opacity: 0.7;
        }

        .player-controls {
          text-align: center;
          margin-bottom: 10px;
        }

        .player-controls button {
          background: black;
          color: var(--theme-primary, #00ff00);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 10px 14px;
          margin: 4px;
          cursor: pointer;
          font-family: inherit;
          border-radius: 5px;
          transition: 0.2s;
          font-size: 14px;
        }

        .player-controls button:hover {
          background: var(--theme-primary, #00ff00);
          color: black;
        }

        .secondary-controls {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .secondary-controls button {
          background: black;
          color: var(--theme-primary, #00ff00);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 6px 10px;
          cursor: pointer;
          font-family: inherit;
          border-radius: 5px;
          transition: 0.2s;
          font-size: 12px;
        }

        .secondary-controls button:hover,
        .secondary-controls button.active {
          background: var(--theme-primary, #00ff00);
          color: black;
        }

        .volume-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding: 0 4px;
        }

        .volume-controls button {
          background: black;
          color: var(--theme-primary, #00ff00);
          border: 1px solid var(--theme-border, #00ff00);
          padding: 5px 8px;
          cursor: pointer;
          font-family: inherit;
          border-radius: 5px;
          transition: 0.2s;
          font-size: 14px;
          flex-shrink: 0;
        }

        .volume-controls button:hover,
        .volume-controls button.active {
          background: var(--theme-primary, #00ff00);
          color: black;
        }

        .volume-slider {
          flex: 1;
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: var(--theme-border, #00ff00);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          opacity: 0.8;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: var(--theme-primary, #00ff00);
          border-radius: 50%;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--theme-primary, #00ff00);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .volume-display {
          font-size: 11px;
          color: var(--theme-text, #00ffff);
          min-width: 32px;
          text-align: right;
        }

        .player-status {
          text-align: center;
          font-size: 11px;
          color: var(--theme-text, #00ffff);
          opacity: 0.7;
          margin-bottom: 12px;
        }

        .music-notice {
          margin-top: 12px;
          font-size: 0.85em;
          color: var(--theme-secondary, #00ffff);
          background: rgba(0, 0, 0, 0.3);
          border-radius: 6px;
          padding: 8px;
          text-align: center;
        }

        .music-notice a {
          color: var(--theme-primary, #00ff00);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .player-header {
            padding: 6px 12px;
            gap: 8px;
          }

          .player-title {
            font-size: 12px;
          }

          .player-content {
            padding: 12px;
          }

          .player-controls button {
            padding: 8px 12px;
            font-size: 12px;
          }

          .enable-btn {
            font-size: 11px;
            padding: 4px 10px;
          }
        }
      `}</style>
    </div>
  );
}