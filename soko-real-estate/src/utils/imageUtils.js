// src/utils/imageUtils.js

const BACKEND_URL = "https://soko-backend-hwvp.onrender.com";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("uploads/")) {
    return `${BACKEND_URL}/${imagePath}`;
  }
  return `${BACKEND_URL}/uploads/${imagePath}`;
};