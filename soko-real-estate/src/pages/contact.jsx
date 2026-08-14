import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      setSuccess(response.data.message || "Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
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

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
            Get in Touch
          </h1>
          <p style={{ color: "#64748b", fontSize: "18px" }}>
            Have questions about SOKO Real Estate? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>

          {/* ===== LEFT: CONTACT INFO ===== */}
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "24px" }}>
              Contact Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  background: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#14b8a6"
                }}>📍</div>
                <div>
                  <p style={{ fontWeight: "600", color: "#0f172a", margin: 0 }}>Location</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Lilongwe, Malawi</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  background: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#14b8a6"
                }}>📞</div>
                <div>
                  <p style={{ fontWeight: "600", color: "#0f172a", margin: 0 }}>Phone</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>+265 999 123 456</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  background: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#14b8a6"
                }}>✉️</div>
                <div>
                  <p style={{ fontWeight: "600", color: "#0f172a", margin: 0 }}>Email</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>sokorealestate1@gmail.com</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  background: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#14b8a6"
                }}>🕐</div>
                <div>
                  <p style={{ fontWeight: "600", color: "#0f172a", margin: 0 }}>Office Hours</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Mon–Fri: 8:00 AM – 5:00 PM</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Sat: 9:00 AM – 1:00 PM</p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #e2e8f0"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                Quick Links
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link to="/properties" style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
                  Browse Properties →
                </Link>
                <Link to="/upload" style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
                  Sell Your Property →
                </Link>
                <Link to="/register" style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
                  Create an Account →
                </Link>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: CONTACT FORM ===== */}
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px" }}>
              Send Us a Message
            </h2>

            {error && (
              <div style={{
                background: "#fee2e2",
                border: "1px solid #ef4444",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#b91c1c",
                fontSize: "14px",
                marginBottom: "16px"
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: "#dcfce7",
                border: "1px solid #22c55e",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#166534",
                fontSize: "14px",
                marginBottom: "16px"
              }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
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

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
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

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Property Inquiry"
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

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us about your inquiry..."
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
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;