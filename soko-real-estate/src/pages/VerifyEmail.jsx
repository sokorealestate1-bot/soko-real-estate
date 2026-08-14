import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/verify-email/${token}`
        );
        setMessage(response.data.message || "Email verified successfully!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed. Please try again.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError("No verification token provided.");
      setLoading(false);
    }
  }, [token, navigate]);

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

      {/* ===== VERIFICATION CARD ===== */}
      <div style={{
        maxWidth: "480px",
        margin: "80px auto",
        padding: "0 20px"
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "48px 36px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
          textAlign: "center"
        }}>
          {loading ? (
            <>
              <div style={{
                width: "60px",
                height: "60px",
                border: "4px solid #e2e8f0",
                borderTopColor: "#14b8a6",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 20px"
              }} />
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
                Verifying your email...
              </h2>
              <p style={{ color: "#64748b", marginTop: "8px" }}>
                Please wait while we confirm your account.
              </p>
            </>
          ) : message ? (
            <>
              <div style={{
                fontSize: "56px",
                marginBottom: "16px"
              }}>✅</div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
                Email Verified!
              </h2>
              <p style={{ color: "#475569", marginTop: "8px", fontSize: "16px" }}>
                {message}
              </p>
              <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "14px" }}>
                Redirecting to login...
              </p>
              <Link to="/login" style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "10px 32px",
                background: "#14b8a6",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#0d9488"}
              onMouseLeave={(e) => e.target.style.background = "#14b8a6"}
              >
                Go to Login
              </Link>
            </>
          ) : error ? (
            <>
              <div style={{
                fontSize: "56px",
                marginBottom: "16px"
              }}>❌</div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#dc2626" }}>
                Verification Failed
              </h2>
              <p style={{ color: "#475569", marginTop: "8px", fontSize: "16px" }}>
                {error}
              </p>
              <Link to="/resend-verification" style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "10px 32px",
                background: "#0f172a",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#1e293b"}
              onMouseLeave={(e) => e.target.style.background = "#0f172a"}
              >
                Request New Link
              </Link>
            </>
          ) : null}
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

export default VerifyEmail;