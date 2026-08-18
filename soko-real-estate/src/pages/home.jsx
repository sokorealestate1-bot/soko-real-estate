import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [saleRent, setSaleRent] = useState("sale");
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

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
      setFilteredResults(approved.slice(0, 6));
      setFeatured(approved.filter((p) => p.isFeatured).slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // ===== FILTER LOGIC (FIXED) =====
  const applyFilters = () => {
    let results = allProperties;

    // 1. Sale / Rent toggle – ONLY APPLY IF propertyType is NOT "all"
    if (propertyType !== "all") {
      if (saleRent === "sale") {
        results = results.filter((p) => p.category.includes("Sale"));
      } else if (saleRent === "rent") {
        results = results.filter((p) => p.category.includes("Rent"));
      }
    }
    // If propertyType is "all", skip Sale/Rent filter (show everything)

    // 2. Property type (if not "all")
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

    // 4. Price range (number inputs)
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

    setFilteredResults(results.slice(0, 6));
  };

  // ===== AUTO-FILTER ON STATE CHANGE =====
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

  // ===== RESET BEDROOMS WHEN LAND IS SELECTED =====
  useEffect(() => {
    if (propertyType === "Land") {
      setBedrooms("");
    }
  }, [propertyType]);

  // ===== HANDLE SEARCH (manual override) =====
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

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
    <div>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="SOKO" style={{ height: "40px" }} />
          </Link>
          <div className="nav-links">
            <Link to="/properties">Browse</Link>
            <Link to="/upload">Sell</Link>
            <Link to="/map">Map View</Link>
            <Link to="/contact">Contact</Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="active">
                Admin
              </Link>
            )}
          </div>
          <div className="nav-auth">
            {token ? (
              <>
                <Link to="/my-properties" className="auth-link">
                  My Properties
                </Link>
                <button className="btn btn-danger" onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO / SEARCH SECTION ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">FIND YOUR DREAM PROPERTY</div>
          <h1>
            Search <span>Properties</span> in Malawi
          </h1>
          <p className="hero-sub">Houses · Apartments · Land · Offices</p>

          <div className="search-toggle-wrapper">
            <button
              className={`toggle-btn-large ${saleRent === "sale" ? "active" : ""}`}
              onClick={() => {
                setSaleRent("sale");
                setPropertyType("all");
              }}
            >
              For Sale
            </button>
            <button
              className={`toggle-btn-large ${saleRent === "rent" ? "active" : ""}`}
              onClick={() => {
                setSaleRent("rent");
                setPropertyType("all");
              }}
            >
              For Rent
            </button>
          </div>

          <div className="property-type-nav">
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
                  className={`type-btn ${propertyType === type.key ? "active" : ""}`}
                  onClick={() => setPropertyType(type.key)}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-row">
              <input
                type="text"
                placeholder="Location (e.g. Lilongwe)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="search-input"
              />
              <input
                type="number"
                placeholder="Min Price (MK)"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="search-input"
                min="0"
                step="100000"
              />
              <input
                type="number"
                placeholder="Max Price (MK)"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="search-input"
                min="0"
                step="100000"
              />
              {showBedrooms && (
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="search-select"
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              )}
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>

          <div className="trust-badges">
            <span>12-Month Warranty</span>
            <span>Best Price Guarantee</span>
            <span>Secure Transactions</span>
            <span>Trusted by Many</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">Top Picks</span>
              <h2>Featured Properties</h2>
              <p className="subtitle">Handpicked premium listings just for you</p>
            </div>
            <Link to="/properties" className="view-all">
              View All →
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="empty-state">
              <p>No featured properties yet</p>
            </div>
          ) : (
            <div className="card-grid">
              {featured.map((p) => (
                <Link key={p._id} to={`/property/${p._id}`} className="card">
                  <div className="card-img">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} />
                    ) : (
                      <div className="placeholder">No Image</div>
                    )}
                    <span className="badge-featured">Featured</span>
                    {p.isVerified && (
                      <span className="badge-verified" style={{
                        position: "absolute",
                        top: "50px",
                        left: "12px",
                        background: "#8b5cf6",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "50px",
                        fontSize: "10px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        zIndex: 2,
                      }}>
                        Verified
                      </span>
                    )}
                    <span className="badge-sale-rent">{getSaleRentLabel(p.category)}</span>
                    <span className="badge-price">MK {p.price.toLocaleString()}</span>
                  </div>
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p className="location">{p.location}</p>
                    <div className="details">
                      <span>Bedrooms {p.bedrooms}</span>
                      <span>Bathrooms {p.bathrooms}</span>
                    </div>
                    <div className="card-footer">
                      <span className="owner">By {p.ownerName}</span>
                      <span className="link">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SEARCH RESULTS ===== */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">Results</span>
              <h2>{saleRent === "sale" ? "Properties for Sale" : "Properties for Rent"}</h2>
              <p className="subtitle">Showing {filteredResults.length} properties</p>
            </div>
            <Link to="/properties" className="view-all">
              View All →
            </Link>
          </div>

          {filteredResults.length === 0 ? (
            <div className="empty-state">
              <p>No properties match your search</p>
            </div>
          ) : (
            <div className="card-grid">
              {filteredResults.map((p) => (
                <Link key={p._id} to={`/property/${p._id}`} className="card">
                  <div className="card-img">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} />
                    ) : (
                      <div className="placeholder">No Image</div>
                    )}
                    {p.isFeatured && (
                      <span className="badge-featured" style={{ background: "#f59e0b", color: "#0f172a" }}>
                        Featured
                      </span>
                    )}
                    {p.isVerified && (
                      <span className="badge-verified" style={{
                        position: "absolute",
                        top: "50px",
                        left: "12px",
                        background: "#8b5cf6",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "50px",
                        fontSize: "10px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        zIndex: 2,
                      }}>
                        Verified
                      </span>
                    )}
                    <span className="badge-sale-rent">{getSaleRentLabel(p.category)}</span>
                    <span className="badge-price">MK {p.price.toLocaleString()}</span>
                  </div>
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p className="location">{p.location}</p>
                    <div className="details">
                      <span>Bedrooms {p.bedrooms}</span>
                      <span>Bathrooms {p.bathrooms}</span>
                    </div>
                    <div className="card-footer">
                      <span className="owner">By {p.ownerName}</span>
                      <span className="link">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge">Get Started</div>
            <h2>Ready to List Your Property?</h2>
            <p>Join thousands of sellers who trust SOKO Real Estate</p>
            <Link to={token ? "/upload" : "/register"} className="btn btn-gold">
              {token ? "Upload Now" : "Sign Up Free"}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <div className="brand">
              <img src={logo} alt="SOKO" style={{ height: "30px" }} />
            </div>
            <div className="brand-sub">Real Estate</div>
            <p>Find your dream property in Malawi.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/properties">Browse Properties</Link>
            <Link to="/upload">Sell Your Property</Link>
            <Link to="/map">Map View</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p>📞 +265 885 767 077</p>
            <p>✉️ sokorealestate1@gmail.com</p>
            <p>📍 Lilongwe, Malawi</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 SOKO Real Estate. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        /* ===== SEARCH STYLES ===== */
        .search-toggle-wrapper {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .toggle-btn-large {
          padding: 12px 40px;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          background: transparent;
          color: #94a3b8;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .toggle-btn-large.active {
          background: #14b8a6;
          border-color: #14b8a6;
          color: #fff;
          box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
        }

        .toggle-btn-large:hover:not(.active) {
          border-color: #14b8a6;
          color: #fff;
        }

        .property-type-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .type-btn {
          padding: 6px 18px;
          border: none;
          border-radius: 50px;
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .type-btn.active {
          background: #14b8a6;
          color: #fff;
        }

        .search-box {
          max-width: 1000px;
          margin: 0 auto;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .search-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 0.8fr 0.6fr;
          gap: 12px;
          align-items: center;
        }

        .search-input,
        .search-select {
          padding: 12px 14px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          font-size: 14px;
          background: rgba(255,255,255,0.06);
          color: #fff;
          outline: none;
          transition: 0.2s;
          width: 100%;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-input:focus,
        .search-select:focus {
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
        }

        .search-select option {
          background: #0f172a;
          color: #fff;
        }

        .search-btn {
          padding: 12px 20px;
          background: #14b8a6;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: 0.2s;
          white-space: nowrap;
        }

        .search-btn:hover {
          background: #0d9488;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .search-row {
            grid-template-columns: 1fr 1fr;
          }
          .search-btn {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .search-toggle-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .toggle-btn-large {
            width: 80%;
            text-align: center;
            padding: 10px;
            font-size: 14px;
          }
          .property-type-nav {
            gap: 6px;
          }
          .type-btn {
            padding: 4px 12px;
            font-size: 12px;
          }
          .search-row {
            grid-template-columns: 1fr;
          }
          .search-btn {
            grid-column: span 1;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
