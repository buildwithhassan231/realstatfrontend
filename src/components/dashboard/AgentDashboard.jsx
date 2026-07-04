"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ListingsTable from "@/components/dashboard/ListingsTable";
import RecentInquiries from "@/components/dashboard/RecentInquiries";

const QUICK_ACTIONS = [
  { icon: "➕", label: "Add Property",   href: "/dashboard/add",       color: "bg-[#F59E0B] text-[#0F172A]" },
  { icon: "💬", label: "View Inquiries", href: "/dashboard/inquiries", color: "bg-[#0F172A] text-white" },
  { icon: "📋", label: "My Listings",    href: "/dashboard/listings",  color: "bg-white text-[#0F172A] border border-[#E2E8F0]" },
  { icon: "⚙️", label: "Settings",       href: "/dashboard/profile",   color: "bg-white text-[#0F172A] border border-[#E2E8F0]" },
];

export default function AgentDashboard({ listings = [], isLoading = false, error = "" }) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "Agent";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A]">
          {greeting}, {firstName}!
        </h2>
        <p className="text-sm text-[#94A3B8] mt-[2px]">
          Here&apos;s what&apos;s happening with your listings today.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(a => (
          <Link key={a.label} href={a.href}
            className={`${a.color} flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity no-underline`}>
            <span>{a.icon}</span> {a.label}
          </Link>
        ))}
      </div>

      <ListingsTable listings={listings} isLoading={isLoading} error={error} />
      <RecentInquiries />
    </div>
  );
}
