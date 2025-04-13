import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadSongForm from "../components/UploadSongForm";
import SongList from "../components/SongList";
import { FiMenu, FiX, FiMusic, FiUpload, FiUser, FiFacebook, FiGithub, FiLinkedin } from "react-icons/fi";

const API_URL = "https://sachusicplayer.onrender.com/api/songs";

function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (response.ok) {
          setSongs(data);
        } else {
          setError("Failed to fetch songs.");
        }
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Error fetching songs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={styles.container}>
      {/* Mobile Menu Button */}
      <button style={styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={styles.adminAvatar}>
          <img
            src="https://res.cloudinary.com/dg2glqqs4/image/upload/v1741161926/download_uxxmz8.jpg"
            alt="Admin"
            style={styles.adminImage}
          />
        </div>
        <h2 style={styles.adminName}>Sachin Dubey</h2>
        <p style={styles.adminBio}>🚀 Web Developer | Passionate Coder | AI Enthusiast</p>
        <div style={styles.socialLinks}>
          <a href="#" style={styles.socialLink}><FiFacebook size={20} /></a>
          <a href="#" style={styles.socialLink}><FiGithub size={20} /></a>
          <a href="#" style={styles.socialLink}><FiLinkedin size={20} /></a>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navLink}><FiUser style={styles.navIcon} /> Profile</button>
          <button style={styles.navLink}><FiMusic style={styles.navIcon} /> Songs</button>
          <button style={styles.navLink}><FiUpload style={styles.navIcon} /> Upload</button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main style={styles.mainContent}>
        <h1 style={styles.dashboardTitle}>Admin Dashboard</h1>

        <div style={styles.contentBox}>
          <UploadSongForm onSongUpload={handleSongUpload} />
        </div>

        <div style={styles.contentBox}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Uploaded Songs</h2>
            <span style={styles.songCount}>
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </span>
          </div>

          {isLoading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p>Loading songs...</p>
            </div>
          ) : error ? (
            <p style={styles.errorMessage}>{error}</p>
          ) : songs.length > 0 ? (
            songs.map((song) => (
              <div key={song._id}>
                <SongList song={song} onDelete={handleDelete} />
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <FiMusic size={48} style={styles.emptyIcon} />
              <p style={styles.noSongs}>No songs uploaded yet.</p>
              <button style={styles.uploadButton}>Upload Your First Song</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// You can keep your styles object the same

export default AdminDashboard;
