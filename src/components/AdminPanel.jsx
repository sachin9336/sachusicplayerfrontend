import { useEffect, useState } from "react";

// ✅ Backend API URL (Render se mila hua)
const API_URL = "https://sachusicplayer.onrender.com";

function AdminPanel() {
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/admin`) // ✅ Backend API Call
      .then((res) => res.json())
      .then((data) => setAdminData(data))
      .catch((error) => console.error("Error fetching admin data:", error));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Admin Panel</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {adminData.length > 0 ? (
            adminData.map((admin) => (
              <tr key={admin._id || admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.password}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No Admin Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
