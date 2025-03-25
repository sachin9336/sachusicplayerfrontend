import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

// ✅ Hardcoded backend URL (Render se mila hua)
const API_URL = "https://sachusicplayer.onrender.com";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_URL}/api/songs`)
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  useEffect(() => {
    setFilteredSongs(
      searchQuery.trim() === ""
        ? []
        : songs.filter((song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
    );
  }, [searchQuery, songs]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdminLoggedIn(!!token);
  }, [location.pathname]);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    navigate("/admin/login");
  };

  const playSongInHome = (song) => {
    navigate("/", { state: { song } });
  };

  return (
    <nav className="navbar">
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/playlists"
            className={location.pathname === "/playlists" ? "active" : ""}
          >
            Playlists
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
            >
              Admin Login
            </Link>
          </li>
        )}

        <li>
          <Link
            to="/login"
            className={location.pathname === "/login" ? "active" : ""}
          >
            Login
          </Link>
        </li>
      </ul>

      {menuOpen && (
        <ul className="hamburger-menu">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/owner">Owner</Link>
          </li>
        </ul>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {filteredSongs.length > 0 && (
          <ul className="dropdown">
            {filteredSongs.map((song) => (
              <li
                key={song._id || song.id}
                className="dropdown-item"
                onClick={() => playSongInHome(song)}
              >
                {song.title} - {song.artist}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
