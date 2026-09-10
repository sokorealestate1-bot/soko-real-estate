import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import PropertyMap from "../components/PropertyMap";
import { getImageUrl } from "../utils/imageUtils";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        `https://soko-backend-hwvp.onrender.com/api/properties/${id}`
      );
      setProperty(response.data);

      const allRes = await axios.get(
        "https://soko-backend-hwvp.onrender.com/api/properties"
      );
      const similar = allRes.data
        .filter(
          (p) =>
            p._id !== id &&
            p.category === response.data.category &&
            p.status === "Approved"
        )
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
      navigator
        .share({
          title: property.title,
          text: `Check out this property: ${property.title} - MK ${property.price.toLocaleString()}`,
          url: url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Property link copied to clipboard!");
        })
        .catch(() => {
          prompt("Copy this link:", url);
        });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e2e8f0",
              borderTopColor: "#14b8a6",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "16px", color: "#64748b" }}>
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p style={{ color: "#ef4444", fontSize: "18px" }}>
          {error || "Property not found"}
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 24px",
            background: "#0f172a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* ===== NAVBAR ===== */}
      <nav
        style={{
          background: "#0f172a",
          padding: isMobile ? "0 16px" : "0 40px",
          height: isMobile ? "60px" : "72px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <img
              src={logo}
              alt="SOKO"
              style={{ height: isMobile ? "30px" : "40px" }}
            />
          </Link>
          <div style={{ display: "flex", gap: isMobile ? "12px" : "24px" }}>
            <Link
              to="/"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: "500",
              }}
            >
              Home
            </Link>
            <Link
              to="/properties"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: "500",
              }}
            >
              Browse
            </Link>
            {!isMobile && (
              <Link
                to="/contact"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Contact
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "16px 12px 40px" : "32px 20px 60px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#14b8a6",
            fontSize: isMobile ? "14px" : "15px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: isMobile ? "16px" : "24px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: 0,
          }}
        >
          ← Back to results
        </button>

        {/* Responsive Grid: 1 column on mobile, 2 columns on PC */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            gap: isMobile ? "16px" : "32px",
          }}
        >
          {/* ===== LEFT COLUMN ===== */}
          <div>
            {/* Image Gallery */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: isMobile ? "240px" : "420px",
                  background: "#e2e8f0",
                }}
              >
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(property.images[currentImage])}
                      alt={property.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Badges */}
                    <div
                      style={{
                        position: "absolute",
                        top: isMobile ? "10px" : "16px",
                        left: isMobile ? "10px" : "16px",
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      {property.isFeatured && (
                        <span
                          style={{
                            background: "#f59e0b",
                            color: "#0f172a",
                            padding: isMobile ? "4px 10px" : "6px 16px",
                            borderRadius: "50px",
                            fontWeight: "700",
                            fontSize: isMobile ? "10px" : "12px",
                            textTransform: "uppercase",
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
                            padding: isMobile ? "4px 10px" : "6px 16px",
                            borderRadius: "50px",
                            fontWeight: "600",
                            fontSize: isMobile ? "10px" : "12px",
                            textTransform: "uppercase",
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          style={{
                            position: "absolute",
                            left: isMobile ? "8px" : "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            border: "none",
                            width: isMobile ? "32px" : "40px",
                            height: isMobile ? "32px" : "40px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: isMobile ? "14px" : "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ‹
                        </button>
                        <button
                          onClick={nextImage}
                          style={{
                            position: "absolute",
                            right: isMobile ? "8px" : "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            border: "none",
                            width: isMobile ? "32px" : "40px",
                            height: isMobile ? "32px" : "40px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: isMobile ? "14px" : "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ›
                        </button>

                        {/* Dots */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: isMobile ? "10px" : "16px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "6px",
                          }}
                        >
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImage(index)}
                              style={{
                                width: isMobile ? "8px" : "10px",
                                height: isMobile ? "8px" : "10px",
                                borderRadius: "50%",
                                border: "none",
                                background:
                                  index === currentImage
                                    ? "#14b8a6"
                                    : "rgba(255,255,255,0.6)",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#94a3b8",
                      fontSize: "15px",
                    }}
                  >
                    No Images Available
                  </div>
                )}
              </div>
            </div>

            {/* Property Info Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: isMobile ? "20px 16px" : "32px",
                marginTop: isMobile ? "16px" : "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >
              {property.isVerified && (
                <div
                  style={{
                    background: "#f3e8ff",
                    border: "1px solid #8b5cf6",
                    borderRadius: "12px",
                    padding: isMobile ? "12px 14px" : "16px 20px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#6d28d9",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        color: "#6d28d9",
                        fontWeight: "700",
                        fontSize: isMobile ? "13px" : "15px",
                      }}
                    >
                      Verified by SOKO Real Estate
                    </h4>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#4b5563",
                        fontSize: isMobile ? "12px" : "14px",
                      }}
                    >
                      Physically inspected by the SOKO team.
                    </p>
                  </div>
                </div>
              )}

              <h1
                style={{
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "8px",
                  lineHeight: "1.3",
                }}
              >
                {property.title}
              </h1>

              <p
                style={{
                  color: "#64748b",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: "14px",
                }}
              >
                📍 {property.location}
              </p>

              {/* Price + Tags */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: isMobile ? "22px" : "28px",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  MK {property.price.toLocaleString()}
                </span>
                <span
                  style={{
                    background: "#e2e8f0",
                    padding: isMobile ? "3px 10px" : "4px 14px",
                    borderRadius: "50px",
                    fontSize: isMobile ? "11px" : "14px",
                    fontWeight: "500",
                    color: "#475569",
                  }}
                >
                  {property.category}
                </span>
                <span
                  style={{
                    background:
                      property.status === "Approved" ? "#10b981" : "#f59e0b",
                    color: property.status === "Approved" ? "#fff" : "#0f172a",
                    padding: isMobile ? "3px 10px" : "4px 14px",
                    borderRadius: "50px",
                    fontSize: isMobile ? "11px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  {property.status}
                </span>
                <span
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    padding: isMobile ? "3px 10px" : "4px 14px",
                    borderRadius: "50px",
                    fontSize: isMobile ? "11px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  {getSaleRentLabel(property.category)}
                </span>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "20px" : "32px",
                  marginBottom: "20px",
                  fontSize: isMobile ? "14px" : "16px",
                  color: "#475569",
                }}
              >
                <span>
                  🛏️ Bedrooms: <strong>{property.bedrooms}</strong>
                </span>
                <span>
                  🚿 Bathrooms: <strong>{property.bathrooms}</strong>
                </span>
              </div>

              <h3
                style={{
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "8px",
                  fontSize: isMobile ? "16px" : "18px",
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.7",
                  fontSize: isMobile ? "14px" : "15px",
                }}
              >
                {property.description}
              </p>

              {/* Map */}
              <div style={{ marginTop: isMobile ? "20px" : "24px" }}>
                <h3
                  style={{
                    fontWeight: "600",
                    color: "#0f172a",
                    marginBottom: "8px",
                    fontSize: isMobile ? "16px" : "18px",
                  }}
                >
                  📍 Location
                </h3>
                <PropertyMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  locationName={property.location}
                />
              </div>

              {/* Meta info */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: isMobile ? "12px" : "14px",
                  color: "#94a3b8",
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "6px",
                }}
              >
                <p>
                  <strong>Listed by:</strong> {property.ownerName}
                </p>
                <p>
                  <strong>Phone:</strong> {property.ownerPhone}
                </p>
                <p>
                  <strong>Posted:</strong>{" "}
                  {new Date(property.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(property.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div>
            {/* Contact Owner Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: isMobile ? "20px 16px" : "28px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                position: isMobile ? "static" : "sticky",
                top: isMobile ? "auto" : "100px",
                marginTop: isMobile ? "16px" : "0",
              }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  color: "#0f172a",
                  fontSize: isMobile ? "16px" : "18px",
                  marginBottom: "16px",
                }}
              >
                Contact Owner
              </h3>

              <div style={{ marginBottom: "14px" }}>
                <p
                  style={{
                    color: "#475569",
                    fontSize: isMobile ? "13px" : "14px",
                    marginBottom: "4px",
                  }}
                >
                  <strong>Name:</strong> {property.ownerName}
                </p>
                <p
                  style={{
                    color: "#475569",
                    fontSize: isMobile ? "13px" : "14px",
                  }}
                >
                  <strong>Phone:</strong> {property.ownerPhone}
                </p>
              </div>

              <button
                onClick={() =>
                  (window.location.href = `tel:${property.ownerPhone}`)
                }
                style={{
                  width: "100%",
                  padding: isMobile ? "12px" : "14px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: isMobile ? "14px" : "15px",
                  cursor: "pointer",
                  marginBottom: "8px",
                }}
              >
                📞 Call Owner
              </button>

              <button
                onClick={() => {
                  const message = `Hello ${property.ownerName}, I'm interested in your property: ${property.title} (MK ${property.price.toLocaleString()})`;
                  window.open(
                    `https://wa.me/265${property.ownerPhone}?text=${encodeURIComponent(
                      message
                    )}`,
                    "_blank"
                  );
                }}
                style={{
                  width: "100%",
                  padding: isMobile ? "12px" : "14px",
                  background: "#14b8a6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: isMobile ? "14px" : "15px",
                  cursor: "pointer",
                  marginBottom: "8px",
                }}
              >
                💬 WhatsApp
              </button>

              <button
                onClick={handleShare}
                style={{
                  width: "100%",
                  padding: isMobile ? "12px" : "12px",
                  background: "#f8fafc",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: isMobile ? "14px" : "14px",
                  cursor: "pointer",
                }}
              >
                📤 Share Property
              </button>
            </div>

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "20px 16px" : "24px",
                  marginTop: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                <h4
                  style={{
                    fontWeight: "700",
                    color: "#0f172a",
                    fontSize: isMobile ? "15px" : "16px",
                    marginBottom: "14px",
                  }}
                >
                  Similar Properties
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {similarProperties.map((p) => (
                    <Link
                      key={p._id}
                      to={`/property/${p._id}`}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "inherit",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f8fafc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          background: "#e2e8f0",
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {p.images?.[0] ? (
                          <img
                            src={getImageUrl(p.images[0])}
                            alt={p.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              color: "#94a3b8",
                              fontSize: "10px",
                            }}
                          >
                            No img
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: isMobile ? "13px" : "14px",
                            fontWeight: "600",
                            color: "#0f172a",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.title}
                        </p>
                        <p
                          style={{
                            fontSize: isMobile ? "12px" : "13px",
                            color: "#64748b",
                            margin: 0,
                          }}
                        >
                          MK {p.price.toLocaleString()}
                        </p>
                      </div>
                      <span
                        style={{ color: "#14b8a6", fontSize: "16px" }}
                      >
                        →
                      </span>
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