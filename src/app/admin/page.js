"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { fetchAdminStats, fetchAdminUsers } from "@/lib/adminApi";


export default function AdminRoute() {
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [statsData, usersData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers({ limit: 5 })
      ]);
      setStats(statsData);
      setUsers(usersData.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AdminDashboard
      stats={stats}
      users={users}
      isLoading={isLoading}
      statsError={error}
      onRefresh={loadData}
    />
  );
}

