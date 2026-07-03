"use client";

import { useState, useCallback } from "react";
import { getReceivedInquiries, getSentInquiries, markInquiryRead } from "@/services/inquiry.service";

/**
 * Hook for managing inquiries (agent or buyer).
 *
 * Usage (agent):
 *   const { inquiries, isLoading, error, fetchReceived, handleMarkRead } = useInquiries();
 *
 * Usage (buyer):
 *   const { inquiries, isLoading, fetchSent } = useInquiries();
 */
export function useInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const fetchReceived = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getReceivedInquiries(filters);
      setInquiries(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSentInquiries();
      setInquiries(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkRead = useCallback(async (id) => {
    try {
      await markInquiryRead(id);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: "read" } : inq))
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { inquiries, isLoading, error, fetchReceived, fetchSent, handleMarkRead };
}
