import { useEffect, useState } from "react";

function AdminPanel() {
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin") // ✅ Backend API Call
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
          {adminData.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.id}</td>
              <td>{admin.username}</td>
              <td>{admin.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;