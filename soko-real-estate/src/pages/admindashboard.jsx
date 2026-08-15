import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    if (token) fetchProperties();
  }, [token]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const pendingRes = await axios.get(
        "https://soko-backend-hwvp.onrender.com/api/properties/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingProperties(pendingRes.data);

      const allRes = await axios.get("https://soko-backend-hwvp.onrender.com/api/properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(allRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `https://soko-backend-hwvp.onrender.com/api/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProperties();
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `https://soko-backend-hwvp.onrender.com/api/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProperties();
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`https://soko-backend-hwvp.onrender.com/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleFeatureToggle = async (id) => {
    try {
      await axios.patch(
        `https://soko-backend-hwvp.onrender.com/api/admin/feature/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProperties();
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  const handleVerifyToggle = async (id) => {
    try {
      await axios.patch(
        `https://soko-backend-hwvp.onrender.com/api/admin/verify/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProperties();
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading...</p>
        </div>
      </div>
    );
  }

  const pendingCount = pendingProperties.length;
  const approvedCount = properties.filter((p) => p.status === "Approved").length;
  const featuredCount = properties.filter((p) => p.isFeatured).length;
  const verifiedCount = properties.filter((p) => p.isVerified).length;

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
        <div style={{ maxWidth: "1440px", width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left: Logo + Home + Admin label */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <img src={logo} alt="SOKO" style={{ height: "40px" }} />
            </Link>
            <Link to="/" style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "400",
              padding: "4px 12px",
              borderRadius: "6px",
              border: "1px solid #1e293b",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#1e293b";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#94a3b8";
            }}>
              ← Back to Home
            </Link>
            <span style={{ color: "#475569", fontSize: "12px", fontWeight: "300" }}>|</span>
            <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "300" }}>Admin</span>
          </div>

          {/* Right: User + Analytics + Logout */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span style={{ color: "#14b8a6", fontSize: "14px" }}>
              👋 {user?.name || "Admin"}
            </span>
            <Link to="/admin/analytics" style={{
              padding: "6px 16px",
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              border: "1px solid transparent"
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#14b8a6";
              e.target.style.borderColor = "#14b8a6";
              e.target.style.background = "rgba(20, 184, 166, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#94a3b8";
              e.target.style.borderColor = "transparent";
              e.target.style.background = "transparent";
            }}>
              📊 Analytics
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 20px",
                background: "transparent",
                color: "#94a3b8",
                border: "1px solid #475569",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "13px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#ef4444";
                e.target.style.color = "#fff";
                e.target.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#94a3b8";
                e.target.style.borderColor = "#475569";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "32px 40px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
            Dashboard
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            Manage properties and monitor platform activity
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Pending Approval</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#f59e0b" }}>{pendingCount}</p>
          </div>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Approved</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#10b981" }}>{approvedCount}</p>
          </div>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Featured</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#3b82f6" }}>{featuredCount}</p>
          </div>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px 24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Verified</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#8b5cf6" }}>{verifiedCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "0",
          marginBottom: "24px",
          borderBottom: "2px solid #e2e8f0",
          background: "#ffffff",
          borderRadius: "12px 12px 0 0",
          padding: "0 24px"
        }}>
          <button
            onClick={() => setActiveTab("pending")}
            style={{
              padding: "16px 24px",
              border: "none",
              background: "transparent",
              fontWeight: activeTab === "pending" ? "600" : "500",
              color: activeTab === "pending" ? "#0f172a" : "#64748b",
              borderBottom: activeTab === "pending" ? "2px solid #14b8a6" : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
          >
            Pending <span style={{
              background: activeTab === "pending" ? "#f59e0b" : "#e2e8f0",
              color: activeTab === "pending" ? "#0f172a" : "#64748b",
              padding: "2px 10px",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: "600",
              marginLeft: "8px"
            }}>{pendingCount}</span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            style={{
              padding: "16px 24px",
              border: "none",
              background: "transparent",
              fontWeight: activeTab === "all" ? "600" : "500",
              color: activeTab === "all" ? "#0f172a" : "#64748b",
              borderBottom: activeTab === "all" ? "2px solid #14b8a6" : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
          >
            All Properties <span style={{
              background: activeTab === "all" ? "#14b8a6" : "#e2e8f0",
              color: activeTab === "all" ? "#fff" : "#64748b",
              padding: "2px 10px",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: "600",
              marginLeft: "8px"
            }}>{properties.length}</span>
          </button>
        </div>

        {/* Property List */}
        {properties.length === 0 && activeTab === "all" ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
              No properties yet
            </h2>
            <p style={{ color: "#64748b" }}>Properties will appear here once they are uploaded.</p>
          </div>
        ) : (activeTab === "pending" ? pendingProperties : properties).length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
              All clear!
            </h2>
            <p style={{ color: "#64748b" }}>No {activeTab === "pending" ? "pending" : ""} properties to review.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {(activeTab === "pending" ? pendingProperties : properties).map((property) => (
              <div
                key={property._id}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  transition: "box-shadow 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"}
              >
                {/* Image */}
                <div
                  style={{
                    width: "100px",
                    height: "70px",
                    background: "#e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#94a3b8",
                        fontSize: "11px",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>
                        {property.title}
                      </h3>
                      <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "13px" }}>
                        {property.location} • {property.category}
                      </p>
                      <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#0f172a", fontSize: "15px" }}>
                        MK {property.price.toLocaleString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background:
                            property.status === "Approved"
                              ? "#10b981"
                              : property.status === "Rejected"
                              ? "#ef4444"
                              : "#f59e0b",
                          color: "#fff",
                          padding: "2px 12px",
                          borderRadius: "50px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {property.status}
                      </span>
                      {property.isFeatured && (
                        <span
                          style={{
                            background: "#3b82f6",
                            color: "#fff",
                            padding: "2px 12px",
                            borderRadius: "50px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          ⭐ Featured
                        </span>
                      )}
                      {property.isVerified && (
                        <span
                          style={{
                            background: "#8b5cf6",
                            color: "#fff",
                            padding: "2px 12px",
                            borderRadius: "50px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          ✅ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleVerifyToggle(property._id)}
                      style={{
                        padding: "4px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: property.isVerified ? "#8b5cf6" : "#e2e8f0",
                        color: property.isVerified ? "#fff" : "#475569",
                        fontWeight: "500",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (!property.isVerified) e.target.style.background = "#d1d5db";
                      }}
                      onMouseLeave={(e) => {
                        if (!property.isVerified) e.target.style.background = "#e2e8f0";
                      }}
                    >
                      {property.isVerified ? "Unverify" : "Verify"}
                    </button>

                    <button
                      onClick={() => handleFeatureToggle(property._id)}
                      style={{
                        padding: "4px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: property.isFeatured ? "#3b82f6" : "#e2e8f0",
                        color: property.isFeatured ? "#fff" : "#475569",
                        fontWeight: "500",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (!property.isFeatured) e.target.style.background = "#d1d5db";
                      }}
                      onMouseLeave={(e) => {
                        if (!property.isFeatured) e.target.style.background = "#e2e8f0";
                      }}
                    >
                      {property.isFeatured ? "Unfeature" : "Feature"}
                    </button>

                    {property.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(property._id)}
                          style={{
                            padding: "4px 14px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#10b981",
                            color: "#fff",
                            fontWeight: "500",
                            fontSize: "12px",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#059669"}
                          onMouseLeave={(e) => e.target.style.background = "#10b981"}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          style={{
                            padding: "4px 14px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#ef4444",
                            color: "#fff",
                            fontWeight: "500",
                            fontSize: "12px",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                          onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(property._id)}
                      style={{
                        padding: "4px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: "#e2e8f0",
                        color: "#64748b",
                        fontWeight: "500",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#fca5a5";
                        e.target.style.color = "#7f1d1d";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#e2e8f0";
                        e.target.style.color = "#64748b";
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "11px" }}>
                    Owner: {property.ownerName} • {property.ownerPhone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;