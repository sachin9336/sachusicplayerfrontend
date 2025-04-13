import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadSongForm from "../components/UploadSongForm";
import SongList from "../components/SongList";

function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/songs");
      const data = await response.json();
      if (response.ok) {
        setSongs(data);
      } else {
        setError("Failed to fetch songs.");
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Error fetching songs. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/songs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSongs((prevSongs) => prevSongs.filter((song) => song._id !== id));
      }
    } catch (err) {
      console.error("Error deleting song:", err);
    }
  };

  const handleSongUpload = (newSong) => {
    setSongs((prevSongs) => [...prevSongs, newSong]);
  };

  return (
    <div style={styles.container}>
      {/* ✅ Sidebar with User Info */}
      <aside style={styles.sidebar}>
        <div style={styles.adminAvatar}>
          <img
            src="https://res.cloudinary.com/dg2glqqs4/image/upload/v1741161926/download_uxxmz8.jpg"
            alt="Admin"
            style={styles.adminImage}
          />
        </div>
        <h2 style={styles.adminName}>Sachin Dubey</h2>
        <p style={styles.adminBio}>
          🚀 Web Developer | Passionate Coder | AI Enthusiast
        </p>
      </aside>

      {/* ✅ Main Dashboard */}
      <main style={styles.mainContent}>
        <h1 style={styles.dashboardTitle}>Admin Dashboard</h1>

        <div style={styles.contentBox}>
          <UploadSongForm onSongUpload={handleSongUpload} />
        </div>

        <div style={styles.contentBox}>
          <h2 style={styles.sectionTitle}>Uploaded Songs</h2>
          {error ? (
            <p style={styles.errorMessage}>{error}</p>
          ) : songs.length > 0 ? (
            <SongList songs={songs} onDelete={handleDelete} />
          ) : (
            <p style={styles.noSongs}>No songs uploaded yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f8f9fa",
  },
  sidebar: {
    width: "300px",
    backgroundColor: "#343a40",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  adminAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid #fff",
    marginBottom: "10px",
  },
  adminImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  adminName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  adminBio: {
    fontSize: "1rem",
    textAlign: "center",
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  contentBox: {
    width: "80%",
    maxWidth: "900px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
  },
  noSongs: {
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
  },
};

export default AdminDashboard;
