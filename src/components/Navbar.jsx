import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaSearch, FaHome, FaMusic, FaInfoCircle, FaUserShield, FaSignInAlt, FaUser } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch songs data
  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  // Filter songs based on search query
  useEffect(() => {
    setFilteredSongs(
      searchQuery.trim() === ""
        ? []
        : songs.filter((song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
    );
  }, [searchQuery, songs]);

  // Check admin login status
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdminLoggedIn(!!token);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    navigate("/admin/login");
  };

  const playSongInHome = (song) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate("/", { state: { song } });
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" ref={menuRef}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🎵</span>
            <span className="brand-text">SachusicPlayer</span>
          </Link>
        </div>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <FaTimes className="icon close-icon" />
          ) : (
            <FaBars className="icon" />
          )}
        </div>

        <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <FaHome className="nav-icon" /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/playlists"
              className={location.pathname === "/playlists" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <FaMusic className="nav-icon" /> Playlists
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <FaInfoCircle className="nav-icon" /> About
            </Link>
          </li>
          <li>
            <Link
              to="/owner"
              className={location.pathname === "/owner" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <FaUserShield className="nav-icon" /> Owner
            </Link>
          </li>

          {isAdminLoggedIn ? (
            <>
              <li>
                <Link
                  to="/admin/dashboard"
                  className={
                    location.pathname === "/admin/dashboard" ? "active" : ""
                  }
                  onClick={handleLinkClick}
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleAdminLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/admin/login"
                className={location.pathname === "/admin/login" ? "active" : ""}
                onClick={handleLinkClick}
              >
                Admin Login
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
              onClick={handleLinkClick}
            >
              <FaSignInAlt className="nav-icon" /> Login
            </Link>
          </li>
        </ul>

        <div className="search-container" ref={searchRef}>
          <div className={`search-input-container ${searchFocused ? "focused" : ""}`}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => {
                  setSearchQuery("");
                  setSearchFocused(false);
                }}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          {filteredSongs.length > 0 && searchFocused && (
            <ul className="search-dropdown">
              {filteredSongs.map((song) => (
                <li
                  key={song._id || song.id}
                  className="dropdown-item"
                  onClick={() => playSongInHome(song)}
                >
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <div className="play-indicator">
                    <FaUser className="play-icon" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
