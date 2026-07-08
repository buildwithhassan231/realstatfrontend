import axiosClient from "@/lib/axiosClient";

/**
 * Fetch current admin/platform settings
 */
export async function getSettings() {
  try {
    const res = await axiosClient.get("/admin/settings");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong while fetching settings");
  }
}

/**
 * Update General Settings
 * @param {{ siteName: string, siteUrl: string, siteTagline: string, contactEmail: string, supportPhone: string }} data
 */
export async function updateGeneralSettings(data) {
  try {
    const res = await axiosClient.put("/admin/settings/general", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update general settings");
  }
}

/**
 * Update Platform Controls
 * @param {{ maintenance: boolean, registrations: boolean, emailNotifications: boolean, autoApprove: boolean }} data
 */
export async function updatePlatformSettings(data) {
  try {
    const res = await axiosClient.put("/admin/settings/platform", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update platform settings");
  }
}

/**
 * Update Listing Limits
 * @param {{ featuredLimit: number, listingsPerPage: number, maxImages: number }} data
 */
export async function updateListingSettings(data) {
  try {
    const res = await axiosClient.put("/admin/settings/listings", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update listing limits");
  }
}

/**
 * Update Admin Profile
 * @param {{ adminName: string, adminEmail: string, adminPhone: string, adminBio: string }} data
 */
export async function updateAdminProfile(data) {
  try {
    const res = await axiosClient.put("/admin/profile", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update admin profile");
  }
}

/**
 * Change Admin Password
 * @param {{ curPwd: string, newPwd: string, conPwd: string }} data
 */
export async function changeAdminPassword(data) {
  try {
    const res = await axiosClient.put("/admin/change-password", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change password");
  }
}
