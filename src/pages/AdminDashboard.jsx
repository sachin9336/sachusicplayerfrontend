import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadSongForm from "../components/UploadSongForm";
import SongList from "../components/SongList";
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

  return (
    <div className="admin-container">
      {/* Mobile Menu Button */}
      <button
        className={`menu-button ${isMenuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar with User Info */}
      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="admin-avatar">
          <img
            src="https://res.cloudinary.com/dg2glqqs4/image/upload/v1741161926/download_uxxmz8.jpg"
            alt="Admin"
            className="admin-image"
          />
        </div>

        <h2 className="admin-name">
          Sachin Dubey
        </h2>

        <p className="admin-bio">
          🚀 Web Developer | Passionate Coder | AI Enthusiast
        </p>

        <div className="social-links">
          <a href="#" className="social-link facebook">
            <FiFacebook size={20} />
          </a>
          <a href="#" className="social-link github">
            <FiGithub size={20} />
          </a>
          <a href="#" className="social-link linkedin">
            <FiLinkedin size={20} />
          </a>
        </div>

        <div className="nav-links">
          <button className="nav-link">
            <FiUser className="nav-icon" />
            Profile
          </button>
          <button className="nav-link">
            <FiMusic className="nav-icon" />
            Songs
          </button>
          <button className="nav-link">
            <FiUpload className="nav-icon" />
            Upload
          </button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className={`main-content ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="dashboard-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>

          <div className="content-box upload-box">
            <UploadSongForm onSongUpload={handleSongUpload} />
          </div>

          <div className="content-box songs-box">
            <div className="section-header">
              <h2 className="section-title">
                Uploaded Songs
              </h2>
              <span className="song-count">
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </span>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading songs...</p>
              </div>
            ) : error ? (
              <p className="error-message">
                {error}
              </p>
            ) : songs.length > 0 ? (
              <div className="songs-list">
                {songs.map((song, index) => (
                  <div
                    key={song._id}
                    className="song-item"
                    style={{ transitionDelay: `${index * 0.05}s` }}
                  >
                    <SongList song={song} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiMusic size={48} className="empty-icon" />
                <p className="no-songs">No songs uploaded yet.</p>
                <button className="upload-button">
                  Upload Your First Song
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
          position: relative;
          overflow-x: hidden;
        }

        .menu-button {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: #343a40;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .menu-button:hover {
          transform: scale(1.05);
        }

        .menu-button:active {
          transform: scale(0.95);
        }

        .sidebar {
          width: 300px;
          background-color: #343a40;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          position: fixed;
          height: 100vh;
          z-index: 100;
          box-shadow: 2px 0 20px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .admin-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #fff;
          margin-bottom: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          animation: scaleIn 0.5s ease forwards;
        }

        .admin-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
          animation: fadeInUp 0.5s 0.1s ease forwards;
          opacity: 0;
        }

        .admin-bio {
          font-size: 0.9rem;
          text-align: center;
          opacity: 0.8;
          margin-bottom: 30px;
          line-height: 1.5;
          padding: 0 10px;
          animation: fadeInUp 0.5s 0.2s ease forwards;
          opacity: 0;
        }

        .social-links {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          animation: fadeIn 0.5s 0.3s ease forwards;
          opacity: 0;
        }

        .social-link {
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          transform: translateY(-3px);
        }

        .facebook:hover {
          color: #4267B2;
        }

        .github:hover {
          color: #333;
        }

        .linkedin:hover {
          color: #0077b5;
        }

        .nav-links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: fadeIn 0.5s 0.4s ease forwards;
          opacity: 0;
        }

        .nav-link {
          background: transparent;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          transform: translateX(5px);
          background-color: rgba(255,255,255,0.1);
        }

        .nav-icon {
          margin-right: 10px;
        }

        .main-content {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          margin-left: 300px;
          transition: margin-left 0.3s ease;
        }

        .dashboard-content {
          animation: fadeIn 0.5s ease;
        }

        .dashboard-title {
          font-size: 2.2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 30px;
        }

        .content-box {
          width: 100%;
          max-width: 900px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
          transition: all 0.3s ease;
        }

        .upload-box:hover, .songs-box:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #444;
          animation: slideIn 0.5s ease;
        }

        .song-count {
          font-size: 0.9rem;
          color: #666;
          background-color: #f0f0f0;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
          animation: scaleIn 0.5s ease;
        }

        .error-message {
          color: #dc3545;
          font-weight: 500;
          text-align: center;
          padding: 15px;
          background-color: #f8d7da;
          border-radius: 8px;
          margin: 20px 0;
          animation: scaleIn 0.3s ease;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        .empty-icon {
          color: #aaa;
          margin-bottom: 20px;
        }

        .no-songs {
          color: #777;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .upload-button {
          background: #4e44ce;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.95rem;
          box-shadow: 0 4px 12px rgba(78, 68, 206, 0.3);
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          transform: scale(1.03);
        }

        .upload-button:active {
          transform: scale(0.97);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #666;
          animation: fadeIn 0.5s ease;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0,0,0,0.1);
          border-left-color: #4e44ce;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .songs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .song-item {
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }

        @media (max-width: 768px) {
          .menu-button {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
            padding: 20px;
            padding-top: 80px;
          }

          .main-content.menu-open {
            transform: translateX(300px);
          }

          .dashboard-title {
            font-size: 1.8rem;
            text-align: center;
          }

          .content-box {
            padding: 20px;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); }
          to { transform: scale(1); }
        }

        @keyframes slideIn {
          from { transform: translateX(-20px); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
