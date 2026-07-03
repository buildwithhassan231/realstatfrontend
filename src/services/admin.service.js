import axiosClient from "@/lib/axiosClient";

/**
 * Get platform-wide admin stats.
 */
export async function getAdminStats() {
  try {
    const res = await axiosClient.get("/admin/stats");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get all users with optional filters.
 * @param {{ role?: string, isBlocked?: boolean, page?: number, limit?: number }} filters
 */
export async function getAllUsers(filters = {}) {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const res = await axiosClient.get("/admin/users", { params });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get a single user's details.
 * @param {string} id
 */
export async function getUserById(id) {
  try {
    const res = await axiosClient.get(`/admin/users/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Toggle block/unblock a user.
 * @param {string} id
 */
export async function toggleBlockUser(id) {
  try {
    const res = await axiosClient.patch(`/admin/users/${id}/block`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Promote a buyer to agent role.
 * @param {string} id
 */
export async function promoteToAgent(id) {
  try {
    const res = await axiosClient.patch(`/admin/users/${id}/promote`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Delete a user permanently.
 * @param {string} id
 */
export async function deleteUser(id) {
  try {
    const res = await axiosClient.delete(`/admin/users/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
