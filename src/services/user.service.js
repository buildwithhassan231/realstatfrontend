import axiosClient from "@/lib/axiosClient";

/**
 * Get public agent profile.
 * @param {string} agentId
 */
export async function getAgentProfile(agentId) {
  try {
    const res = await axiosClient.get(`/users/agent/${agentId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get properties listed by a specific agent (public).
 * @param {string} agentId
 * @param {{ page?: number, limit?: number, listingType?: string, propertyType?: string, status?: string }} filters
 */
export async function getAgentProperties(agentId, filters = {}) {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const res = await axiosClient.get(`/users/agent/${agentId}/properties`, { params });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Update the logged-in user's profile.
 * @param {FormData} formData - Fields: name, phoneNumber, bio, agencyName, profileImage (file)
 */
export async function updateProfile(formData) {
  try {
    const res = await axiosClient.put("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
