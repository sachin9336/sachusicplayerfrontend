import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ User Already Logged in? Redirect to Profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Profile");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setSuccess("Login Successful! Redirecting...");
      localStorage.setItem("token", data.token);

      setTimeout(() => {
        navigate("/Profile"); // ✅ Redirect to Profile after login
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #3a7bd5, #3a6073)",
      }}
    >
      {/* Login Box */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f1f1f1",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          >
            <FaUser style={{ marginRight: "10px", color: "#555" }} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Password Field */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f1f1f1",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          >
            <FaLock style={{ marginRight: "10px", color: "#555" }} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              background: "#3a7bd5",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#2c5ea5")}
            onMouseOut={(e) => (e.target.style.background = "#3a7bd5")}
          >
            Login
          </button>

          {/* Links */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
            }}
          >
            <Link to="/forgot-password" style={{ textDecoration: "none", color: "#3a7bd5" }}>
              Forgot Password?
            </Link>
            <Link to="/create-account" style={{ textDecoration: "none", color: "#3a7bd5" }}>
              Create Account
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
          background: "#222",
          color: "white",
          textAlign: "center",
          padding: "10px",
          fontSize: "14px",
        }}
      >
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;
