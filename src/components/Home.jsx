import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewMode, setViewMode] = useState("albums"); // 'albums' or 'songs'
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const audioRef = useRef(new Audio());
  const progressRef = useRef(null);
  const location = useLocation();

  // Organize songs into albums by artist
  useEffect(() => {
    if (songs.length === 0) return;

    const albumsMap = {};
    songs.forEach(song => {
      const artist = song.artist || "Unknown Artist";
      const albumTitle = song.album || "Unknown Album";

      if (!albumsMap[artist]) {
        albumsMap[artist] = {};
      }

      if (!albumsMap[artist][albumTitle]) {
        albumsMap[artist][albumTitle] = {
          songs: [],
          thumbnail: song.coverImage || song.imageUrl || "https://via.placeholder.com/150"
        };
      }

      albumsMap[artist][albumTitle].songs.push(song);
    });

    // Convert to array format
    const albumsArray = [];
    Object.keys(albumsMap).forEach(artist => {
      Object.keys(albumsMap[artist]).forEach(albumTitle => {
        albumsArray.push({
          artist,
          title: albumTitle,
          thumbnail: albumsMap[artist][albumTitle].thumbnail,
          songs: albumsMap[artist][albumTitle].songs
        });
      });
    });

    setAlbums(albumsArray);
  }, [songs]);

  // Fetch songs
  useEffect(() => {
    fetch("https://sachusicplayer.onrender.com/api/songs")
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Handle search from navbar
  useEffect(() => {
    if (songs.length === 0) return;

    const queryParams = new URLSearchParams(location.search);
    const songIdFromSearch = queryParams.get("song");

    if (songIdFromSearch) {
      const index = songs.findIndex(song => song._id === songIdFromSearch);
      if (index !== -1) {
        playSong(index);
        setViewMode("songs");
      }
    }
  }, [songs, location.search]);

  // Audio player logic
  useEffect(() => {
    const audio = audioRef.current;
    if (currentSongIndex === null || songs.length === 0) return;

    const song = songs[currentSongIndex];
    const songUrl = song.songUrl || song.audioUrl;
    if (!songUrl) return;

    const handleCanPlay = () => {
      setDuration(audio.duration);
      setLoading(false);
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (progressRef.current) {
        progressRef.current.value = (audio.currentTime / audio.duration) * 100;
      }
    };

    setLoading(true);
    audio.pause();
    audio.src = songUrl;
    audio.volume = 0.7; // Fixed volume

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', playNext);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', playNext);
    };
  }, [currentSongIndex, songs]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const playNext = () => {
    setCurrentSongIndex(prev => (prev + 1) % songs.length);
  };

  const playPrevious = () => {
    setCurrentSongIndex(prev => (prev - 1 + songs.length) % songs.length);
  };

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const toggleAlbum = (albumTitle) => {
    setExpandedAlbum(expandedAlbum === albumTitle ? null : albumTitle);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="music-player">
      {/* View Mode Toggle */}
      <div className="view-toggle">
        <button 
          onClick={() => setViewMode("albums")} 
          className={viewMode === "albums" ? "active" : ""}
        >
          Albums
        </button>
        <button 
          onClick={() => setViewMode("songs")} 
          className={viewMode === "songs" ? "active" : ""}
        >
          All Songs
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading music...</p>
        </div>
      )}

      {/* Albums View */}
      {!loading && viewMode === "albums" && (
        <div className="albums-grid">
          {albums.map((album, index) => (
            <div key={`${album.artist}-${album.title}-${index}`} className="album-card">
              <div className="album-header" onClick={() => toggleAlbum(album.title)}>
                <img 
                  src={album.thumbnail} 
                  alt={album.title} 
                  className="album-thumbnail"
                  onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                />
                <div className="album-info">
                  <h3>{album.title}</h3>
                  <p>{album.artist}</p>
                  <span>{album.songs.length} songs</span>
                </div>
                <button className="toggle-button">
                  {expandedAlbum === album.title ? "▲" : "▼"}
                </button>
              </div>
              
              {expandedAlbum === album.title && (
                <div className="album-songs">
                  {album.songs.map((song, songIndex) => {
                    const globalIndex = songs.findIndex(s => s._id === song._id);
                    return (
                      <div 
                        key={song._id}
                        className={`song-item ${currentSongIndex === globalIndex ? 'active' : ''}`}
                        onClick={() => playSong(globalIndex)}
                      >
                        <span className="song-number">{songIndex + 1}.</span>
                        <div className="song-details">
                          <p className="song-title">{song.title}</p>
                          <p className="song-duration">{formatTime(song.duration)}</p>
                        </div>
                        {currentSongIndex === globalIndex && isPlaying && (
                          <div className="playing-indicator">
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* All Songs View */}
      {!loading && viewMode === "songs" && (
        <div className="songs-list">
          {songs.map((song, index) => (
            <div 
              key={song._id}
              className={`song-item ${currentSongIndex === index ? 'active' : ''}`}
              onClick={() => playSong(index)}
            >
              <img 
                src={song.coverImage || song.imageUrl || "https://via.placeholder.com/50"} 
                alt={song.title}
                className="song-thumbnail"
                onError={(e) => e.target.src = "https://via.placeholder.com/50"}
              />
              <div className="song-info">
                <h3>{song.title}</h3>
                <p>{song.artist} • {song.album || "No Album"}</p>
              </div>
              <span className="song-duration">{formatTime(song.duration)}</span>
              {currentSongIndex === index && isPlaying && (
                <div className="playing-indicator">
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Player Controls */}
      {currentSongIndex !== null && (
        <div className="player-controls">
          <div className="now-playing">
            <img 
              src={songs[currentSongIndex]?.coverImage || songs[currentSongIndex]?.imageUrl || "https://via.placeholder.com/50"} 
              alt="Now playing"
              className="now-playing-thumbnail"
            />
            <div className="now-playing-info">
              <h4>{songs[currentSongIndex]?.title || "Unknown"}</h4>
              <p>{songs[currentSongIndex]?.artist || "Unknown Artist"}</p>
            </div>
          </div>

          <div className="progress-container">
            <input
              ref={progressRef}
              type="range"
              min="0"
              max="100"
              className="progress-bar"
              onChange={(e) => {
                const seekTime = (e.target.value / 100) * duration;
                audioRef.current.currentTime = seekTime;
                setCurrentTime(seekTime);
              }}
            />
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="controls">
            <button onClick={playPrevious} className="control-button">⏮</button>
            <button onClick={togglePlayPause} className="play-button">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={playNext} className="control-button">⏭</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .music-player {
          width: 100%;
          max-width: 100%;
          padding: 20px;
          background: #121212;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .view-toggle {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          gap: 10px;
        }

        .view-toggle button {
          padding: 8px 16px;
          background: #333;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .view-toggle button.active {
          background: #6a11cb;
          font-weight: bold;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #6a11cb;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Albums Grid */
        .albums-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 10px;
        }

        .album-card {
          background: #1e1e1e;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .album-header {
          display: flex;
          align-items: center;
          padding: 15px;
          cursor: pointer;
          gap: 15px;
        }

        .album-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 5px;
        }

        .album-info {
          flex: 1;
        }

        .album-info h3 {
          margin: 0;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album-info p {
          margin: 5px 0 0;
          font-size: 14px;
          color: #aaa;
        }

        .album-info span {
          font-size: 12px;
          color: #777;
        }

        .toggle-button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 5px;
        }

        .album-songs {
          padding: 0 15px 15px;
        }

        .song-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.2s;
          gap: 10px;
        }

        .song-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .song-item.active {
          background: rgba(106, 17, 203, 0.2);
        }

        .song-number {
          color: #777;
          font-size: 14px;
          width: 20px;
        }

        .song-details {
          flex: 1;
        }

        .song-title {
          margin: 0;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-duration {
          color: #777;
          font-size: 12px;
        }

        /* Songs List View */
        .songs-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          padding: 10px;
        }

        .songs-list .song-item {
          background: #1e1e1e;
          border-radius: 8px;
        }

        .song-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px;
        }

        .song-info {
          flex: 1;
          min-width: 0;
        }

        .song-info h3 {
          margin: 0;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-info p {
          margin: 3px 0 0;
          font-size: 13px;
          color: #aaa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Playing Indicator */
        .playing-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 20px;
          margin-left: 10px;
        }

        .playing-indicator .bar {
          width: 3px;
          height: 60%;
          background: #6a11cb;
          animation: equalize 1.5s infinite ease-in-out;
        }

        .playing-indicator .bar:nth-child(1) {
          animation-delay: 0.1s;
        }

        .playing-indicator .bar:nth-child(2) {
          animation-delay: 0.3s;
        }

        .playing-indicator .bar:nth-child(3) {
          animation-delay: 0.5s;
        }

        @keyframes equalize {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }

        /* Player Controls */
        .player-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #282828;
          padding: 15px;
          border-top: 1px solid #444;
        }

        .now-playing {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .now-playing-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px;
        }

        .now-playing-info {
          flex: 1;
        }

        .now-playing-info h4 {
          margin: 0;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .now-playing-info p {
          margin: 3px 0 0;
          font-size: 14px;
          color: #aaa;
        }

        .progress-container {
          margin-bottom: 15px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: #555;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #6a11cb;
          border-radius: 50%;
          cursor: pointer;
        }

        .time-display {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #aaa;
          margin-top: 5px;
        }

        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
        }

        .control-button {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
        }

        .play-button {
          background: #6a11cb;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .albums-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .album-thumbnail {
            width: 60px;
            height: 60px;
          }
        }

        @media (max-width: 480px) {
          .albums-grid {
            grid-template-columns: 1fr;
          }
          
          .view-toggle {
            margin-bottom: 15px;
          }
          
          .player-controls {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
