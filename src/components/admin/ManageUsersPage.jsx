"use client";

import { useState, useMemo } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Pagination from "@/components/listing/Pagination";

/* ── Sample users ─────────────────────────────────────────── */
const INITIAL_USERS = [
  { id:1, initials:"AK", grad:"from-[#185FA5] to-[#0C447C]",   name:"Ahmed Khan",   email:"ahmed.khan@gmail.com",   phone:"+92 300 1112233", role:"agent",  status:"active",  joined:"Jan 12, 2024" },
  { id:2, initials:"SM", grad:"from-[#BE185D] to-[#9D174D]",   name:"Sara Malik",   email:"sara.malik@outlook.com", phone:"+92 321 9876543", role:"buyer",  status:"active",  joined:"Feb 3, 2024"  },
  { id:3, initials:"BR", grad:"from-[#0F6E56] to-[#064E3B]",   name:"Bilal Raza",   email:"bilal.raza@yahoo.com",   phone:"+92 333 4455667", role:"buyer",  status:"blocked", joined:"Mar 18, 2024" },
  { id:4, initials:"FN", grad:"from-[#6D28D9] to-[#4C1D95]",   name:"Fatima Noor",  email:"fatima.noor@gmail.com",  phone:"+92 345 6677889", role:"agent",  status:"active",  joined:"Apr 5, 2024"  },
  { id:5, initials:"ZA", grad:"from-[#0369A1] to-[#075985]",   name:"Zara Ahmed",   email:"zara.ahmed@gmail.com",   phone:"+92 312 8899001", role:"buyer",  status:"active",  joined:"Apr 22, 2024" },
  { id:6, initials:"UT", grad:"from-[#854F0B] to-[#92400E]",   name:"Usman Tariq",  email:"usman.tariq@gmail.com",  phone:"+92 300 1234567", role:"buyer",  status:"blocked", joined:"May 9, 2024"  },
  { id:7, initials:"HA", grad:"from-[#065F46] to-[#047857]",   name:"Hassan Ali",   email:"hassan.ali@propfind.pk", phone:"+92 333 0001111", role:"admin",  status:"active",  joined:"Jan 1, 2024"  },
  { id:8, initials:"NA", grad:"from-[#4F46E5] to-[#7C3AED]",   name:"Nadia Aziz",   email:"nadia.aziz@hotmail.com", phone:"+92 311 2223344", role:"agent",  status:"active",  joined:"Jun 14, 2024" },
];

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

/* ── Confirm modal ────────────────────────────────────────── */
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

export default function ManageUsersPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [users,         setUsers]         = useState(INITIAL_USERS);
  const [search,        setSearch]        = useState("");
  const [roleFilter,    setRoleFilter]    = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [selected,      setSelected]      = useState([]);   // selected row ids
  const [currentPage,   setCurrentPage]   = useState(1);
  const [modal,         setModal]         = useState(null); // { type, payload }

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole   = roleFilter   === "all" || u.role   === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* Reset page on filter change */
  function applySearch(v)  { setSearch(v);      setCurrentPage(1); setSelected([]); }
  function applyRole(v)    { setRoleFilter(v);   setCurrentPage(1); setSelected([]); }
  function applyStatus(v)  { setStatusFilter(v); setCurrentPage(1); setSelected([]); }

  /* ── Row select ── */
  const pageIds       = paginated.map(u => u.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selected.includes(id));

  function toggleSelectAll() {
    setSelected(allPageSelected ? selected.filter(id => !pageIds.includes(id)) : [...new Set([...selected, ...pageIds])]);
  }
  function toggleRow(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  /* ── User actions ── */
  function toggleBlock(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
  }
  function deleteUser(id) {
    setUsers(prev => prev.filter(u => u.id !== id));
    setSelected(prev => prev.filter(i => i !== id));
    setModal(null);
  }
  function promoteToAgent(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: "agent" } : u));
    setModal(null);
  }
  function bulkBlock() {
    setUsers(prev => prev.map(u => selected.includes(u.id) ? { ...u, status: "blocked" } : u));
    setSelected([]); setModal(null);
  }
  function bulkDelete() {
    setUsers(prev => prev.filter(u => !selected.includes(u.id)));
    setSelected([]); setModal(null);
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
              <p className="text-xs text-[#94A3B8]">Total: {users.length} users</p>
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
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
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
                  {paginated.map(u => {
                    const isSelected = selected.includes(u.id);
                    return (
                      <tr key={u.id}
                        className={`transition-colors hover:bg-[#F8FAFC] ${isSelected ? "bg-[#FFFBEB]" : ""}`}>

                        {/* Checkbox */}
                        <td className="px-5 py-3">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleRow(u.id)}
                            className="w-4 h-4 rounded accent-[#F59E0B] cursor-pointer" />
                        </td>

                        {/* Avatar + Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${u.grad}
                              flex items-center justify-center text-xs font-extrabold text-white shrink-0 select-none`}>
                              {u.initials}
                            </div>
                            <span className="font-semibold text-[#1E293B] whitespace-nowrap">{u.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-[#64748B] text-xs">{u.email}</td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap">{u.phone}</td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize ${ROLE_CFG[u.role]}`}>
                            {u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize ${STATUS_CFG[u.status]}`}>
                            {u.status}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3 text-[#94A3B8] text-xs whitespace-nowrap">{u.joined}</td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* View */}
                            <button title="View Profile"
                              className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                              👁️
                            </button>

                            {/* Block / Unblock */}
                            <button title={u.status === "active" ? "Block User" : "Unblock User"}
                              onClick={() => toggleBlock(u.id)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm
                                ${u.status === "active"
                                  ? "bg-[#F1F5F9] hover:bg-amber-50 hover:text-amber-600 text-[#64748B]"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                              {u.status === "active" ? "🚫" : "✅"}
                            </button>

                            {/* Promote to Agent */}
                            {u.role === "buyer" && (
                              <button title="Promote to Agent"
                                onClick={() => setModal({ type: "promote", payload: u.id })}
                                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-purple-50 hover:text-purple-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                ⬆️
                              </button>
                            )}

                            {/* Delete */}
                            {u.role !== "admin" && (
                              <button title="Delete User"
                                onClick={() => setModal({ type: "delete", payload: u.id })}
                                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {paginated.length === 0 && (
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
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Delete User?" message="This action is permanent and cannot be undone."
          confirmLabel="Yes, Delete" confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={() => deleteUser(modal.payload)}
          onCancel={() => setModal(null)} />
      )}
      {modal?.type === "promote" && (
        <ConfirmModal
          title="Promote to Agent?" message="This user will be granted Agent privileges."
          confirmLabel="Yes, Promote" confirmStyle="bg-[#0F6E56] hover:bg-[#065F46]"
          onConfirm={() => promoteToAgent(modal.payload)}
          onCancel={() => setModal(null)} />
      )}
      {modal?.type === "bulkBlock" && (
        <ConfirmModal
          title={`Block ${selected.length} Users?`} message="Selected users will lose access to their accounts."
          confirmLabel="Block All" confirmStyle="bg-amber-500 hover:bg-amber-600"
          onConfirm={bulkBlock}
          onCancel={() => setModal(null)} />
      )}
      {modal?.type === "bulkDelete" && (
        <ConfirmModal
          title={`Delete ${selected.length} Users?`} message="This is permanent. All their data will be removed."
          confirmLabel="Delete All" confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={bulkDelete}
          onCancel={() => setModal(null)} />
      )}

    </div>
  );
}
