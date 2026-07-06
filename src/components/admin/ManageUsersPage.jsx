"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Pagination from "@/components/listing/Pagination";
import {
  fetchAdminUsers,
  fetchAdminUserById,
  toggleBlockUser,
  promoteToAgent as apiPromoteToAgent,
  deleteAdminUser,
} from "@/lib/adminApi";

const INITIAL_USERS = [];

const ITEMS_PER_PAGE = 6;

/* ── Badge configs ────────────────────────────────────────── */
const ROLE_CFG = {
  buyer: "bg-blue-50   text-blue-700   border-blue-200",
  agent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  admin: "bg-red-50    text-red-700    border-red-200",
};

const STATUS_CFG = {
  active:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-[#F1F5F9]  text-[#64748B]   border-[#E2E8F0]",
};

/* ── Confirm modal ─────────────────────────────────────────── */
function ConfirmModal({ title, message, confirmLabel, confirmStyle, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="text-center mb-5">
          <span className="text-4xl">⚠️</span>
          <h3 className="font-extrabold text-[#0F172A] mt-3 mb-1">{title}</h3>
          <p className="text-sm text-[#64748B]">{message}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel}
            className="py-[10px] rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`py-[10px] rounded-xl text-sm font-bold text-white transition-colors ${confirmStyle}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── User Detail Modal ─────────────────────────────────────── */
function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchAdminUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden border border-[#E2E8F0]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-6 py-4 flex items-center justify-between text-white">
          <span className="font-extrabold text-sm tracking-wider uppercase">User Details</span>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white transition-colors text-lg">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#64748B] font-semibold">Loading details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500 font-medium text-sm">
              ⚠️ {error}
            </div>
          ) : user ? (
            <div className="flex flex-col gap-5">
              
              {/* Profile Card */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                {user.profileImage?.url ? (
                  <img src={user.profileImage.url} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getUserGrad(user._id)} flex items-center justify-center text-xl font-extrabold text-white`}>
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2 truncate">
                    {user.name}
                    {user.verified && <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-[2px] rounded shrink-0">VERIFIED</span>}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-[2px] truncate">{user.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-[2px] rounded-full border uppercase bg-blue-50 text-blue-700 border-blue-200">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</span>
                  <p className="text-sm text-[#475569] mt-1 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">City</p>
                  <p className="text-sm font-bold text-[#1E293B] mt-1 capitalize">{user.city || "—"}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Experience</p>
                  <p className="text-sm font-bold text-[#1E293B] mt-1">{user.experience ? `${user.experience} Years` : "—"}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Deals Completed</p>
                  <p className="text-sm font-bold text-[#1E293B] mt-1">{user.deals ?? 0}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Rating</p>
                  <p className="text-sm font-bold text-amber-500 mt-1 flex items-center justify-center gap-1">
                    ⭐ {user.rating?.average ?? 0} <span className="text-xs text-slate-400">({user.rating?.count ?? 0})</span>
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-[#F1F5F9] pt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Phone:</span>
                  <span className="text-[#1E293B] font-bold">{user.phoneNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">WhatsApp:</span>
                  <span className="text-[#1E293B] font-bold">{user.whatsapp || "—"}</span>
                </div>
                {user.agencyName && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Agency:</span>
                    <span className="text-[#1E293B] font-bold">{user.agencyName}</span>
                  </div>
                )}
                {user.specializations?.length > 0 && (
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 font-semibold">Specializations:</span>
                    <span className="text-[#1E293B] font-bold text-right max-w-[180px]">
                      {user.specializations.join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Member Since:</span>
                  <span className="text-[#1E293B] font-bold">{formatDate(user.createdAt)}</span>
                </div>
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-[#E2E8F0] px-6 py-4 flex justify-end">
          <button onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

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


export default function ManageUsersPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [users,         setUsers]         = useState([]);
  const [totalUsers,    setTotalUsers]    = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState("");
  const [search,        setSearch]        = useState("");
  const [roleFilter,    setRoleFilter]    = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [selected,      setSelected]      = useState([]);   // selected row ids
  const [currentPage,   setCurrentPage]   = useState(1);
  const [modal,         setModal]         = useState(null); // { type, payload }

  /* ── Actions ── */
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
      };
      if (roleFilter !== "all") {
        params.role = roleFilter;
      }
      if (statusFilter === "blocked") {
        params.isBlocked = true;
      } else if (statusFilter === "active") {
        params.isBlocked = false;
      }

      const response = await fetchAdminUsers(params);
      setUsers(response.data || []);
      setTotalUsers(response.total ?? 0);
      setTotalPages(response.pages ?? 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, roleFilter, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* Reset page on filter change */
  function applySearch(v)  { setSearch(v);      setCurrentPage(1); setSelected([]); }
  function applyRole(v)    { setRoleFilter(v);   setCurrentPage(1); setSelected([]); }
  function applyStatus(v)  { setStatusFilter(v); setCurrentPage(1); setSelected([]); }

  /* ── Row select ── */
  const pageIds       = users.map(u => u._id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selected.includes(id));

  function toggleSelectAll() {
    setSelected(allPageSelected ? selected.filter(id => !pageIds.includes(id)) : [...new Set([...selected, ...pageIds])]);
  }
  function toggleRow(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  /* ── User actions ── */
  async function handleToggleBlock(id) {
    try {
      await toggleBlockUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAdminUser(id);
      loadUsers();
      setSelected(prev => prev.filter(i => i !== id));
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  }

  async function handlePromote(id) {
    try {
      await apiPromoteToAgent(id);
      loadUsers();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to promote user.");
    }
  }

  async function handleBulkBlock() {
    try {
      await Promise.all(selected.map(id => toggleBlockUser(id)));
      loadUsers();
      setSelected([]);
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to block selected users.");
    }
  }

  async function handleBulkDelete() {
    try {
      await Promise.all(selected.map(id => deleteAdminUser(id)));
      loadUsers();
      setSelected([]);
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete selected users.");
    }
  }

  const selectDropCls = "border border-[#E2E8F0] rounded-xl px-3 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all bg-white cursor-pointer appearance-none";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
      <div className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-transform duration-300
        ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569]">☰</button>
            <div>
              <h1 className="text-lg font-extrabold text-[#0F172A]">Manage Users</h1>
              <p className="text-xs text-[#94A3B8]">Total: {isLoading ? "..." : totalUsers} users</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#D97706] transition-colors">
              ➕ Add User
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-extrabold text-[#0F172A] select-none">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Search + Filters bar ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
              <input type="text" value={search} onChange={e => applySearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full border border-[#E2E8F0] rounded-xl pl-9 pr-9 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white" />
              {search && (
                <button onClick={() => applySearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] text-sm">✕</button>
              )}
            </div>

            {/* Role filter */}
            <div className="relative">
              <select value={roleFilter} onChange={e => applyRole(e.target.value)} className={selectDropCls}>
                <option value="all">All Roles</option>
                <option value="buyer">Buyer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>

            {/* Status filter */}
            <div className="relative">
              <select value={statusFilter} onChange={e => applyStatus(e.target.value)} className={selectDropCls}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>

            {/* Result count */}
            <span className="text-sm text-[#94A3B8] ml-auto shrink-0 hidden sm:block">
              {isLoading ? "..." : totalUsers} result{totalUsers !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Bulk action bar (slides in when rows selected) ── */}
          {selected.length > 0 && (
            <div className="flex items-center justify-between gap-4 bg-[#0F172A] rounded-xl px-5 py-3">
              <span className="text-white text-sm font-semibold">
                {selected.length} user{selected.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setModal({ type: "bulkBlock" })}
                  className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors">
                  🚫 Block Selected
                </button>
                <button onClick={() => setModal({ type: "bulkDelete" })}
                  className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  🗑️ Delete Selected
                </button>
                <button onClick={() => setSelected([])}
                  className="text-[#94A3B8] hover:text-white text-sm transition-colors ml-1">✕</button>
              </div>
            </div>
          )}

          {/* ── Table ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    {/* Select all */}
                    <th className="px-5 py-3 w-10">
                      <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll}
                        className="w-4 h-4 rounded accent-[#F59E0B] cursor-pointer" />
                    </th>
                    {["User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {isLoading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-5 py-4"><div className="w-4 h-4 bg-slate-200 rounded" /></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                            <div className="h-4 bg-slate-200 rounded w-24" />
                          </div>
                        </td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                        <td className="px-4 py-4"><div className="h-5 bg-slate-200 rounded-full w-12" /></td>
                        <td className="px-4 py-4"><div className="h-5 bg-slate-200 rounded-full w-12" /></td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                        <td className="px-4 py-4"><div className="h-8 bg-slate-200 rounded-lg w-24" /></td>
                      </tr>
                    ))
                  ) : (
                    users.map(u => {
                      const isSelected = selected.includes(u._id);
                      const status = u.isBlocked ? "blocked" : "active";
                      const phone = u.phoneNumber || "—";
                      return (
                        <tr key={u._id}
                          className={`transition-colors hover:bg-[#F8FAFC] ${isSelected ? "bg-[#FFFBEB]" : ""}`}>

                          {/* Checkbox */}
                          <td className="px-5 py-3">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleRow(u._id)}
                              className="w-4 h-4 rounded accent-[#F59E0B] cursor-pointer" />
                          </td>

                          {/* Avatar + Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {u.profileImage?.url ? (
                                <img src={u.profileImage.url} alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                              ) : (
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getUserGrad(u._id)}
                                  flex items-center justify-center text-xs font-extrabold text-white shrink-0 select-none`}>
                                  {getInitials(u.name)}
                                </div>
                              )}
                              <span className="font-semibold text-[#1E293B] whitespace-nowrap">{u.name}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3 text-[#64748B] text-xs">{u.email}</td>

                          {/* Phone */}
                          <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap">{phone}</td>

                          {/* Role */}
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize ${ROLE_CFG[u.role] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                              {u.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize ${STATUS_CFG[status]}`}>
                              {status}
                            </span>
                          </td>

                          {/* Joined */}
                          <td className="px-4 py-3 text-[#94A3B8] text-xs whitespace-nowrap">{formatDate(u.createdAt)}</td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {/* View */}
                              <button title="View Profile"
                                onClick={() => setModal({ type: "view", payload: u._id })}
                                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                👁️
                              </button>

                              {/* Block / Unblock */}
                              <button title={status === "active" ? "Block User" : "Unblock User"}
                                onClick={() => handleToggleBlock(u._id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm
                                  ${status === "active"
                                    ? "bg-[#F1F5F9] hover:bg-amber-50 hover:text-amber-600 text-[#64748B]"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                                {status === "active" ? "🚫" : "✅"}
                              </button>

                              {/* Promote to Agent */}
                              {u.role === "buyer" && (
                                <button title="Promote to Agent"
                                  onClick={() => setModal({ type: "promote", payload: u._id })}
                                  className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-purple-50 hover:text-purple-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                  ⬆️
                                </button>
                              )}

                              {/* Delete */}
                              {u.role !== "admin" && (
                                <button title="Delete User"
                                  onClick={() => setModal({ type: "delete", payload: u._id })}
                                  className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {!isLoading && users.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="text-5xl mb-3">👥</span>
                  <p className="font-bold text-[#0F172A]">No users found</p>
                  <p className="text-sm text-[#64748B] mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages}
              onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}

        </main>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "view" && (
        <UserDetailModal
          userId={modal.payload}
          onClose={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Delete User?" message="This action is permanent and cannot be undone."
          confirmLabel="Yes, Delete" confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={() => handleDelete(modal.payload)}
          onCancel={() => setModal(null)} />
      )}
      {modal?.type === "promote" && (
        <ConfirmModal
          title="Promote to Agent?" message="This user will be granted Agent privileges."
          confirmLabel="Yes, Promote" confirmStyle="bg-[#0F6E56] hover:bg-[#065F46]"
          onConfirm={() => handlePromote(modal.payload)}
          onCancel={() => setModal(null)} />
      )}
      {modal?.type === "bulkBlock" && (
        <ConfirmModal
          title={`Block ${selected.length} Users?`} message="Selected users will lose access to their accounts."
          confirmLabel="Block All" confirmStyle="bg-amber-500 hover:bg-amber-600"
          onConfirm={handleBulkBlock}
          onCancel={() => setModal(null)} />
      )}
      {modal?.type === "bulkDelete" && (
        <ConfirmModal
          title={`Delete ${selected.length} Users?`} message="This is permanent. All their data will be removed."
          confirmLabel="Delete All" confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={handleBulkDelete}
          onCancel={() => setModal(null)} />
      )}

    </div>
  );
}
