import axiosClient from "@/lib/axiosClient";

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, phoneNumber: string }} data
 */
export async function registerUser(data) {
  try {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Login existing user.
 * @param {{ email: string, password: string }} data
 */
export async function loginUser(data) {
  try {
    const res = await axiosClient.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get current logged-in user (requires token in localStorage).
 */
export async function getMe() {
  try {
    const res = await axiosClient.get("/auth/me");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Logout current user.
 */
export async function logoutUser() {
  try {
    const res = await axiosClient.post("/auth/logout");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
