import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all approved properties
export const getProperties = async () => {
  try {
    const response = await axios.get(`${API_URL}/properties`);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Get property by ID
export const getPropertyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

// Get pending properties (admin only)
export const getPendingProperties = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/properties/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending properties:", error);
    throw error;
  }
};

// Get user's properties
export const getMyProperties = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/properties/my/properties`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my properties:", error);
    throw error;
  }
};

// Upload property
export const uploadProperty = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading property:", error);
    throw error;
  }
};

// Approve property (admin only)
export const approveProperty = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving property:", error);
    throw error;
  }
};

// Reject property (admin only)
export const rejectProperty = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting property:", error);
    throw error;
  }
};

// Feature/unfeature property (admin only)
export const featureProperty = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/feature/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling feature:", error);
    throw error;
  }
};

// Delete property (admin only)
export const deleteProperty = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

// ⭐ ADD THIS DEFAULT EXPORT
const propertyApi = {
  getProperties,
  getPropertyById,
  getPendingProperties,
  getMyProperties,
  uploadProperty,
  approveProperty,
  rejectProperty,
  featureProperty,
  deleteProperty,
};

export default propertyApi;