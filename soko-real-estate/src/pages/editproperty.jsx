import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [property, setProperty] = useState(null);

  const [saleRent, setSaleRent] = useState("sale");
  const [propertyType, setPropertyType] = useState("House");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    category: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    ownerName: "",
    ownerPhone: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

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

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("Fetching property ID:", id);
        
        const res = await axios.get(`https://soko-backend-hwvp.onrender.com/api/properties/${id}`);
        const propertyData = res.data;
        
        console.log("Property data received:", propertyData);

        if (!propertyData) {
          throw new Error("Property not found");
        }

        setProperty(propertyData);
        setFormData({
          title: propertyData.title || "",
          location: propertyData.location || "",
          price: propertyData.price || "",
          category: propertyData.category || "",
          bedrooms: propertyData.bedrooms || "",
          bathrooms: propertyData.bathrooms || "",
          description: propertyData.description || "",
          ownerName: propertyData.ownerName || "",
          ownerPhone: propertyData.ownerPhone || "",
        });
        setExistingImages(propertyData.images || []);

        // Determine sale/rent
        const cat = propertyData.category || "";
        if (cat.includes("Rent")) {
          setSaleRent("rent");
        } else if (cat.includes("Sale")) {
          setSaleRent("sale");
        }
        // Map category to property type
        if (cat.includes("House")) {
          setPropertyType("House");
        } else if (cat.includes("Apartment")) {
          setPropertyType("Apartment");
        } else if (cat.includes("Office")) {
          setPropertyType("Office");
        } else if (cat.includes("Land")) {
          setPropertyType("Land");
        } else if (cat.includes("Airbnb")) {
          setPropertyType("Airbnb");
        } else if (cat === "Others") {
          setPropertyType("Others");
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load property. Please try again.");
        setLoading(false);
      }
    };

    if (id && token) {
      fetchProperty();
    } else {
      navigate("/login");
    }
  }, [id, token, navigate]);

  const handleSaleRentToggle = (value) => {
    setSaleRent(value);
    const newCategory = getCategory(propertyType, value);
    setFormData((prev) => ({ ...prev, category: newCategory }));
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    const newCategory = getCategory(type, saleRent);
    setFormData((prev) => ({ ...prev, category: newCategory }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete([...imagesToDelete, imageToRemove]);
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      for (let i = 0; i < newImages.length; i++) {
        formDataToSend.append("images", newImages[i]);
      }
      if (imagesToDelete.length > 0) {
        formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      await axios.put(
        `https://soko-backend-hwvp.onrender.com/api/properties/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Property updated successfully!");
      setTimeout(() => navigate("/my-properties"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== LOADING STATE =====
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
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading property...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "20px"
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ color: "#ef4444", fontSize: "20px", marginBottom: "8px" }}>Something went wrong</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>{error}</p>
          <Link to="/my-properties" style={{
            display: "inline-block",
            padding: "10px 32px",
            background: "#0f172a",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600"
          }}>
            ← Back to My Properties
          </Link>
        </div>
      </div>
    );
  }

  // ===== PROPERTY NOT FOUND STATE =====
  if (!property) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "20px"
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
          <h2 style={{ color: "#0f172a", fontSize: "20px", marginBottom: "8px" }}>Property Not Found</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>The property you're trying to edit doesn't exist or has been removed.</p>
          <Link to="/my-properties" style={{
            display: "inline-block",
            padding: "10px 32px",
            background: "#0f172a",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600"
          }}>
            ← Back to My Properties
          </Link>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
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
          <Link to="/my-properties" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
            ← My Properties
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px 48px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0"
        }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
            Edit Property
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}>
            Update your property details
          </p>

          {error && <div style={{ background: "#fee2e2", border: "1px solid #ef4444", borderRadius: "8px", padding: "12px 16px", color: "#b91c1c", marginBottom: "20px" }}>{error}</div>}
          {success && <div style={{ background: "#dcfce7", border: "1px solid #22c55e", borderRadius: "8px", padding: "12px 16px", color: "#166534", marginBottom: "20px" }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Sale/Rent Toggle */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "8px" }}>Listing Type *</label>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => handleSaleRentToggle("sale")} style={{ padding: "10px 32px", border: saleRent === "sale" ? "2px solid #14b8a6" : "2px solid #e2e8f0", borderRadius: "8px", background: saleRent === "sale" ? "#14b8a6" : "transparent", color: saleRent === "sale" ? "#fff" : "#64748b", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s ease" }}>For Sale</button>
                <button type="button" onClick={() => handleSaleRentToggle("rent")} style={{ padding: "10px 32px", border: saleRent === "rent" ? "2px solid #14b8a6" : "2px solid #e2e8f0", borderRadius: "8px", background: saleRent === "rent" ? "#14b8a6" : "transparent", color: saleRent === "rent" ? "#fff" : "#64748b", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s ease" }}>For Rent</button>
              </div>
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Property Type *</label>
              <select value={propertyType} onChange={(e) => handlePropertyTypeChange(e.target.value)} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "#fff", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Office">Office</option>
                <option value="Land">Land</option>
                <option value="Airbnb">Airbnb</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Title */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Property Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Beautiful 3 Bedroom House" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* Location */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Location *</label>
              <select name="location" value={formData.location} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "#fff", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}>
                <option value="">Select Location</option>
                {malawiLocations.map((loc, index) => <option key={index} value={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Price (MK) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 15000000" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="e.g. 3" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="e.g. 2" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Describe your property..." style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* Owner Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Owner Name *</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required placeholder="Full name" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Owner Phone *</label>
                <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required placeholder="0999123456" style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#0f172a", outline: "none", transition: "border-color 0.2s ease" }} onFocus={(e) => e.target.style.borderColor = "#14b8a6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "8px" }}>Current Images</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {existingImages.map((img, index) => (
                    <div key={index} style={{ position: "relative", width: "100px", height: "100px", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                      <img src={img} alt={`property-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button type="button" onClick={() => handleRemoveExistingImage(index)} style={{ position: "absolute", top: "4px", right: "4px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>Add New Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "#fafafa", color: "#0f172a" }} />
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>You can select multiple images (max 10)</p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} style={{ width: "100%", padding: "14px", background: submitting ? "#94a3b8" : "#14b8a6", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (!submitting) e.target.style.background = "#0d9488"; }} onMouseLeave={(e) => { if (!submitting) e.target.style.background = "#14b8a6"; }}>
              {submitting ? "Saving..." : "Update Property"}
            </button>
          </form>
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

export default EditProperty;