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

  const applyFilters = () => {
    let results = allProperties;

    // 1. Sale / Rent toggle
    if (saleRent === "sale") {
      results = results.filter((p) => p.category.includes("Sale"));
    } else if (saleRent === "rent") {
      results = results.filter((p) => p.category.includes("Rent"));
    }

    // 2. Property type
    if (propertyType !== "all") {
      results = results.filter((p) => p.category === propertyType);
    }

    // 3. Location
    if (location.trim()) {
      const loc = location.toLowerCase();
      results = results.filter((p) =>
        p.location.toLowerCase().includes(loc)
      );
    }

    // 4. Price range
    if (priceMin) {
      results = results.filter((p) => p.price >= parseInt(priceMin));
    }
    if (priceMax) {
      results = results.filter((p) => p.price <= parseInt(priceMax));
    }

    // 5. Bedrooms
    if (showBedrooms && bedrooms) {
      results = results.filter((p) => p.bedrooms === parseInt(bedrooms));
    }

    setFilteredProperties(results);
  };

  useEffect(() => {
    if (allProperties.length > 0) applyFilters();
  }, [saleRent, propertyType, location, priceMin, priceMax, bedrooms, allProperties]);

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
            <Link to="/upload" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Sell
            </Link>
            <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Contact
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
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
          Browse All Properties
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>
          Find your dream property in Malawi
        </p>
      </div>

      {/* ===== SEARCH FILTERS ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px 40px"
      }}>
        {/* Sale / Rent Toggle */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px"
        }}>
          <button
            onClick={() => setSaleRent("sale")}
            style={{
              padding: "10px 32px",
              border: saleRent === "sale" ? "2px solid #14b8a6" : "2px solid #e2e8f0",
              borderRadius: "8px",
              background: saleRent === "sale" ? "#14b8a6" : "transparent",
              color: saleRent === "sale" ? "#fff" : "#64748b",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            For Sale
          </button>
          <button
            onClick={() => setSaleRent("rent")}
            style={{
              padding: "10px 32px",
              border: saleRent === "rent" ? "2px solid #14b8a6" : "2px solid #e2e8f0",
              borderRadius: "8px",
              background: saleRent === "rent" ? "#14b8a6" : "transparent",
              color: saleRent === "rent" ? "#fff" : "#64748b",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            For Rent
          </button>
        </div>

        {/* Property Type Nav (with "Others") */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "20px"
        }}>
          {[
            { key: "all", label: "All" },
            { key: "Houses for Sale", label: "Houses", showFor: "sale" },
            { key: "Houses for Rent", label: "Houses", showFor: "rent" },
            { key: "Apartments", label: "Apartments", showFor: "both" },
            { key: "Offices", label: "Offices", showFor: "both" },
            { key: "Land", label: "Land", showFor: "both" },
            { key: "Airbnb", label: "Airbnb", showFor: "both" },
            { key: "Others", label: "Others", showFor: "both" }, // ⬅️ ADDED
          ].map((type) => {
            if (type.showFor === "sale" && saleRent !== "sale") return null;
            if (type.showFor === "rent" && saleRent !== "rent") return null;
            return (
              <button
                key={type.key}
                onClick={() => setPropertyType(type.key)}
                style={{
                  padding: "6px 18px",
                  border: "none",
                  borderRadius: "50px",
                  background: propertyType === type.key ? "#14b8a6" : "rgba(0,0,0,0.05)",
                  color: propertyType === type.key ? "#fff" : "#475569",
                  fontSize: "14px",
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
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          border: "1px solid #e2e8f0",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 0.8fr 0.6fr",
          gap: "12px",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Location (e.g. Lilongwe)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#0f172a",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          <select
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              background: "#fff",
              color: "#0f172a",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          >
            <option value="">Min Price</option>
            <option value="0">MK 0</option>
            <option value="200000">MK 200,000</option>
            <option value="500000">MK 500,000</option>
            <option value="750000">MK 750,000</option>
            <option value="1000000">MK 1,000,000</option>
            <option value="1200000">MK 1,200,000</option>
          </select>
          <select
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              background: "#fff",
              color: "#0f172a",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          >
            <option value="">Max Price</option>
            <option value="1000000">MK 1M</option>
            <option value="5000000">MK 5M</option>
            <option value="10000000">MK 10M</option>
            <option value="20000000">MK 20M</option>
            <option value="50000000">MK 50M</option>
            <option value="100000000">MK 100M</option>
            <option value="9999999999">MK 100M+</option>
          </select>
          {showBedrooms && (
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              style={{
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#fff",
                color: "#0f172a",
                outline: "none",
                transition: "border-color 0.2s ease"
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
              padding: "12px",
              background: "#14b8a6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              transition: "background 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "#0d9488"}
            onMouseLeave={(e) => e.target.style.background = "#14b8a6"}
          >
            Search
          </button>
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px 60px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
            {filteredProperties.length} Properties Found
          </h2>
          <span style={{ color: "#64748b", fontSize: "14px" }}>
            {saleRent === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>

        {filteredProperties.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <p style={{ color: "#64748b", fontSize: "18px" }}>No properties match your criteria.</p>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px"
          }}>
            {filteredProperties.map((p) => (
              <Link key={p._id} to={`/property/${p._id}`} style={{
                background: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                textDecoration: "none",
                color: "inherit"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#14b8a6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
              >
                <div style={{ position: "relative", height: "200px", background: "#e2e8f0", overflow: "hidden" }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>No Image</div>
                  )}
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
                    }}>Featured</span>
                  )}
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
                    }}>Verified</span>
                  )}
                  <span style={{
                    position: "absolute",
                    top: "88px",
                    left: "12px",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "10px",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>{getSaleRentLabel(p.category)}</span>
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
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "14px", marginTop: "2px" }}>{p.location}</p>
                  <div style={{ display: "flex", gap: "20px", marginTop: "10px", fontSize: "14px", color: "#475569" }}>
                    <span>Bedrooms {p.bedrooms}</span>
                    <span>Bathrooms {p.bathrooms}</span>
                  </div>
                  <div style={{
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
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
    </div>
  );
};

export default Properties;
