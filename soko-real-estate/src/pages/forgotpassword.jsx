import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "https://soko-backend-hwvp.onrender.com/api/users/forgot-password",
        { email }
      );
      setMessage(response.data.message || "Password reset link sent! Check your email.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
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
      {/* Mini Nav */}
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

      {/* Forgot Password Card */}
      <div style={{
        maxWidth: "420px",
        margin: "80px auto",
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
            Forgot Password
          </h1>
          <p style={{
            color: "#64748b",
            textAlign: "center",
            fontSize: "15px",
            marginBottom: "28px"
          }}>
            Enter your email and we'll send you a reset link.
          </p>

          {message && (
            <div style={{
              background: "#dcfce7",
              border: "1px solid #22c55e",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#166534",
              fontSize: "14px",
              marginBottom: "16px"
            }}>
              {message}
            </div>
          )}

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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#0f172a", fontSize: "14px", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#64748b"
            }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "#14b8a6", fontWeight: "500", textDecoration: "none" }}>
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;