import axiosClient from "@/lib/axiosClient";

/**
 * Send an inquiry for a property.
 * @param {string} propertyId
 * @param {{ message: string, buyerPhone: string }} data
 */
export async function sendInquiry(propertyId, data) {
  try {
    const res = await axiosClient.post(`/inquiries/${propertyId}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get inquiries sent by the logged-in buyer.
 */
export async function getSentInquiries() {
  try {
    const res = await axiosClient.get("/inquiries/sent/me");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Get inquiries received by the logged-in agent.
 * @param {{ status?: string, page?: number, limit?: number }} filters
 */
export async function getReceivedInquiries(filters = {}) {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const res = await axiosClient.get("/inquiries/received/my-listings", { params });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

/**
 * Mark an inquiry as read.
 * @param {string} id
 */
export async function markInquiryRead(id) {
  try {
    const res = await axiosClient.patch(`/inquiries/${id}/read`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}
