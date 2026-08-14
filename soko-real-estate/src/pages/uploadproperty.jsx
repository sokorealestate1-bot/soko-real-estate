import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import LocationPicker from "../components/LocationPicker";

const UploadProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [saleRent, setSaleRent] = useState("sale");
  const [propertyType, setPropertyType] = useState("House");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    category: "Houses for Sale",
    bedrooms: "",
    bathrooms: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
    latitude: null,
    longitude: null,
  });

  const [images, setImages] = useState([]);
  const token = localStorage.getItem("token");

  const malawiLocations = [
    "Lilongwe", "Blantyre", "Mzuzu", "Zomba",
    "Dedza", "Dowa", "Kasungu", "Mchinji", "Nkhotakota", "Ntcheu", "Ntchisi", "Salima",
    "Chitipa", "Karonga", "Likoma", "Mzimba", "Nkhata Bay", "Rumphi",
    "Balaka", "Chikwawa", "Chiradzulu", "Machinga", "Mangochi", "Mulanje",
    "Mwanza", "Nsanje", "Phalombe", "Thyolo",
    "Area 25 (Lilongwe)", "Area 47 (Lilongwe)", "Area 49 (Lilongwe)",
    "Kanengo (Lilongwe)", "Kawale (Lilongwe)", "Lilongwe City Centre",
    "Old Town (Blantyre)", "Soche (Blantyre)", "Limbe (Blantyre)",
    "Chichiri (Blantyre)", "Mpingwe (Blantyre)", "Namiwawa (Blantyre)",
    "Kachere (Blantyre)", "Zomba City", "Zomba Plateau",
    "Luwinga (Mzuzu)", "Katoto (Mzuzu)", "Chibavi (Mzuzu)", "Nkhorongo (Mzuzu)",
    "Cape Maclear (Mangochi)", "Monkey Bay (Mangochi)", "Senga Bay (Salima)",
    "Likoma Island", "Chintheche (Nkhata Bay)"
  ];

  const saleTypes = [
    "Houses for Sale", "Apartments", "Offices", "Land", "Airbnb", "Others"
  ];
  const rentTypes = [
    "Houses for Rent", "Apartments", "Offices", "Land", "Airbnb", "Others"
  ];
  const propertyTypes = saleRent === "sale" ? saleTypes : rentTypes;

  const getCategory = (type, saleRentValue) => {
    if (type === "House") {
      return saleRentValue === "sale" ? "Houses for Sale" : "Houses for Rent";
    }
    switch (type) {
      case "Apartment": return "Apartments";
      case "Office": return "Offices";
      case "Land": return "Land";
      case "Airbnb": return "Airbnb";
      case "Others": return "Others";
      default: return "Houses for Sale";
    }
  };

  const updateCategory = (type = propertyType, saleRentValue = saleRent) => {
    const newCategory = getCategory(type, saleRentValue);
    setFormData((prev) => ({ ...prev, category: newCategory }));
  };

  const handleSaleRentToggle = (value) => {
    setSaleRent(value);
    updateCategory(propertyType, value);
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    updateCategory(type, saleRent);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleLocationChange = (pos) => {
    setFormData(prev => ({
      ...prev,
      latitude: pos.lat,
      longitude: pos.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      for (let i = 0; i < images.length; i++) {
        formDataToSend.append("images", images[i]);
      }

      await axios.post(
        "http://localhost:5000/api/upload",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Property uploaded successfully! Waiting for admin approval.");
      setTimeout(() => {
        navigate("/my-properties");
      }, 2500);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Segoe UI', Arial, sans-serif"
    }}>
      {/* ===== MINI NAV ===== */}
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
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* ===== MAIN FORM ===== */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px 48px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0"
        }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
            Upload Property
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>
            List your property on SOKO Real Estate — reach thousands of buyers and renters in Malawi.
          </p>

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#b91c1c",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#dcfce7",
              border: "1px solid #22c55e",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#166534",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ===== SALE / RENT TOGGLE ===== */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "8px" }}>
                Listing Type *
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => handleSaleRentToggle("sale")}
                  style={{
                    padding: "10px 32px",
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
                  type="button"
                  onClick={() => handleSaleRentToggle("rent")}
                  style={{
                    padding: "10px 32px",
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
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                This determines which search results your property appears in
              </p>
            </div>

            {/* ===== PROPERTY TYPE ===== */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Property Type *
              </label>
              <select
                value={propertyType}
                onChange={(e) => handlePropertyTypeChange(e.target.value)}
                required
                style={{
                  width: "100%",
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
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Office">Office</option>
                <option value="Land">Land</option>
                <option value="Airbnb">Airbnb</option>
                <option value="Others">Others</option>
              </select>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                For "House", the listing will be saved as "Houses for Sale" or "Houses for Rent" based on your selection above.
              </p>
            </div>

            {/* ===== TITLE ===== */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Beautiful 3 Bedroom House in Lilongwe"
                style={{
                  width: "100%",
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
            </div>

            {/* ===== LOCATION ===== */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Location *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
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
                <option value="">Select Location</option>
                {malawiLocations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* ===== PRICE ===== */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Price (MK) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="e.g. 15000000"
                style={{
                  width: "100%",
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
            </div>

            {/* ===== BEDROOMS & BATHROOMS ===== */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  style={{
                    width: "100%",
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
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  style={{
                    width: "100%",
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
              </div>
            </div>

            {/* ===== DESCRIPTION ===== */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your property in detail — location, amenities, nearby schools, etc."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#0f172a",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#14b8a6"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* ===== OWNER DETAILS ===== */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  style={{
                    width: "100%",
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
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Owner Phone *
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  required
                  placeholder="0999123456"
                  style={{
                    width: "100%",
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
              </div>
            </div>

            {/* ===== IMAGES ===== */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "#fafafa",
                  color: "#0f172a"
                }}
              />
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                You can select multiple images (max 10)
              </p>
            </div>

            {/* ===== LOCATION PICKER ===== */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                📍 Pin Property Location
              </label>
              <LocationPicker
                initialPosition={{ lat: -13.2543, lng: 34.3015 }}
                onLocationChange={handleLocationChange}
              />
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                Drag the marker or click on the map to pin the exact location of your property.
              </p>
            </div>

            {/* ===== SUBMIT ===== */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#94a3b8" : "#14b8a6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = "#0d9488";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = "#14b8a6";
              }}
            >
              {loading ? "Uploading..." : "Upload Property"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProperty;