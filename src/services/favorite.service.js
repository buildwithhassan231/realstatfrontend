import axiosClient from "@/lib/axiosClient";

/**
 * Toggle favorite on a property (add if not favorited, remove if already favorited).
 * @param {string} propertyId
 */
export async function toggleFavorite(propertyId) {
  try {
    const res = await axiosClient.post(`/favorites/${propertyId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get all favorited properties for the logged-in user.
 */
export async function getMyFavorites() {
  try {
    const res = await axiosClient.get("/favorites");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Check if a specific property is favorited by the current user.
 * @param {string} propertyId
 * @returns {{ isFavorite: boolean }}
 */
export async function checkIsFavorite(propertyId) {
  try {
    const res = await axiosClient.get(`/favorites/${propertyId}/check`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
