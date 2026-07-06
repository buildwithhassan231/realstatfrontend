"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { toggleBlockUser, deleteAdminUser } from "@/lib/adminApi";

/* ── Stat cards data ──
   Stats are now dynamically loaded from the API response:
   - Users: total, agents, buyers, blocked
   - Properties: total, pending, approved, rejected, featured
   - Inquiries: total
*/


/* ── Status config ── */
const STATUS_CFG = {
  active:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-[#F1F5F9]  text-[#64748B]   border-[#E2E8F0]",
};

function getInitials(name = "") {
  if (!name) return "U";
  const parts = name.split(" ");
  return parts.map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function getUserGrad(id = "") {
  const grads = [
    "from-[#185FA5] to-[#0C447C]",
    "from-[#BE185D] to-[#9D174D]",
    "from-[#0F6E56] to-[#064E3B]",
    "from-[#6D28D9] to-[#4C1D95]",
    "from-[#0369A1] to-[#075985]",
    "from-[#854F0B] to-[#92400E]",
    "from-[#065F46] to-[#047857]",
    "from-[#4F46E5] to-[#7C3AED]",
  ];
  if (!id) return grads[0];
  const index = id.charCodeAt(id.length - 1) % grads.length;
  return grads[isNaN(index) ? 0 : index];
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ── Quick actions ────────────────────────────────────────── */
const QUICK = [
  { icon: "⭐", label: "Add Featured Property", style: "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706]" },
  { icon: "🚫", label: "Block User",             style: "bg-red-500 text-white hover:bg-red-600" },
  { icon: "✅", label: "Approve Pending",         style: "bg-[#0F6E56] text-white hover:bg-[#065F46]" },
  { icon: "📥", label: "Export Report",           style: "bg-[#0F172A] text-white hover:bg-[#1E293B]" },
];

/* ── Bar chart placeholder ────────────────────────────────── */
function BarChartPlaceholder({ total = 0 }) {
  const base = [1, 2, 1, 3, 2, 4, 3, 2, 5, Math.max(1, Math.round(total * 0.4)), Math.max(1, Math.round(total * 0.7)), total];
  const max = Math.max(...base, 1);
  const bars = base.map(v => Math.round((v / max) * 85) + 15);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div className="flex items-end justify-between gap-[6px] h-[120px] px-1">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-md bg-[#F59E0B]/30 group-hover:bg-[#F59E0B] transition-colors duration-150 relative cursor-pointer"
            style={{ height: `${h}%` }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {base[i]}
            </span>
          </div>
          <span className="text-[9px] text-[#94A3B8]">{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Line chart placeholder ───────────────────────────────── */
function LineChartPlaceholder({ total = 0 }) {
  const base = [2, 5, 8, 12, 15, 18, 22, 25, 28, Math.max(1, Math.round(total * 0.5)), Math.max(1, Math.round(total * 0.8)), total];
  const max = Math.max(...base, 1);
  const points = base.map(v => Math.round((v / max) * 75) + 20);
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
          <g key={i} className="group cursor-pointer">
            <circle cx={i * w} cy={100 - p} r="2"
              fill="#0F6E56" className="hover:r-3 transition-all" />
            <title>{`Month ${i+1}: ${base[i]} users`}</title>
          </g>
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
export default function AdminDashboard({stats, users = [], isLoading, statsError, onRefresh}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  async function handleToggleBlock(id) {
    try {
      await toggleBlockUser(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteAdminUser(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  }

  function handleExportReport() {
    if (!stats) {
      alert("No data available to export yet.");
      return;
    }
    const rows = [
      ["PropFind System Administration Summary Report"],
      ["Date Generated", new Date().toLocaleString()],
      [],
      ["METRICS / STATISTICS"],
      ["Metric Group", "Category", "Value"],
      ["Users", "Total Users", stats?.users?.total ?? 0],
      ["Users", "Agents", stats?.users?.agents ?? 0],
      ["Users", "Buyers", stats?.users?.buyers ?? 0],
      ["Users", "Blocked", stats?.users?.blocked ?? 0],
      ["Properties", "Total Properties", stats?.properties?.total ?? 0],
      ["Properties", "Pending", stats?.properties?.pending ?? 0],
      ["Properties", "Approved", stats?.properties?.approved ?? 0],
      ["Properties", "Rejected", stats?.properties?.rejected ?? 0],
      ["Properties", "Featured", stats?.properties?.featured ?? 0],
      ["Inquiries", "Total Inquiries", stats?.inquiries?.total ?? 0],
      [],
      ["RECENT USERS LIST"],
      ["ID", "Name", "Email", "Phone", "Role", "Blocked Status"]
    ];

    users.forEach(u => {
      rows.push([
        u._id,
        u.name,
        u.email,
        u.phoneNumber || "—",
        u.role,
        u.isBlocked ? "Blocked" : "Active"
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `propfind_admin_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleQuickAction = (label) => {
    if (label === "Add Featured Property" || label === "Approve Pending") {
      window.location.href = "/admin/properties";
    } else if (label === "Block User") {
      window.location.href = "/admin/users";
    } else if (label === "Export Report") {
      handleExportReport();
    }
  };

  const displayStats = [
    {
      icon: "👥",
      label: "Total Users",
      value: stats?.users?.total ?? 0,
      change: `${stats?.users?.agents ?? 0} agents · ${stats?.users?.buyers ?? 0} buyers`,
      iconBg: "bg-blue-100",
      trendColor: "text-[#64748B]",
    },
    {
      icon: "🏠",
      label: "Total Properties",
      value: stats?.properties?.total ?? 0,
      change: `${stats?.properties?.approved ?? 0} approved · ${stats?.properties?.pending ?? 0} pending`,
      iconBg: "bg-purple-100",
      trendColor: "text-[#64748B]",
    },
    {
      icon: "💬",
      label: "Total Inquiries",
      value: stats?.inquiries?.total ?? 0,
      change: "Inquiries submitted",
      iconBg: "bg-amber-100",
      trendColor: "text-[#64748B]",
    },
    {
      icon: "⭐",
      label: "Featured Listings",
      value: stats?.properties?.featured ?? 0,
      change: "Highlighted on site",
      iconBg: "bg-emerald-100",
      trendColor: "text-[#64748B]",
    },
  ];


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
            {/* Pending approvals badge */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-[6px]">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-700">
                {isLoading ? "..." : (stats?.properties?.pending ?? 0)} pending approvals
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

          {/* Error Message */}
          {statsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{statsError}</span>
            </div>
          )}

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-start gap-4 animate-pulse">
                  <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-2/3 mb-2" />
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              displayStats.map(s => (
                <div key={s.label}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#94A3B8] font-semibold mb-1 truncate">{s.label}</p>
                    <p className="text-2xl font-extrabold text-[#0F172A] leading-none mb-1">{s.value}</p>
                    <p className={`text-[11px] font-semibold flex items-center gap-1 ${s.trendColor}`}>
                      {s.change}
                    </p>
                  </div>
                </div>
              ))
            )}
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
              <BarChartPlaceholder total={stats?.properties?.total ?? 0} />
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
              <LineChartPlaceholder total={stats?.users?.total ?? 0} />
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
                  onClick={() => handleQuickAction(a.label)}
                  className={`${a.style} flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97]`}>
                  <span>{a.icon}</span>
                  <span className="hidden sm:inline">{a.label}</span>
                  <span className="sm:hidden">{a.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Recent Users table ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Recent Users</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Latest registered platform users</p>
              </div>
              <a href="/admin/users" className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                View all →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    {["User", "Email", "Phone", "Role", "Status", "Actions"].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                            <div className="h-4 bg-slate-200 rounded w-20" />
                          </div>
                        </td>
                        <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                        <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                        <td className="px-5 py-4"><div className="h-5 bg-slate-200 rounded-full w-12" /></td>
                        <td className="px-5 py-4"><div className="h-5 bg-slate-200 rounded-full w-12" /></td>
                        <td className="px-5 py-4"><div className="h-8 bg-slate-200 rounded-lg w-16" /></td>
                      </tr>
                    ))
                  ) : (
                    users.map(u => {
                      const status = u.isBlocked ? "blocked" : "active";
                      return (
                        <tr key={u._id} className="hover:bg-[#F8FAFC] transition-colors">

                          {/* User */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {u.profileImage?.url ? (
                                <img src={u.profileImage.url} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              ) : (
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getUserGrad(u._id)}
                                  flex items-center justify-center text-xs font-extrabold text-white shrink-0 select-none`}>
                                  {getInitials(u.name)}
                                </div>
                              )}
                              <span className="font-semibold text-[#1E293B] whitespace-nowrap">{u.name}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-3 text-[#64748B] whitespace-nowrap text-xs">{u.email}</td>

                          {/* Phone */}
                          <td className="px-5 py-3 text-[#64748B] whitespace-nowrap text-xs">{u.phoneNumber || "—"}</td>

                          {/* Role */}
                          <td className="px-5 py-3 text-xs whitespace-nowrap font-semibold text-[#475569]">
                            <span className="capitalize">{u.role}</span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3">
                            <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize ${STATUS_CFG[status]}`}>
                              {status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              {/* Block Toggle */}
                              <button
                                title={status === "active" ? "Block User" : "Unblock User"}
                                onClick={() => handleToggleBlock(u._id)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs
                                  ${status === "active"
                                    ? "bg-[#F1F5F9] hover:bg-amber-50 hover:text-amber-600 text-[#94A3B8]"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                                {status === "active" ? "🚫" : "✅"}
                              </button>

                              {/* Delete button */}
                              {u.role !== "admin" && (
                                <button
                                  title="Delete User"
                                  onClick={() => handleDelete(u._id)}
                                  className="w-7 h-7 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#94A3B8] flex items-center justify-center transition-colors text-xs">
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  {!isLoading && users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        No recent users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
