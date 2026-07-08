"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import axiosClient from "@/lib/axiosClient";
import { getAgentDashboardStats } from "@/services/property.service";

export default function DashboardRoute() {
  const router = useRouter();
  const [listings,  setListings]  = useState([]);
  const [stats,     setStats]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosClient.get("/properties/user/my-properties");
        const data = res.data?.data || res.data || [];
        setListings(Array.isArray(data) ? data : []);
        
        // Fetch stats using the service
        const statsRes = await getAgentDashboardStats();
        setStats(statsRes?.data || statsRes || null);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("propfind_user");
          router.push("/login");
          return;
        }
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  return (
    <AgentDashboard
      listings={listings}
      stats={stats}
      isLoading={isLoading}
      error={error}
    />
  );
}
