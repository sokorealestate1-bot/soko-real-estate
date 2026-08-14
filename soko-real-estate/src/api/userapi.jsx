import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/verify-email/${token}`);
    return response.data;
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};

// Resend verification email
export const resendVerification = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resend-verification`, { email });
    return response.data;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!getToken();
};