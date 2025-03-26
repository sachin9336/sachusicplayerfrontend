import React, { useState, useEffect } from "react";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [password, setPassword] = useState(""); // Admin password
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("https://sachusicplayer.onrender.com/api/songs");
      let data = await response.json();
      
      // Normalize song data to avoid key mismatch issues
      const normalizedSongs = data.map(song => ({
        id: song._id,
        title: song.title,
        artist: song.artist,
        songUrl: song.songUrl || song.audioUrl,  // Ensure correct key is used
        coverImage: song.coverImage || song.imageUrl,  // Ensure correct key is used
        album: song.album || "Unknown Album"
      }));

      console.log("🎵 Songs fetched:", normalizedSongs);
      setSongs(normalizedSongs);
    } catch (error) {
      console.error("❌ Error fetching songs:", error);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setTitle(song.title);
    setArtist(song.artist);
    setAudioFile(null);
    setCoverImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("⚠️ Please enter admin password!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("password", password);

    if (audioFile) formData.append("audioFile", audioFile);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      const response = await fetch(`https://sachusicplayer.onrender.com/api/songs/${editingSong.id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Song updated successfully!");
        fetchSongs();
        setEditingSong(null);
        setPassword("");
      } else {
        alert(result.error || "❌ Failed to update song!");
      }
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  const handleDelete = async (songId) => {
    const confirmPassword = prompt("🔐 Enter Admin Password to Delete:");

    if (!confirmPassword) {
      alert("⚠️ Password is required to delete!");
      return;
    }

    try {
      const response = await fetch(`https://sachusicplayer.onrender.com/api/songs/${songId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: confirmPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Song deleted successfully!");
        fetchSongs();
      } else {
        alert(result.error || "❌ Failed to delete song!");
      }
    } catch (error) {
      console.error("❌ Deletion failed:", error);
    }
  };

  return (
    <div>
      <h2>🎵 Song List</h2>
      {songs.length > 0 ? (
        songs.map((song) => (
          <div key={song.id}>
            <h3>{song.title} - {song.artist}</h3>
            {song.coverImage && <img src={song.coverImage} alt="Cover" width="100" />}
            <audio controls>
              <source src={song.songUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button onClick={() => handleEdit(song)}>✏️ Edit</button>
            <button onClick={() => handleDelete(song.id)}>🗑️ Delete</button>
          </div>
        ))
      ) : (
        <p>🚫 No songs uploaded yet.</p>
      )}

      {editingSong && (
        <form onSubmit={handleUpdate} encType="multipart/form-data">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song Title" />
          <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" />
          
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
          
          <input type="password" placeholder="🔐 Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditingSong(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default SongList;
