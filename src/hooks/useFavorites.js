"use client";

import { useState, useCallback } from "react";
import { getMyFavorites, toggleFavorite } from "@/services/favorite.service";

/**
 * Hook for managing user's favorite properties.
 *
 * Usage:
 *   const { favorites, isLoading, fetchFavorites, handleToggle, checkFavorite } = useFavorites();
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMyFavorites();
      setFavorites(res.data || []);
    } catch {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Toggle favorite with optimistic update.
   * Reverts on API failure.
   */
  const handleToggle = useCallback(async (propertyId) => {
    // Optimistic update
    const previousFavorites = favorites;
    const isFav = favorites.some((f) => (f._id || f.id) === propertyId);

    setFavorites((prev) =>
      isFav
        ? prev.filter((f) => (f._id || f.id) !== propertyId)
        : [...prev, { _id: propertyId, id: propertyId }]
    );

    try {
      await toggleFavorite(propertyId);
    } catch {
      // Revert on failure
      setFavorites(previousFavorites);
    }
  }, [favorites]);

  /**
   * Check if a property is in the favorites list (client-side).
   */
  const checkFavorite = useCallback((propertyId) => {
    return favorites.some((f) => (f._id || f.id) === propertyId || f.property?._id === propertyId || f.property?.id === propertyId);
  }, [favorites]);

  return { favorites, isLoading, fetchFavorites, handleToggle, checkFavorite };
}
