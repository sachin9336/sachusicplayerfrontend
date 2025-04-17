import React, { useEffect, useState } from "react";  
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://sachusicplayer.onrender.com/api/auth/user", {  // API URL updated
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        console.log("Token expired, logging out...");
        handleLogout(); // Expired token me direct logout
      } else if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.log("User data fetch failed");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Page refresh ke bina logout handle hoga
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>
        {user ? (
          <div style={styles.details}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role || "User"}</p>
          </div>
        ) : (
          <p style={styles.loading}>Loading user data...</p>
        )}
        <button 
          style={styles.button} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    width: "400px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    borderBottom: "2px solid #fff",
    paddingBottom: "5px",
    display: "inline-block",
  },
  details: {
    fontSize: "18px",
    marginBottom: "20px",
    textAlign: "left",
  },
  loading: {
    fontSize: "16px",
    fontStyle: "italic",
    color: "#f1f1f1",
  },
  button: {
    background: "#ff4b5c",
    color: "white",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "0.3s ease-in-out",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)", // Button aur visible hoga
  },
};

export default Profile;
