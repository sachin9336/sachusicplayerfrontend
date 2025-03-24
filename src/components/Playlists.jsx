import React, { useEffect, useState, useRef } from "react";

function Playlist() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio());
  const progressRef = useRef(null);

  useEffect(() => {
    fetch("https://sachusicplayer.onrender.com/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  useEffect(() => {
    if (currentSongIndex !== null && songs.length > 0) {
      const song = songs[currentSongIndex];
      const songSrc = song.songUrl || song.audioUrl;
      if (!songSrc) return;

      audioRef.current.src = songSrc;
      audioRef.current.volume = volume;
      setLoading(true);

      audioRef.current.oncanplaythrough = () => {
        setLoading(false);
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("❌ Play error:", err));
      };

      audioRef.current.ontimeupdate = () => {
        if (progressRef.current) {
          progressRef.current.value = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        }
      };
    }
  }, [currentSongIndex, volume]);

  const togglePlayPause = (index) => {
    if (currentSongIndex === index) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("❌ Play error:", err));
      }
    } else {
      setCurrentSongIndex(index);
    }
  };

  const changeVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center" }}>My Playlist</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {songs.map((song, index) => (
          <li key={song._id} style={{ display: "flex", alignItems: "center", marginBottom: "10px", padding: "10px", borderBottom: "1px solid #ddd" }}>
            <img 
              src={song.coverImage || song.imageUrl} 
              alt={song.title} 
              style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }}
              onError={(e) => console.error("❌ Image Load Error:", e.target.src)}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>{song.title}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{song.artist}</p>
            </div>
            <button onClick={() => togglePlayPause(index)} style={{ padding: "5px 10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              {currentSongIndex === index && isPlaying ? "Pause" : "Play"}
            </button>
          </li>
        ))}
      </ul>
      {currentSongIndex !== null && (
        <div style={{ textAlign: "center", marginTop: "20px", padding: "10px", background: "#fff", borderRadius: "5px", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)" }}>
          {loading && <p style={{ fontSize: "12px", color: "#666" }}>Loading...</p>}
          <input
            ref={progressRef}
            type="range"
            min="0"
            max="100"
            style={{ width: "100%", marginTop: "10px" }}
            onChange={(e) => {
              audioRef.current.currentTime = (e.target.value / 100) * audioRef.current.duration;
            }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={changeVolume}
            style={{ width: "100%", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

export default Playlist;
