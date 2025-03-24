import React from "react";

const About = () => {
  return (
    <div style={styles.container}>
      {/* ✅ About Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>About SachusicPlayer</h1>
        <p style={styles.description}>
          🎶 Welcome to <strong>SachusicPlayer</strong>, your one-stop music
          destination! Experience high-quality streaming, a vast music
          collection, and a seamless interface.
        </p>

        <div style={styles.features}>
          <div style={styles.featureBox}>
            <h3 style={styles.featureTitle}>🎵 Unlimited Songs</h3>
            <p>Explore a massive collection of songs across all genres.</p>
          </div>
          <div style={styles.featureBox}>
            <h3 style={styles.featureTitle}>🚀 High-Quality Streaming</h3>
            <p>Enjoy crystal-clear sound without interruptions.</p>
          </div>
          <div style={styles.featureBox}>
            <h3 style={styles.featureTitle}>🌍 Global Access</h3>
            <p>Listen to your favorite music anywhere in the world.</p>
          </div>
        </div>
      </div>

      {/* ✅ Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 <strong>SachusicPlayer</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg,rgb(159, 85, 97),rgb(169, 83, 121))",
    color: "#fff",
    textAlign: "center",
    padding: "30px 15px",
    width: "100vw",
  },
  content: {
    maxWidth: "800px",
    width: "100%",
    background: "rgba(255, 255, 255, 0.15)",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textShadow: "3px 3px 5px rgba(0,0,0,0.3)",
    letterSpacing: "1px",
  },
  description: {
    fontSize: "1.2rem",
    lineHeight: "1.8",
    marginBottom: "25px",
    fontWeight: "500",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  featureBox: {
    background: "rgba(255, 255, 255, 0.3)",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  featureBoxHover: {
    transform: "scale(1.05)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
  featureTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  footer: {
    marginTop: "40px",
    padding: "12px",
    fontSize: "1rem",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "800px",
    textAlign: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
};

export default About;
