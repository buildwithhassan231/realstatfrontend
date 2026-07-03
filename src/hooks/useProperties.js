"use client";

import { useState, useCallback } from "react";
import { getAllProperties } from "@/services/property.service";

/**
 * Hook for fetching and managing property listings.
 *
 * Usage:
 *   const { properties, isLoading, error, pagination, fetchProperties } = useProperties();
 *   useEffect(() => { fetchProperties({ city: "Karachi", page: 1 }); }, []);
 */
export function useProperties() {
  const [properties,  setProperties]  = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState(null);
  const [pagination,  setPagination]  = useState(null);

  const fetchProperties = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllProperties(filters);
      setProperties(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err.message);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { properties, isLoading, error, pagination, fetchProperties };
}
