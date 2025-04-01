import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadSongForm from "../components/UploadSongForm";
import SongList from "../components/SongList";

const API_URL = "https://sachusicplayer.onrender.com/api/songs";

function AdminDashboard() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
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
    }
  };

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
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Sidebar with User Info */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          ...(isMenuOpen && styles.sidebarMobileOpen),
        }}
      >
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
        <div style={styles.socialLinks}>
          <a href="#" style={styles.socialLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
          </a>
          <a href="#" style={styles.socialLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a href="#" style={styles.socialLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
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
            <span style={styles.songCount}>{songs.length} songs</span>
          </div>
          {error ? (
            <p style={styles.errorMessage}>{error}</p>
          ) : songs.length > 0 ? (
            <SongList songs={songs} onDelete={handleDelete} />
          ) : (
            <div style={styles.emptyState}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#777"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <p style={styles.noSongs}>No songs uploaded yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    position: "relative",
    overflowX: "hidden",
  },
  menuButton: {
    display: "none",
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 1000,
    background: "#343a40",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      display: "block",
    },
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
    position: "fixed",
    height: "100vh",
    transition: "transform 0.3s ease-in-out",
    zIndex: 100,
    "@media (max-width: 768px)": {
      transform: "translateX(-100%)",
    },
  },
  sidebarMobileOpen: {
    "@media (max-width: 768px)": {
      transform: "translateX(0)",
      boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
    },
  },
  adminAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid #fff",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  adminImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  adminName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  adminBio: {
    fontSize: "0.9rem",
    textAlign: "center",
    opacity: 0.8,
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  socialLinks: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },
  socialLink: {
    color: "#fff",
    transition: "transform 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
    },
  },
  mainContent: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    marginLeft: "300px",
    "@media (max-width: 768px)": {
      marginLeft: "0",
      padding: "20px",
      paddingTop: "80px",
    },
  },
  dashboardTitle: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "30px",
    "@media (max-width: 768px)": {
      fontSize: "1.8rem",
      textAlign: "center",
    },
  },
  contentBox: {
    width: "100%",
    maxWidth: "900px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    marginBottom: "30px",
    "@media (max-width: 768px)": {
      padding: "15px",
    },
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#444",
  },
  songCount: {
    fontSize: "0.9rem",
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  errorMessage: {
    color: "#dc3545",
    fontWeight: "500",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "4px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  noSongs: {
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "15px",
    fontSize: "1.1rem",
  },
};

export default AdminDashboard;
