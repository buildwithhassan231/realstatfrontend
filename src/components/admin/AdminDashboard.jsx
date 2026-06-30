"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

/* ── Stat cards data ──────────────────────────────────────── */
const STATS = [
  {
    icon: "👥", label: "Total Users",     value: "340",
    change: "+18 this week", trend: "up",
    iconBg: "bg-blue-100",   trendColor: "text-[#0F6E56]",
  },
  {
    icon: "🏠", label: "Total Properties", value: "512",
    change: "+24 this month", trend: "up",
    iconBg: "bg-purple-100",  trendColor: "text-[#0F6E56]",
  },
  {
    icon: "💬", label: "Total Inquiries",  value: "1,204",
    change: "+92 this month", trend: "up",
    iconBg: "bg-amber-100",   trendColor: "text-[#0F6E56]",
  },
  {
    icon: "💰", label: "Revenue (Month)",  value: "PKR 0",
    change: "No transactions yet", trend: "neutral",
    iconBg: "bg-emerald-100", trendColor: "text-[#94A3B8]",
  },
];

/* ── Activity table data ──────────────────────────────────── */
const ACTIVITY = [
  {
    id: 1,
    user: "Ahmed Khan",     initials: "AK", grad: "from-[#185FA5] to-[#0C447C]",
    action: "Listed Property",
    property: "Modern House — DHA Phase 6",
    date: "Today, 10:24 AM",
    status: "approved",
  },
  {
    id: 2,
    user: "Sara Malik",     initials: "SM", grad: "from-[#BE185D] to-[#9D174D]",
    action: "Registered",
    property: "—",
    date: "Today, 09:15 AM",
    status: "pending",
  },
  {
    id: 3,
    user: "Bilal Raza",     initials: "BR", grad: "from-[#0F6E56] to-[#064E3B]",
    action: "Listed Property",
    property: "10 Marla Plot — Bahria",
    date: "Yesterday, 4:00 PM",
    status: "approved",
  },
  {
    id: 4,
    user: "Fatima Noor",    initials: "FN", grad: "from-[#6D28D9] to-[#4C1D95]",
    action: "Listed Property",
    property: "Commercial Shop — Lahore",
    date: "Yesterday, 1:30 PM",
    status: "rejected",
  },
  {
    id: 5,
    user: "Zara Ahmed",     initials: "ZA", grad: "from-[#0369A1] to-[#075985]",
    action: "Inquiry Sent",
    property: "Apartment — F-10 Islamabad",
    date: "28 Jun, 11:00 AM",
    status: "pending",
  },
];

const STATUS_CFG = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:  "bg-amber-50   text-amber-700   border-amber-200",
  rejected: "bg-red-50     text-red-700     border-red-200",
};

/* ── Quick actions ────────────────────────────────────────── */
const QUICK = [
  { icon: "⭐", label: "Add Featured Property", style: "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706]" },
  { icon: "🚫", label: "Block User",             style: "bg-red-500 text-white hover:bg-red-600" },
  { icon: "✅", label: "Approve Pending",         style: "bg-[#0F6E56] text-white hover:bg-[#065F46]" },
  { icon: "📥", label: "Export Report",           style: "bg-[#0F172A] text-white hover:bg-[#1E293B]" },
];

