"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosClient from "@/lib/axiosClient";
import { useAuth } from "@/context/AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]); // array of property _id strings
  const [count,       setCount]       = useState(0);

  /* Fetch favorite IDs on login */
  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      setCount(0);
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = useCallback(async () => {
    try {
      const res  = await axiosClient.get("/favorites");
      const data = res.data?.data || res.data || [];
      // Each item may be a property object or { property: {...} }
      const ids  = Array.isArray(data)
        ? data.map(item => (item.property?._id || item.property?.id || item._id || item.id)?.toString()).filter(Boolean)
        : [];
      setFavoriteIds(ids);
      setCount(ids.length);
    } catch {
      // Non-critical — silently ignore
    }
  }, []);

  const isFavorited = useCallback((propertyId) => {
    return favoriteIds.includes(String(propertyId));
  }, [favoriteIds]);

  /* Toggle — optimistic update */
  const toggleFavorite = useCallback(async (propertyId) => {
    const id  = String(propertyId);
    const was = favoriteIds.includes(id);

    // Optimistic update
    setFavoriteIds(prev => was ? prev.filter(x => x !== id) : [...prev, id]);
    setCount(prev => was ? prev - 1 : prev + 1);

    try {
      await axiosClient.post(`/favorites/${propertyId}`);
    } catch {
      // Revert on failure
      setFavoriteIds(prev => was ? [...prev, id] : prev.filter(x => x !== id));
      setCount(prev => was ? prev + 1 : prev - 1);
    }
  }, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ count, favoriteIds, isFavorited, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
