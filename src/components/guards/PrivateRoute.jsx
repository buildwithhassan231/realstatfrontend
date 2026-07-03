"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Wraps any authenticated-only page.
 * Redirects to /login if not authenticated.
 */
export default function PrivateRoute({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return children;
}

/**
 * Wraps any admin-only page.
 * Redirects to / if not admin.
 */
export function AdminRoute({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated)          router.replace("/login");
      else if (user?.role !== "admin") router.replace("/");
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading)                          return <LoadingScreen />;
  if (!isAuthenticated)                   return null;
  if (user?.role !== "admin")             return null;

  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#94A3B8] font-medium">Checking access...</p>
      </div>
    </div>
  );
}
