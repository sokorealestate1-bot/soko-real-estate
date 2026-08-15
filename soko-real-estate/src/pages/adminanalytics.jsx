import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://soko-backend-hwvp.onrender.com/api/users/analytics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data);
      setError("");
    } catch (err) {
      console.error("Analytics error:", err);
      setError(err.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#14b8a6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto"
          }} />
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc"
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          textAlign: "center",
          border: "1px solid #e2e8f0"
        }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
          <button
            onClick={fetchAnalytics}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "#14b8a6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
      {/* ===== NAVBAR ===== */}
      <nav style={{
        background: "#0f172a",
        padding: "0 40px",
        height: "72px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <img src={logo} alt="SOKO" style={{ height: "40px" }} />
          </Link>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <Link to="/admin" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Dashboard
            </Link>
            <Link to="/admin/analytics" style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>
          Overview of your SOKO Real Estate platform
        </p>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "4px" }}>Total Users</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{stats.totalUsers}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              {stats.admins} admins · {stats.regularUsers} users
            </p>
          </div>

          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "4px" }}>Total Properties</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{stats.totalProperties}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              {stats.approvedProperties} approved · {stats.pendingProperties} pending · {stats.rejectedProperties} rejected
            </p>
          </div>

          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "4px" }}>Logged In Today</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{stats.loggedInToday}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Total logins: {stats.totalLogins}
            </p>
          </div>

          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "4px" }}>Pending Approval</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#f59e0b" }}>{stats.pendingProperties}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Properties waiting for review
            </p>
          </div>
        </div>

        {/* Daily Logins Chart */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>
            Daily Logins (Last 7 Days)
          </h3>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "16px",
            height: "200px",
            paddingBottom: "20px",
            borderBottom: "1px solid #e2e8f0"
          }}>
            {stats.dailyLogins.map((day, index) => {
              const maxCount = Math.max(...stats.dailyLogins.map(d => d.count), 1);
              const height = (day.count / maxCount) * 150;
              return (
                <div key={index} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1
                }}>
                  <div style={{
                    width: "100%",
                    height: `${Math.max(height, 10)}px`,
                    background: day.count > 0 ? "#14b8a6" : "#e2e8f0",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s ease",
                    minHeight: "10px"
                  }} />
                  <p style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#64748b",
                    textAlign: "center"
                  }}>
                    {day.date.slice(5)}
                    <br />
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>{day.count}</span>
                  </p>
                </div>
              );
            })}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            fontSize: "11px",
            color: "#94a3b8"
          }}>
            <span>Date (MM-DD)</span>
            <span>Number of logins</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;