import axiosClient from "@/lib/axiosClient";

/**
 * Get all properties with optional filters.
 * @param {Object} filters - PropertyFilters object
 */
export async function getAllProperties(filters = {}) {
  try {
    // Remove undefined/null/empty values from query params
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const res = await axiosClient.get("/properties", { params });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get featured properties.
 */
export async function getFeaturedProperties() {
  try {
    const res = await axiosClient.get("/properties/featured");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get a single property by ID (also increments views).
 * @param {string} id
 */
export async function getPropertyById(id) {
  try {
    const res = await axiosClient.get(`/properties/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get properties belonging to the logged-in agent.
 */
export async function getMyProperties() {
  try {
    const res = await axiosClient.get("/properties/user/my-properties");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get agent dashboard stats.
 */
export async function getAgentDashboardStats() {
  try {
    const res = await axiosClient.get("/properties/agent/dashboard");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Create a new property listing.
 * @param {FormData} formData
 */
export async function createProperty(formData) {
  try {
    const res = await axiosClient.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Update an existing property.
 * @param {string} id
 * @param {FormData} formData
 */
export async function updateProperty(id, formData) {
  try {
    const res = await axiosClient.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Delete a property.
 * @param {string} id
 */
export async function deleteProperty(id) {
  try {
    const res = await axiosClient.delete(`/properties/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/* ── Admin functions ─────────────────────────────────────── */

export async function getPendingProperties() {
  try {
    const res = await axiosClient.get("/properties/admin/pending");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

export async function approveProperty(id) {
  try {
    const res = await axiosClient.patch(`/properties/admin/${id}/approve`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

export async function rejectProperty(id, reason) {
  try {
    const res = await axiosClient.patch(`/properties/admin/${id}/reject`, { reason });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

export async function toggleFeatured(id) {
  try {
    const res = await axiosClient.patch(`/properties/admin/${id}/featured`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
