import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import PropertyMap from "../components/PropertyMap";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        `https://soko-backend-hwvp.onrender.com/api/properties/${id}`
      );
      setProperty(response.data);
      
      const allRes = await axios.get("https://soko-backend-hwvp.onrender.com/api/properties");
      const similar = allRes.data
        .filter(p => p._id !== id && p.category === response.data.category && p.status === "Approved")
        .slice(0, 3);
      setSimilarProperties(similar);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching property:", err);
      setError("Property not found");
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImage((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const getSaleRentLabel = (category) => {
    if (category?.toLowerCase().includes("rent")) return "For Rent";
    if (category?.toLowerCase().includes("sale")) return "For Sale";
    return category;
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title} - MK ${property.price.toLocaleString()}`,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Property link copied to clipboard! Share it with anyone.');
      }).catch(() => {
        prompt('Copy this link:', url);
      });
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
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px"
      }}>
        <p style={{ color: "#ef4444", fontSize: "18px" }}>{error || "Property not found"}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 24px",
            background: "#0f172a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
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
            <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 60px" }}>
        
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#14b8a6",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          ← Back to results
        </button>

        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "32px"
        }}>

          <div>
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{ position: "relative", height: "420px", background: "#e2e8f0" }}>
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[currentImage]}
                      alt={property.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap"
                    }}>
                      {property.isFeatured && (
                        <span style={{
                          background: "#f59e0b",
                          color: "#0f172a",
                          padding: "6px 16px",
                          borderRadius: "50px",
                          fontWeight: "700",
                          fontSize: "12px",
                          textTransform: "uppercase"
                        }}>
                          ⭐ Featured
                        </span>
                      )}
                      {property.isVerified && (
                        <span style={{
                          background: "#8b5cf6",
                          color: "#fff",
                          padding: "6px 16px",
                          borderRadius: "50px",
                          fontWeight: "600",
                          fontSize: "12px",
                          textTransform: "uppercase"
                        }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            padding: "10px 16px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "18px",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "rgba(0,0,0,0.8)"}
                          onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,0.6)"}
                        >
                          ‹
                        </button>
                        <button
                          onClick={nextImage}
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            padding: "10px 16px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "18px",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "rgba(0,0,0,0.8)"}
                          onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,0.6)"}
                        >
                          ›
                        </button>
                        <div style={{
                          position: "absolute",
                          bottom: "16px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          gap: "8px"
                        }}>
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImage(index)}
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                border: "none",
                                background: index === currentImage ? "#14b8a6" : "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                padding: 0
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#94a3b8",
                    fontSize: "16px"
                  }}>
                    No Images Available
                  </div>
                )}
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "32px",
              marginTop: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
            }}>
              {property.isVerified && (
                <div style={{
                  background: "#f3e8ff",
                  border: "1px solid #8b5cf6",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px"
                }}>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#6d28d9"
                  }}>✓</div>
                  <div>
                    <h4 style={{
                      margin: 0,
                      color: "#6d28d9",
                      fontWeight: "700",
                      fontSize: "15px"
                    }}>
                      Verified by SOKO Real Estate
                    </h4>
                    <p style={{
                      margin: "4px 0 0",
                      color: "#4b5563",
                      fontSize: "14px"
                    }}>
                      This property has been physically inspected by the SOKO Real Estate team.
                    </p>
                  </div>
                </div>
              )}

              <h1 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "8px"
              }}>
                {property.title}
              </h1>
              
              <p style={{
                color: "#64748b",
                fontSize: "16px",
                marginBottom: "16px"
              }}>
                📍 {property.location}
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px",
                flexWrap: "wrap"
              }}>
                <span style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#0f172a"
                }}>
                  MK {property.price.toLocaleString()}
                </span>
                <span style={{
                  background: "#e2e8f0",
                  padding: "4px 14px",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#475569"
                }}>
                  {property.category}
                </span>
                <span style={{
                  background: property.status === "Approved" ? "#10b981" : "#f59e0b",
                  color: property.status === "Approved" ? "#fff" : "#0f172a",
                  padding: "4px 14px",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {property.status}
                </span>
                <span style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: "4px 14px",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {getSaleRentLabel(property.category)}
                </span>
              </div>

              <div style={{
                display: "flex",
                gap: "32px",
                marginBottom: "20px",
                fontSize: "16px",
                color: "#475569"
              }}>
                <span>🛏️ Bedrooms: <strong>{property.bedrooms}</strong></span>
                <span>🚿 Bathrooms: <strong>{property.bathrooms}</strong></span>
              </div>

              <h3 style={{
                fontWeight: "600",
                color: "#0f172a",
                marginBottom: "8px",
                fontSize: "18px"
              }}>
                Description
              </h3>
              <p style={{
                color: "#475569",
                lineHeight: "1.8",
                fontSize: "15px"
              }}>
                {property.description}
              </p>

              <div style={{ marginTop: "24px" }}>
                <h3 style={{
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "8px",
                  fontSize: "18px"
                }}>
                  📍 Location
                </h3>
                <PropertyMap 
                  latitude={property.latitude} 
                  longitude={property.longitude} 
                  locationName={property.location} 
                />
              </div>

              <div style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#94a3b8",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px"
              }}>
                <p><strong>Listed by:</strong> {property.ownerName}</p>
                <p><strong>Phone:</strong> {property.ownerPhone}</p>
                <p><strong>Posted:</strong> {new Date(property.createdAt).toLocaleDateString()}</p>
                <p><strong>Last updated:</strong> {new Date(property.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              position: "sticky",
              top: "100px"
            }}>
              <h3 style={{
                fontWeight: "700",
                color: "#0f172a",
                fontSize: "18px",
                marginBottom: "20px"
              }}>
                Contact Owner
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <p style={{
                  color: "#475569",
                  fontSize: "14px",
                  marginBottom: "4px"
                }}>
                  <strong>Name:</strong> {property.ownerName}
                </p>
                <p style={{
                  color: "#475569",
                  fontSize: "14px"
                }}>
                  <strong>Phone:</strong> {property.ownerPhone}
                </p>
              </div>

              <button
                onClick={() => window.location.href = `tel:${property.ownerPhone}`}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "#1e293b"}
                onMouseLeave={(e) => e.target.style.background = "#0f172a"}
              >
                📞 Call Owner
              </button>

              <button
                onClick={() => {
                  const message = `Hello ${property.ownerName}, I'm interested in your property: ${property.title} (MK ${property.price.toLocaleString()})`;
                  window.open(`https://wa.me/265${property.ownerPhone}?text=${encodeURIComponent(message)}`, "_blank");
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#14b8a6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "#0d9488"}
                onMouseLeave={(e) => e.target.style.background = "#14b8a6"}
              >
                💬 WhatsApp
              </button>

              <button
                onClick={() => {
                  const subject = encodeURIComponent(`Inquiry about ${property.title}`);
                  const body = encodeURIComponent(`Hello ${property.ownerName},\n\nI'm interested in your property: ${property.title}\nPrice: MK ${property.price.toLocaleString()}\nLocation: ${property.location}\n\nPlease contact me with more details.`);
                  window.location.href = `mailto:${property.ownerEmail || 'sokorealestate1@gmail.com'}?subject=${subject}&body=${body}`;
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "10px",
                  background: "#ffffff",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ffffff";
                  e.target.style.borderColor = "#e2e8f0";
                }}
              >
                ✉️ Send Email
              </button>

              {/* ===== SHARE BUTTON ===== */}
              <button
                onClick={handleShare}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  background: "#f8fafc",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e2e8f0";
                  e.target.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#e2e8f0";
                }}
              >
                📤 Share Property
              </button>

              <div style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #e2e8f0"
              }}>
                <p style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  textAlign: "center",
                  lineHeight: "1.6"
                }}>
                  <strong>Share this property</strong><br />
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {window.location.href}
                  </span>
                </p>
              </div>
            </div>

            {similarProperties.length > 0 && (
              <div style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                marginTop: "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
              }}>
                <h4 style={{
                  fontWeight: "700",
                  color: "#0f172a",
                  fontSize: "16px",
                  marginBottom: "16px"
                }}>
                  Similar Properties
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {similarProperties.map((p) => (
                    <Link key={p._id} to={`/property/${p._id}`} style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "inherit",
                      padding: "8px",
                      borderRadius: "8px",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{
                        width: "60px",
                        height: "60px",
                        background: "#e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0
                      }}>
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "10px" }}>
                            No img
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#0f172a",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>{p.title}</p>
                        <p style={{
                          fontSize: "13px",
                          color: "#64748b",
                          margin: 0
                        }}>MK {p.price.toLocaleString()}</p>
                      </div>
                      <span style={{ color: "#14b8a6", fontSize: "18px" }}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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

export default PropertyDetails;