/* ── Bar chart placeholder ────────────────────────────────── */
function BarChartPlaceholder() {
  const bars = [60, 80, 45, 90, 70, 55, 85, 75, 95, 65, 88, 72];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div className="flex items-end justify-between gap-[6px] h-[120px] px-1">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-md bg-[#F59E0B]/30 group-hover:bg-[#F59E0B] transition-colors duration-150 relative"
            style={{ height: `${h}%` }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {h}
            </span>
          </div>
          <span className="text-[9px] text-[#94A3B8]">{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Line chart placeholder ───────────────────────────────── */
function LineChartPlaceholder() {
  const points = [20, 45, 30, 70, 55, 85, 65, 90, 75, 95, 80, 100];
  const w = 100 / (points.length - 1);
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${100 - p}`)
    .join(" ");
  return (
    <div className="h-[120px] w-full px-1">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Grid lines */}
        {[25, 50, 75].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y}
            stroke="#E2E8F0" strokeWidth="0.5" />
        ))}
        {/* Area fill */}
        <path
          d={`${pathD} L ${(points.length - 1) * w} 100 L 0 100 Z`}
          fill="url(#areaGrad)" opacity="0.3"
        />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#0F6E56" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={i * w} cy={100 - p} r="1.5"
            fill="#0F6E56" />
        ))}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F6E56" />
            <stop offset="100%" stopColor="#0F6E56" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────── */
export default function AdminDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activity, setActivity] = useState(ACTIVITY);

  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  function approveRow(id) {
    setActivity(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileNavOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-transform duration-300
        ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <AdminSidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569]">☰</button>
            <div>
              <h1 className="text-lg font-extrabold text-[#0F172A]">Admin Overview</h1>
              <p className="text-xs text-[#94A3B8]">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Pending badge */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-[6px]">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-700">
                {activity.filter(r => r.status === "pending").length} pending approvals
              </span>
            </div>
            {/* Bell */}
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors relative">
              🔔
              <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-extrabold text-[#0F172A] select-none">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-6">

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-xl shrink-0`}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#94A3B8] font-semibold mb-1 truncate">{s.label}</p>
                  <p className="text-2xl font-extrabold text-[#0F172A] leading-none mb-1">{s.value}</p>
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${s.trendColor}`}>
                    {s.trend === "up"   && <span>↑</span>}
                    {s.trend === "down" && <span className="text-red-500">↓</span>}
                    {s.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Bar chart */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">Properties Listed per Month</p>
                  <p className="text-xs text-[#94A3B8] mt-[2px]">Jan — Dec 2025</p>
                </div>
                <span className="text-xs font-semibold bg-[#F1F5F9] text-[#475569] px-3 py-1 rounded-lg">2025</span>
              </div>
              <BarChartPlaceholder />
              <div className="flex items-center gap-2 mt-4">
                <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                <span className="text-xs text-[#64748B]">Properties listed</span>
              </div>
            </div>

            {/* Line chart */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">User Registrations</p>
                  <p className="text-xs text-[#94A3B8] mt-[2px]">Jan — Dec 2025</p>
                </div>
                <span className="text-xs font-semibold bg-[#F1F5F9] text-[#475569] px-3 py-1 rounded-lg">2025</span>
              </div>
              <LineChartPlaceholder />
              <div className="flex items-center gap-2 mt-4">
                <span className="w-3 h-3 rounded-full bg-[#0F6E56]" />
                <span className="text-xs text-[#64748B]">New users</span>
              </div>
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <p className="text-sm font-bold text-[#0F172A] mb-4">Quick Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK.map(a => (
                <button key={a.label}
                  className={`${a.style} flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97]`}>
                  <span>{a.icon}</span>
                  <span className="hidden sm:inline">{a.label}</span>
                  <span className="sm:hidden">{a.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Recent Activity table ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Recent Activity</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Latest user and listing actions</p>
              </div>
              <button className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                View all →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    {["User", "Action", "Property", "Date", "Status", ""].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {activity.map(row => (
                    <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">

                      {/* User */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${row.grad}
                            flex items-center justify-center text-xs font-extrabold text-white shrink-0 select-none`}>
                            {row.initials}
                          </div>
                          <span className="font-semibold text-[#1E293B] whitespace-nowrap">{row.user}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3 text-[#64748B] whitespace-nowrap">{row.action}</td>

                      {/* Property */}
                      <td className="px-5 py-3 text-[#64748B] max-w-[200px]">
                        <span className="truncate block">{row.property}</span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3 text-[#94A3B8] text-xs whitespace-nowrap">{row.date}</td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize ${STATUS_CFG[row.status]}`}>
                          {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          {row.status === "pending" && (
                            <button onClick={() => approveRow(row.id)}
                              className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap">
                              ✓ Approve
                            </button>
                          )}
                          <button className="w-7 h-7 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#94A3B8] flex items-center justify-center transition-colors text-xs">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
