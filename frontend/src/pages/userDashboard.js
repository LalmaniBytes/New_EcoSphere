import React, { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auto-login", {
          withCredentials: true, // important to send cookie
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/signin", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please login to view this page.</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome, {user.username}!</h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      {/* Conditional UI based on role */}
      {user.role === "admin" && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h2>Admin Panel</h2>
          <p>You can manage users here.</p>
        </div>
      )}

      {user.role === "user" && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h2>User Dashboard</h2>
          <p>Access your personal data here.</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default UserDashboard;
