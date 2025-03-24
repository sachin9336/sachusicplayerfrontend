const Owner = () => {
  return (
    <div className="owner-container">
      <div className="owner-card">
        {/* Profile Image */}
        <div className="profile-image">
          <img
            src="https://res.cloudinary.com/dg2glqqs4/image/upload/v1741161926/download_uxxmz8.jpg"
            alt="Sachin Dubey"
          />
          <div className="glow-effect"></div>
        </div>

        {/* Owner Name & Title */}
        <h1 className="owner-name">Sachin Dubey</h1>
        <p className="owner-title">Web Developer & AI Enthusiast</p>

        {/* Introduction */}
        <p className="owner-intro">
          Passionate about building web solutions and exploring AI. Always eager to learn, grow, and create innovative projects.
        </p>

        {/* Key Highlights */}
        <div className="owner-highlights">
          <p>✅ Expertise in <strong>Web Development & Java Programming</strong></p>
          <p>✅ Experience in <strong>AI & Chatbot Development</strong></p>
          <p>✅ <strong>Creative Content Creator</strong> with a Strong Online Presence</p>
          <p>✅ <strong>Passionate About Learning & Sharing Knowledge</strong></p>
        </div>

        {/* Contact or Social Media Link */}
        <a
          href="https://www.linkedin.com/in/sachin-dubey-940b59252/"
          className="owner-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect with Me 🚀
        </a>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .owner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(to right, #cfd9df, #e2ebf0);
          padding: 20px;
        }
        .owner-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          max-width: 400px;
          transition: transform 0.3s ease-in-out;
        }
        .owner-card:hover {
          transform: translateY(-5px);
        }
        .profile-image {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
        }
        .profile-image img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid #4f46e5;
          box-shadow: 0px 5px 15px rgba(79, 70, 229, 0.5);
          transition: transform 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }
        .profile-image:hover img {
          transform: scale(1.1) rotate(3deg);
          border-color: #8b5cf6;
        }
        .glow-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.8);
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .profile-image:hover .glow-effect {
          opacity: 1;
        }
        .owner-name {
          font-size: 28px;
          font-weight: bold;
          color: #4f46e5;
          margin-top: 15px;
        }
        .owner-title {
          font-size: 18px;
          color: #4a5568;
          font-weight: 500;
        }
        .owner-intro {
          font-size: 16px;
          color: #6b7280;
          margin-top: 10px;
          line-height: 1.5;
        }
        .owner-highlights {
          margin-top: 20px;
          text-align: left;
          font-size: 15px;
          color: #333;
        }
        .owner-highlights p {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 5px 0;
        }
        .owner-button {
          display: inline-block;
          margin-top: 20px;
          background: #4f46e5;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 25px;
          text-decoration: none;
          transition: background 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        .owner-button:hover {
          background: #8b5cf6;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Owner;
