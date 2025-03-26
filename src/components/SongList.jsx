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
      const data = await response.json();
      console.log("🎵 Songs fetched:", data);
      setSongs(data);
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
      const response = await fetch(`https://sachusicplayer.onrender.com/api/songs/${editingSong._id}`, {
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
          <div key={song._id}>
            <h3>{song.title} - {song.artist}</h3>
            <audio controls>
              <source src={song.audioUrl || song.songUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button onClick={() => handleEdit(song)}>✏️ Edit</button>
            <button onClick={() => handleDelete(song._id)}>🗑️ Delete</button>
          </div>
        ))
      ) : (
        <p>🚫 No songs uploaded yet.</p>
      )}

      {editingSong && (
        <form onSubmit={handleUpdate} encType="multipart/form-data">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
          
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
          
          <input type="password" placeholder="🔐 Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default SongList;
