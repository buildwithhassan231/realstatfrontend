"use client";

import { useState, useCallback } from "react";
import {
  getAdminStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  promoteToAgent,
} from "@/services/admin.service";

/**
 * Hook for admin panel operations.
 *
 * Usage:
 *   const { stats, users, isLoading, error, fetchStats, fetchUsers, handleBlock, handleDelete, handlePromote } = useAdmin();
 */
export function useAdmin() {
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllUsers(filters);
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBlock = useCallback(async (id) => {
    try {
      const res = await toggleBlockUser(id);
      const updated = res.data;
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, isBlocked: updated.isBlocked } : u))
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handlePromote = useCallback(async (id) => {
    try {
      const res = await promoteToAgent(id);
      const updated = res.data;
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, role: updated.role } : u))
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    stats,
    users,
    isLoading,
    error,
    fetchStats,
    fetchUsers,
    handleBlock,
    handleDelete,
    handlePromote,
  };
}
