import { useState, useEffect, useRef, useCallback } from 'react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

const matrixPlaylist: Track[] = [
  // Remote tracks
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
  { title: "The Ambient", artist: "Matrix Hub", url: "/music/the-ambient.mp3" }
];

export default function PersistentMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isLoopOn, setIsLoopOn] = useState(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [playedTracks, setPlayedTracks] = useState<number[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('matrixPlayerIndex');
    const savedShuffle = localStorage.getItem('matrixPlayerShuffle');
    const savedLoop = localStorage.getItem('matrixPlayerLoop');
    const savedAutoplay = localStorage.getItem('matrixPlayerAutoplay');
    const savedTime = localStorage.getItem('matrixPlayerTime');
    const savedMinimized = localStorage.getItem('matrixPlayerMinimized');

    if (savedIndex) setCurrentTrackIndex(parseInt(savedIndex, 10));
    if (savedShuffle) setIsShuffleOn(savedShuffle === 'true');
    if (savedLoop) setIsLoopOn(savedLoop === 'true');
    if (savedAutoplay) setIsAutoplayOn(savedAutoplay === 'true');
    if (savedMinimized) setIsMinimized(savedMinimized === 'true');

    // Restore playback position
    if (audioRef.current && savedTime) {
      audioRef.current.currentTime = parseFloat(savedTime);
    }
  }, []);

  // Save state to localStorage whenever it changes
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

  // Save playback position periodically (only when it changes meaningfully)
  useEffect(() => {
    let lastSavedTime = 0;

    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        const currentTime = audio.currentTime;

        // Only persist when the time has changed by at least 5 seconds
        if (Math.abs(currentTime - lastSavedTime) >= 5) {
          localStorage.setItem('matrixPlayerTime', currentTime.toString());
          lastSavedTime = currentTime;
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const getNextShuffledTrack = useCallback(() => {
    const unplayedTracks = matrixPlaylist
      .map((_, index) => index)
      .filter(index => !playedTracks.includes(index));

    if (unplayedTracks.length === 0) {
      // All tracks played, reset
      setPlayedTracks([]);
      return Math.floor(Math.random() * matrixPlaylist.length);
    }

    const randomIndex = Math.floor(Math.random() * unplayedTracks.length);
    const selectedTrack = unplayedTracks[randomIndex];
    setPlayedTracks([...playedTracks, selectedTrack]);
    return selectedTrack;
  }, [playedTracks]);

  const handlePrevious = useCallback(() => {
    let newIndex;
    if (isShuffleOn) {
      // In shuffle mode, go to a random previous track
      newIndex = Math.floor(Math.random() * matrixPlaylist.length);
    } else {
      newIndex = (currentTrackIndex - 1 + matrixPlaylist.length) % matrixPlaylist.length;
    }
    setCurrentTrackIndex(newIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isShuffleOn, isPlaying]);

  const handleNext = useCallback(() => {
    let newIndex;
    if (isShuffleOn) {
      newIndex = getNextShuffledTrack();
    } else {
      newIndex = (currentTrackIndex + 1) % matrixPlaylist.length;
    }
    setCurrentTrackIndex(newIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isShuffleOn, isPlaying, getNextShuffledTrack]);

  // Request media session for background playback
  useEffect(() => {
    if ('mediaSession' in navigator && audioRef.current) {
      const track = matrixPlaylist[currentTrackIndex];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'Matrix Hub Playlist',
        artwork: [
          { src: '/favicon.ico', sizes: '96x96', type: 'image/x-icon' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play().catch((error) => {
          console.error('Audio playback failed:', error);
        });
        setIsPlaying(true);
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }
  }, [currentTrackIndex, handlePrevious, handleNext]);

  const handleEnded = () => {
    if (isAutoplayOn && !isLoopOn) {
      handleNext();
    }
  };

  const currentTrack = matrixPlaylist[currentTrackIndex];

  return (
    <div className={`persistent-music-player ${isMinimized ? 'minimized' : ''}`}>
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

      <div className="player-header">
        <button
          className="minimize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? "Expand Player" : "Minimize Player"}
          aria-label={isMinimized ? "Expand Player" : "Minimize Player"}
        >
          {isMinimized ? '▼' : '▲'}
        </button>
        <span className="player-title">MATRIX MP3 PLAYER</span>
      </div>

      {!isMinimized && (
        <div className="player-content">
          <div className="now-playing">
            <div className="now-playing-label">Now Playing</div>
            <div className="track-title">{currentTrack.title}</div>
            <div className="track-artist">{currentTrack.artist}</div>
            <div className="track-number">Track {currentTrackIndex + 1} of {matrixPlaylist.length}</div>
          </div>

          <div className="player-controls">
            <button onClick={handlePrevious} title="Previous" aria-label="Previous track">⏮</button>
            {isPlaying ? (
              <button onClick={handlePause} title="Pause" aria-label="Pause">⏸</button>
            ) : (
              <button onClick={handlePlay} title="Play" aria-label="Play">▶</button>
            )}
            <button onClick={handleNext} title="Next" aria-label="Next track">⏭</button>
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

          <div className="player-status">
            Loop: {isLoopOn ? 'ON' : 'OFF'} | Shuffle: {isShuffleOn ? 'ON' : 'OFF'} | Autoplay: {isAutoplayOn ? 'ON' : 'OFF'}
          </div>

          <div className="music-notice">
            <strong>Music License:</strong> All tracks are royalty-free or licensed under Creative Commons.
            <br />
            <span style={{ fontSize: '0.85em' }}>
              Kevin MacLeod (incompetech.com): CC BY 4.0 |{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
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
          z-index: 1000;
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
        }

        .minimize-btn:hover {
          background: var(--theme-primary, #00ff00);
          color: black;
        }

        .player-title {
          font-size: 14px;
          color: var(--theme-primary, #00ff00);
          text-shadow: 0 0 8px var(--theme-glow, rgba(0, 255, 0, 0.5));
          flex: 1;
        }

        .player-content {
          padding: 16px;
          border-top: 1px solid var(--theme-border, rgba(0, 255, 0, 0.3));
        }

        .now-playing {
          background: rgba(0, 255, 65, 0.1);
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
      `}</style>
    </div>
  );
}
