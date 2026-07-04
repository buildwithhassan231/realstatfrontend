"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import axiosClient from "@/lib/axiosClient";

export default function DashboardRoute() {
  const router = useRouter();
  const [listings,  setListings]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await axiosClient.get("/properties/user/my-properties");
        const data = res.data?.data || res.data || [];
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("propfind_user");
          router.push("/login");
          return;
        }
        setError(err.response?.data?.message || "Failed to load listings.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, [router]);

  return (
    <AgentDashboard
      listings={listings}
      isLoading={isLoading}
      error={error}
    />
  );
}
