import axiosClient from "@/lib/axiosClient";

/* ── Public ──────────────────────────────────────────────── */

/**
 * Get all active categories (public).
 */
export async function getAllCategories() {
  try {
    const res = await axiosClient.get("/categories");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/* ── Admin ───────────────────────────────────────────────── */

/**
 * Get all categories with full details (admin).
 */
export async function getAdminCategories() {
  try {
    const res = await axiosClient.get("/admin/categories");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Create a new category.
 * @param {{ name: string, description: string }} data
 */
export async function createCategory(data) {
  try {
    const res = await axiosClient.post("/admin/categories", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Update an existing category.
 * @param {string} id
 * @param {{ name?: string, description?: string, isActive?: boolean }} data
 */
export async function updateCategory(id, data) {
  try {
    const res = await axiosClient.put(`/admin/categories/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Delete a category.
 * @param {string} id
 */
export async function deleteCategory(id) {
  try {
    const res = await axiosClient.delete(`/admin/categories/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
