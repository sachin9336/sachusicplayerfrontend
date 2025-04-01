import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadSongForm from "../components/UploadSongForm";
import SongList from "../components/SongList";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiMusic, FiUpload, FiUser, FiFacebook, FiGithub, FiLinkedin, FiTrash2 } from "react-icons/fi";

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

  // Animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <div style={styles.container}>
      {/* Mobile Menu Button */}
      <motion.button
        style={styles.menuButton}
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </motion.button>

      {/* Sidebar with User Info */}
      <motion.aside
        style={styles.sidebar}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div 
          style={styles.adminAvatar}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/dg2glqqs4/image/upload/v1741161926/download_uxxmz8.jpg"
            alt="Admin"
            style={styles.adminImage}
          />
        </motion.div>

        <motion.h2 
          style={styles.adminName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Sachin Dubey
        </motion.h2>

        <motion.p 
          style={styles.adminBio}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          🚀 Web Developer | Passionate Coder | AI Enthusiast
        </motion.p>

        <motion.div 
          style={styles.socialLinks}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.a 
            href="#" 
            style={styles.socialLink}
            whileHover={{ y: -3, color: "#4267B2" }}
          >
            <FiFacebook size={20} />
          </motion.a>
          <motion.a 
            href="#" 
            style={styles.socialLink}
            whileHover={{ y: -3, color: "#333" }}
          >
            <FiGithub size={20} />
          </motion.a>
          <motion.a 
            href="#" 
            style={styles.socialLink}
            whileHover={{ y: -3, color: "#0077b5" }}
          >
            <FiLinkedin size={20} />
          </motion.a>
        </motion.div>

        <motion.div 
          style={styles.navLinks}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button 
            style={styles.navLink}
            whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <FiUser style={styles.navIcon} />
            Profile
          </motion.button>
          <motion.button 
            style={styles.navLink}
            whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <FiMusic style={styles.navIcon} />
            Songs
          </motion.button>
          <motion.button 
            style={styles.navLink}
            whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <FiUpload style={styles.navIcon} />
            Upload
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Dashboard */}
      <main style={styles.mainContent}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={{ duration: 0.5 }}
        >
          <h1 style={styles.dashboardTitle}>Admin Dashboard</h1>

          <motion.div 
            style={styles.contentBox}
            whileHover={{ boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)" }}
          >
            <UploadSongForm onSongUpload={handleSongUpload} />
          </motion.div>

          <motion.div 
            style={styles.contentBox}
            whileHover={{ boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)" }}
          >
            <div style={styles.sectionHeader}>
              <motion.h2 
                style={styles.sectionTitle}
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ type: "spring" }}
              >
                Uploaded Songs
              </motion.h2>
              <motion.span 
                style={styles.songCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </motion.span>
            </div>

            {isLoading ? (
              <motion.div 
                style={styles.loadingState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={styles.spinner}></div>
                <p>Loading songs...</p>
              </motion.div>
            ) : error ? (
              <motion.p 
                style={styles.errorMessage}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                {error}
              </motion.p>
            ) : songs.length > 0 ? (
              <AnimatePresence>
                {songs.map((song, index) => (
                  <motion.div
                    key={song._id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring" }}
                    layout
                  >
                    <SongList song={song} onDelete={handleDelete} />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div 
                style={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FiMusic size={48} style={styles.emptyIcon} />
                <p style={styles.noSongs}>No songs uploaded yet.</p>
                <motion.button
                  style={styles.uploadButton}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Upload Your First Song
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
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
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
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
    padding: "30px 20px",
    position: "fixed",
    height: "100vh",
    zIndex: 100,
    boxShadow: "2px 0 20px rgba(0,0,0,0.1)",
    "@media (max-width: 768px)": {
      transform: "translateX(-100%)",
    },
  },
  adminAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid #fff",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
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
    marginBottom: "30px",
    lineHeight: 1.5,
    padding: "0 10px",
  },
  socialLinks: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  socialLink: {
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  navLinks: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navLink: {
    background: "transparent",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },
  navIcon: {
    marginRight: "10px",
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
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    marginBottom: "30px",
    transition: "all 0.3s ease",
    "@media (max-width: 768px)": {
      padding: "20px",
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
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  errorMessage: {
    color: "#dc3545",
    fontWeight: "500",
    textAlign: "center",
    padding: "15px",
    backgroundColor: "#f8d7da",
    borderRadius: "8px",
    margin: "20px 0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    color: "#aaa",
    marginBottom: "20px",
  },
  noSongs: {
    color: "#777",
    fontSize: "1.1rem",
    marginBottom: "20px",
  },
  uploadButton: {
    background: "#4e44ce",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem",
    boxShadow: "0 4px 12px rgba(78, 68, 206, 0.3)",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "#666",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(0,0,0,0.1)",
    borderLeftColor: "#4e44ce",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
};

export default AdminDashboard;
