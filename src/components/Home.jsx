import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio());
  const progressRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  // 🎯 **Navbar se search ke through song play ho**
  useEffect(() => {
    if (songs.length === 0) return; // Jab tak songs na mile, run mat karo

    const queryParams = new URLSearchParams(location.search);
    const songIdFromSearch = queryParams.get("song");

    if (songIdFromSearch) {
      console.log("🔍 Searching for song ID:", songIdFromSearch);

      const index = songs.findIndex((song) => song._id === songIdFromSearch);
      
      if (index !== -1) {
        console.log("🎵 Song found! Playing:", songs[index].title);

        // Pehle current song ko pause karo
        audioRef.current.pause();
        setIsPlaying(false);

        // Phir naya song play karo
        playSong(index);
      } else {
        console.log("❌ Song not found in list");
      }
    }
  }, [songs, location.search]);

  useEffect(() => {
    if (currentSongIndex === null || songs.length === 0) return;

    const song = songs[currentSongIndex];
    const songUrl = song.songUrl || song.audioUrl;
    if (!songUrl) return;

    audioRef.current.pause();
    audioRef.current.src = songUrl;
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

    audioRef.current.onended = playNext;
  }, [currentSongIndex]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("❌ Play error:", err));
    }
  };

  const changeVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center" }}>Music Player</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {songs.map((song, index) => (
          <li key={song._id} style={{ display: "flex", alignItems: "center", marginBottom: "10px", padding: "10px", borderBottom: "1px solid #ddd" }}>
            <img 
              src={song.coverImage || song.imageUrl} 
              alt={song.title} 
              style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }} 
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>{song.title}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{song.artist}</p>
            </div>
            <button
              onClick={() => playSong(index)}
              style={{
                padding: "5px 10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
              }}
            >
              {currentSongIndex === index && isPlaying ? "Pause" : "Play"}
            </button>
          </li>
        ))}
      </ul>

      {currentSongIndex !== null && (
        <div style={{ textAlign: "center", marginTop: "20px", padding: "10px", background: "#fff", borderRadius: "5px", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)" }}>
          {loading && <p style={{ fontSize: "12px", color: "#666" }}>Loading...</p>}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
            <button onClick={playPrevious} style={{ padding: "5px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              ⏮ Prev
            </button>
            <button onClick={togglePlayPause} style={{ padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button onClick={playNext} style={{ padding: "5px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              ⏭ Next
            </button>
          </div>

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

export default Home;
