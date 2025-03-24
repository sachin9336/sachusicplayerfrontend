import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaMusic } from "react-icons/fa";

const CreateAccount = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("🎶 Account created successfully!");
        setMessageType("success");
        setFormData({ name: "", email: "", password: "" });
      } else {
        setMessage(data.message || "⚠️ Error occurred!");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("❌ Something went wrong!");
      setMessageType("error");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="music-icon">
          <FaMusic className="icon" />
        </div>
        <h2 className="title">Music Zone 🎧</h2>
        {message && <p className={`message ${messageType}`}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" name="name" placeholder="Your DJ Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="password" placeholder="Create a Strong Password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-btn">Join the Beat 🎶</button>
        </form>
      </div>

      <div className="music-info">
        <h2>Feel the Rhythm!</h2>
        <p>Join our music community and explore the latest beats and tracks. Get exclusive content and updates!</p>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Music Zone 🎧 | All Rights Reserved.</p>
      </footer>

      <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(to right, #2c003e, #0a0a0a, #000040);
          color: white;
          font-family: Arial, sans-serif;
          padding: 120px 20px 50px;
          width: 100vw;
          min-height: 100vh;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .form-box {
          background: rgba(0, 0, 0, 0.7);
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          width: 350px;
          box-shadow: 0px 0px 20px rgba(255, 0, 255, 0.5);
          margin-bottom: 20px;
        }

        .music-icon {
          background: purple;
          padding: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-bottom: 10px;
        }
        
        .icon {
          color: white;
          font-size: 24px;
        }
        
        .title {
          font-size: 24px;
          font-weight: bold;
        }
        
        .input-group {
          display: flex;
          align-items: center;
          background: #333;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        
        .input-icon {
          color: #9b5de5;
          margin-right: 10px;
        }
        
        input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 16px;
        }
        
        .submit-btn {
          width: 100%;
          padding: 10px;
          border: none;
          background: #9b5de5;
          color: white;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        
        .submit-btn:hover {
          background: #7d3cb5;
        }
        
        .message {
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
          font-size: 14px;
        }
        
        .success {
          background: green;
          color: white;
        }
        
        .error {
          background: red;
          color: white;
        }
        
        .music-info {
          max-width: 300px;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 0px 15px rgba(255, 0, 255, 0.5);
          margin-bottom: 20px;
        }
        
        .footer {
          width: 100%;
          text-align: center;
          padding: 15px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};

export default CreateAccount;
