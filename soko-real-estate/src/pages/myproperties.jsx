import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyProperties();
  }, [token, navigate]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/properties/my/properties",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperties(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load your properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      setDeleting(id);
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
      alert(err.response?.data?.message || "Failed to delete property. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Approved":
        return { background: "#10b981", color: "#fff" };
      case "Rejected":
        return { background: "#ef4444", color: "#fff" };
      case "Pending":
      default:
        return { background: "#f59e0b", color: "#0f172a" };
    }
  };

  const getSaleRentLabel = (category) => {
    if (category.toLowerCase().includes("rent")) return "For Rent";
    if (category.toLowerCase().includes("sale")) return "For Sale";
    return category;
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
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading your properties...</p>
        </div>
      </div>
    );
  }

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
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Home
            </Link>
            <Link to="/properties" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Browse
            </Link>
            <Link to="/upload" style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              + Upload
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== PAGE HEADER ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px 20px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
              My Properties
            </h1>
            <p style={{ color: "#64748b", fontSize: "16px" }}>
              Manage your listings on SOKO Real Estate
            </p>
          </div>
          <Link to="/upload" style={{
            padding: "12px 24px",
            background: "#14b8a6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.2s ease",
            display: "inline-block"
          }}
          onMouseEnter={(e) => e.target.style.background = "#0d9488"}
          onMouseLeave={(e) => e.target.style.background = "#14b8a6"}
          >
            + Upload New Property
          </Link>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px 60px"
      }}>
        {error && (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#b91c1c",
            marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
            <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
              No Properties Yet
            </h2>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              You haven't uploaded any properties. List your first property today!
            </p>
            <Link to="/upload" style={{
              padding: "12px 32px",
              background: "#14b8a6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "#0d9488"}
            onMouseLeave={(e) => e.target.style.background = "#14b8a6"}
            >
              Upload Your First Property
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px"
          }}>
            {properties.map((p) => (
              <div key={p._id} style={{
                background: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease"
              }}>
                {/* Image */}
                <div style={{ position: "relative", height: "200px", background: "#e2e8f0", overflow: "hidden" }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                      No Image
                    </div>
                  )}
                  {/* Featured Badge */}
                  {p.isFeatured && (
                    <span style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "#f59e0b",
                      color: "#0f172a",
                      padding: "4px 12px",
                      borderRadius: "50px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase"
                    }}>⭐ Featured</span>
                  )}
                  {/* Verified Badge */}
                  {p.isVerified && (
                    <span style={{
                      position: "absolute",
                      top: "50px",
                      left: "12px",
                      background: "#8b5cf6",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "50px",
                      fontSize: "10px",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>✓ Verified</span>
                  )}
                  {/* Status Badge */}
                  <span style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "4px 14px",
                    borderRadius: "50px",
                    fontSize: "11px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    ...getStatusBadgeStyle(p.status)
                  }}>{p.status}</span>
                  {/* Sale/Rent Badge */}
                  <span style={{
                    position: "absolute",
                    bottom: "50px",
                    left: "12px",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "10px",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>{getSaleRentLabel(p.category)}</span>
                  {/* Price */}
                  <span style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    background: "rgba(15,23,42,0.85)",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px"
                  }}>MK {p.price.toLocaleString()}</span>
                </div>

                {/* Body */}
                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    fontSize: "17px",
                    fontWeight: "600",
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>{p.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "14px", marginTop: "2px" }}>{p.location}</p>
                  <div style={{ display: "flex", gap: "20px", marginTop: "10px", fontSize: "14px", color: "#475569" }}>
                    <span>🛏️ {p.bedrooms}</span>
                    <span>🚿 {p.bathrooms}</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    gap: "10px"
                  }}>
                    <Link to={`/edit-property/${p._id}`} style={{
                      flex: 1,
                      padding: "8px",
                      background: "#0f172a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      textDecoration: "none",
                      textAlign: "center",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#1e293b"}
                    onMouseLeave={(e) => e.target.style.background = "#0f172a"}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: deleting === p._id ? "not-allowed" : "pointer",
                        opacity: deleting === p._id ? 0.6 : 1,
                        transition: "background 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (deleting !== p._id) e.target.style.background = "#dc2626";
                      }}
                      onMouseLeave={(e) => {
                        if (deleting !== p._id) e.target.style.background = "#ef4444";
                      }}
                    >
                      {deleting === p._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  {/* Created date */}
                  <p style={{
                    marginTop: "10px",
                    fontSize: "11px",
                    color: "#94a3b8"
                  }}>
                    Posted: {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== SPINNER ANIMATION ===== */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MyProperties;