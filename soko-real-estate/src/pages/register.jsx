import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        "https://soko-backend-hwvp.onrender.com/api/users/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }
      );

      setSuccess(response.data.message || "Registration successful! Please check your email to verify your account.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    alert("Google registration is coming soon! Please use email and password for now.");
  };

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
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div style={{
        maxWidth: "420px",
        margin: "40px auto",
        padding: "0 20px"
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px 36px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0"
        }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#0f172a",
            textAlign: "center",
            marginBottom: "4px"
          }}>
            Create Account
          </h1>
          <p style={{
            color: "#64748b",
            textAlign: "center",
            fontSize: "15px",
            marginBottom: "28px"
          }}>
            Join SOKO Real Estate today
          </p>

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
                Full Name *
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
                Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    paddingRight: "45px",
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontSize: "18px"
                  }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="0712345678"
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
                transition: "all 0.2s ease",
                marginBottom: "16px"
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = "#0d9488";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = "#14b8a6";
              }}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#64748b"
            }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#14b8a6", fontWeight: "500", textDecoration: "none" }}>
                Log in
              </Link>
            </div>
          </form>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "24px 0"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          <button
            onClick={handleGoogleRegister}
            style={{
              width: "100%",
              padding: "12px",
              background: "#ffffff",
              color: "#1e293b",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
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
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#94a3b8",
            textAlign: "center"
          }}>
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;