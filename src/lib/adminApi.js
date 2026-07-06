/**
 * Admin API functions
 * All admin API calls go through axiosClient (token auto-attached).
 * Import from here in admin page files — never call axiosClient directly in components.
 */

import axiosClient from "@/lib/axiosClient";

/* ── Stats ───────────────────────────────────────────────── */

/**
 * GET /admin/stats
 * Returns platform stats: users, properties, inquiries
 */
export async function fetchAdminStats() {
  const res = await axiosClient.get("/admin/stats");
  return res.data?.data ?? res.data;
}

/* ── Users ───────────────────────────────────────────────── */

/**
 * GET /admin/users
 * @param {{ role?: string, isBlocked?: boolean, page?: number, limit?: number, search?: string }} params
 */
export async function fetchAdminUsers(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const res = await axiosClient.get("/admin/users", { params: query });
  return res.data;
}

/**
 * GET /admin/users/:id
 */
export async function fetchAdminUserById(id) {
  const res = await axiosClient.get(`/admin/users/${id}`);
  return res.data?.data ?? res.data;
}

/**
 * PATCH /admin/users/:id/block  — toggle block/unblock
 */
export async function toggleBlockUser(id) {
  const res = await axiosClient.patch(`/admin/users/${id}/block`);
  return res.data?.data ?? res.data;
}

/**
 * PATCH /admin/users/:id/promote  — promote buyer to agent
 */
export async function promoteToAgent(id) {
  const res = await axiosClient.patch(`/admin/users/${id}/promote`);
  return res.data?.data ?? res.data;
}

/**
 * DELETE /admin/users/:id
 */
export async function deleteAdminUser(id) {
  const res = await axiosClient.delete(`/admin/users/${id}`);
  return res.data;
}

/* ── Properties ──────────────────────────────────────────── */

/**
 * GET /properties/admin/pending
 */
export async function fetchPendingProperties() {
  const res = await axiosClient.get("/properties/admin/pending");
  return res.data;
}

/**
 * PATCH /properties/admin/:id/approve
 */
export async function approveProperty(id) {
  const res = await axiosClient.patch(`/properties/admin/${id}/approve`);
  return res.data?.data ?? res.data;
}

/**
 * PATCH /properties/admin/:id/reject
 * @param {string} id
 * @param {string} reason
 */
export async function rejectProperty(id, reason = "") {
  const res = await axiosClient.patch(`/properties/admin/${id}/reject`, { reason });
  return res.data?.data ?? res.data;
}

/**
 * PATCH /properties/admin/:id/featured  — toggle featured
 */
export async function toggleFeaturedProperty(id) {
  const res = await axiosClient.patch(`/properties/admin/${id}/featured`);
  return res.data?.data ?? res.data;
}

/**
 * DELETE /properties/:id
 */
export async function deleteProperty(id) {
  const res = await axiosClient.delete(`/properties/${id}`);
  return res.data;
}

/* ── Inquiries ───────────────────────────────────────────── */

/**
 * GET /inquiries/received/my-listings  (admin sees all)
 * @param {{ status?: string, page?: number, limit?: number }} params
 */
export async function fetchAdminInquiries(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const res = await axiosClient.get("/inquiries/received/my-listings", { params: query });
  return res.data;
}

/* ── Categories ──────────────────────────────────────────── */

/**
 * GET /admin/categories
 */
export async function fetchAdminCategories() {
  const res = await axiosClient.get("/admin/categories");
  return res.data;
}

/**
 * POST /admin/categories
 * @param {{ name: string, description?: string }} data
 */
export async function createCategory(data) {
  const res = await axiosClient.post("/admin/categories", data);
  return res.data?.data ?? res.data;
}

/**
 * PUT /admin/categories/:id
 * @param {string} id
 * @param {{ name?: string, description?: string, isActive?: boolean }} data
 */
export async function updateCategory(id, data) {
  const res = await axiosClient.put(`/admin/categories/${id}`, data);
  return res.data?.data ?? res.data;
}

/**
 * DELETE /admin/categories/:id
 */
export async function deleteCategory(id) {
  const res = await axiosClient.delete(`/admin/categories/${id}`);
  return res.data;
}
