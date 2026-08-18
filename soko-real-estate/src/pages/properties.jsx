import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const Properties = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [saleRent, setSaleRent] = useState("sale");
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const showBedrooms = propertyType !== "Land";

  // ===== FETCH PROPERTIES =====
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get("https://soko-backend-hwvp.onrender.com/api/properties");
      const approved = res.data.filter((p) => p.status === "Approved");
      setAllProperties(approved);
      setFilteredProperties(approved);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // ===== FILTER LOGIC =====
  const applyFilters = () => {
    let results = allProperties;

    if (propertyType !== "all") {
      if (saleRent === "sale") {
        results = results.filter((p) => p.category.includes("Sale"));
      } else if (saleRent === "rent") {
        results = results.filter((p) => p.category.includes("Rent"));
      }
    }

    if (propertyType !== "all") {
      results = results.filter((p) => p.category === propertyType);
    }

    if (location.trim()) {
      const loc = location.toLowerCase();
      results = results.filter((p) =>
        p.location.toLowerCase().includes(loc)
      );
    }

    if (priceMin) {
      results = results.filter((p) => p.price >= parseInt(priceMin));
    }
    if (priceMax) {
      results = results.filter((p) => p.price <= parseInt(priceMax));
    }

    if (showBedrooms && bedrooms) {
      results = results.filter((p) => p.bedrooms === parseInt(bedrooms));
    }

    setFilteredProperties(results);
  };

  // ===== AUTO-FILTER =====
  useEffect(() => {
    if (allProperties.length > 0) {
      applyFilters();
    }
  }, [
    saleRent,
    propertyType,
    location,
    priceMin,
    priceMax,
    bedrooms,
    allProperties,
  ]);

  const getSaleRentLabel = (category) => {
    if (category.toLowerCase().includes("rent")) return "For Rent";
    if (category.toLowerCase().includes("sale")) return "For Sale";
    return category;
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
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
        padding: "0 20px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <img src={logo} alt="SOKO" style={{ height: "32px" }} />
          </Link>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}>
              Home
            </Link>
            <Link to="/upload" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}>
              Sell
            </Link>
            <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}>
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== PAGE HEADER ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px 16px 16px"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
          Browse All Properties
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          Find your dream property in Malawi
        </p>
      </div>

      {/* ===== SEARCH FILTERS ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px 32px"
      }}>
        {/* Sale / Rent Toggle */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "14px"
        }}>
          <button
            onClick={() => {
              setSaleRent("sale");
              setPropertyType("all");
            }}
            style={{
              padding: "8px 28px",
              border: saleRent === "sale" ? "2px solid #14b8a6" : "2px solid #e2e8f0",
              borderRadius: "8px",
              background: saleRent === "sale" ? "#14b8a6" : "transparent",
              color: saleRent === "sale" ? "#fff" : "#64748b",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            For Sale
          </button>
          <button
            onClick={() => {
              setSaleRent("rent");
              setPropertyType("all");
            }}
            style={{
              padding: "8px 28px",
              border: saleRent === "rent" ? "2px solid #14b8a6" : "2px solid #e2e8f0",
              borderRadius: "8px",
              background: saleRent === "rent" ? "#14b8a6" : "transparent",
              color: saleRent === "rent" ? "#fff" : "#64748b",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            For Rent
          </button>
        </div>

        {/* Property Type Nav */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px",
          marginBottom: "16px"
        }}>
          {[
            { key: "all", label: "All" },
            { key: "Houses for Sale", label: "Houses", showFor: "sale" },
            { key: "Houses for Rent", label: "Houses", showFor: "rent" },
            { key: "Apartments", label: "Apartments", showFor: "both" },
            { key: "Offices", label: "Offices", showFor: "both" },
            { key: "Land", label: "Land", showFor: "both" },
            { key: "Airbnb", label: "Airbnb", showFor: "both" },
            { key: "Others", label: "Others", showFor: "both" },
          ].map((type) => {
            if (type.showFor === "sale" && saleRent !== "sale") return null;
            if (type.showFor === "rent" && saleRent !== "rent") return null;
            return (
              <button
                key={type.key}
                onClick={() => setPropertyType(type.key)}
                style={{
                  padding: "4px 14px",
                  border: "none",
                  borderRadius: "50px",
                  background: propertyType === type.key ? "#14b8a6" : "rgba(0,0,0,0.05)",
                  color: propertyType === type.key ? "#fff" : "#475569",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          border: "1px solid #e2e8f0",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#0f172a",
              outline: "none",
              transition: "border-color 0.2s ease",
              width: "100%"
            }}
            onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#0f172a",
              outline: "none",
              transition: "border-color 0.2s ease",
              width: "100%"
            }}
            onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            min="0"
            step="100000"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#0f172a",
              outline: "none",
              transition: "border-color 0.2s ease",
              width: "100%"
            }}
            onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            min="0"
            step="100000"
          />
          {showBedrooms && (
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#fff",
                color: "#0f172a",
                outline: "none",
                transition: "border-color 0.2s ease",
                width: "100%"
              }}
              onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            >
              <option value="">Bedrooms</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          )}
          <button
            onClick={applyFilters}
            style={{
              padding: "10px",
              background: "#14b8a6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background 0.2s ease",
              width: "100%"
            }}
            onMouseEnter={(e) => e.target.style.background = "#0d9488"}
            onMouseLeave={(e) => e.target.style.background = "#14b8a6"}
          >
            Search
          </button>
        </div>
      </div>

      {/* ===== RESULTS - Responsive Grid ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px 40px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
            {filteredProperties.length} Properties Found
          </h2>
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            {saleRent === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>

        {filteredProperties.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 16px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <p style={{ color: "#64748b", fontSize: "16px" }}>No properties match your criteria.</p>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px"
          }}>
            {filteredProperties.map((p) => (
              <Link key={p._id} to={`/property/${p._id}`} style={{
                background: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                textDecoration: "none",
                color: "inherit"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              }}
              >
                <div style={{ position: "relative", height: "180px", background: "#e2e8f0", overflow: "hidden" }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>No Image</div>
                  )}
                  {p.isFeatured && (
                    <span style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      background: "#f59e0b",
                      color: "#0f172a",
                      padding: "2px 10px",
                      borderRadius: "50px",
                      fontSize: "9px",
                      fontWeight: "700",
                      textTransform: "uppercase"
                    }}>Featured</span>
                  )}
                  {p.isVerified && (
                    <span style={{
                      position: "absolute",
                      top: "30px",
                      left: "8px",
                      background: "#8b5cf6",
                      color: "#fff",
                      padding: "2px 10px",
                      borderRadius: "50px",
                      fontSize: "8px",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>Verified</span>
                  )}
                  <span style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    background: "rgba(15,23,42,0.85)",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    fontSize: "13px"
                  }}>MK {p.price.toLocaleString()}</span>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <span style={{
                    display: "inline-block",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "2px 10px",
                    borderRadius: "50px",
                    fontSize: "8px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    marginBottom: "4px"
                  }}>{getSaleRentLabel(p.category)}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: "4px 0" }}>{p.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "13px", margin: "2px 0 0" }}>{p.location}</p>
                  <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "13px", color: "#475569" }}>
                    <span>🛏️ {p.bedrooms}</span>
                    <span>🚿 {p.bathrooms}</span>
                  </div>
                  <div style={{
                    marginTop: "10px",
                    paddingTop: "8px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#94a3b8"
                  }}>
                    <span>By {p.ownerName}</span>
                    <span style={{ color: "#0f172a", fontWeight: "600" }}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ===== RESPONSIVE MEDIA QUERIES ===== */}
      <style>{`
        @media (max-width: 768px) {
          .search-box-grid {
            grid-template-columns: 1fr !important;
          }
          .properties-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .properties-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .search-box-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1025px) {
          .properties-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .search-box-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Properties;
