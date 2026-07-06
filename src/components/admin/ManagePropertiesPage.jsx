"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Pagination from "@/components/listing/Pagination";
import {
  fetchPendingProperties,
  approveProperty as apiApproveProperty,
  rejectProperty as apiRejectProperty,
  toggleFeaturedProperty as apiToggleFeaturedProperty,
  deleteProperty as apiDeleteProperty,
} from "@/lib/adminApi";

const INITIAL = [];

const TYPES    = ["All Types","House","Apartment","Villa","Plot","Commercial"];
const CITIES   = ["All Cities","Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad"];
const STATUSES = ["all","available","pending","sold","rented"];
const ITEMS_PER_PAGE = 6;

/* ── Status helpers ────────────────────────────────────────── */
function getStatusConfig(status = "") {
  const s = status.toLowerCase();
  if (s === "available" || s === "approved") {
    return { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Available" };
  }
  if (s === "pending") {
    return { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" };
  }
  if (s === "sold" || s === "rejected") {
    return { badge: "bg-red-50 text-red-700 border-red-200", label: s === "rejected" ? "Rejected" : "Sold" };
  }
  if (s === "rented") {
    return { badge: "bg-blue-50 text-blue-700 border-blue-200", label: "Rented" };
  }
  return { badge: "bg-slate-50 text-slate-700 border-slate-200", label: status };
}

function getEmoji(type = "") {
  switch (type.toLowerCase()) {
    case "house": return "🏡";
    case "apartment": return "🏢";
    case "villa": return "🏖️";
    case "plot": return "🏗️";
    case "commercial": return "🏪";
    default: return "🏠";
  }
}

function getGrad(type = "") {
  switch (type.toLowerCase()) {
    case "house": return "from-[#1D9E75] to-[#0F6E56]";
    case "apartment": return "from-[#185FA5] to-[#0C447C]";
    case "villa": return "from-[#854F0B] to-[#F59E0B]";
    case "plot": return "from-[#4F46E5] to-[#7C3AED]";
    case "commercial": return "from-[#BE185D] to-[#9D174D]";
    default: return "from-[#0369A1] to-[#075985]";
  }
}

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

/* ── Reject modal ──────────────────────────────────────────── */
function RejectModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  const [reason, setReason] = useState("Image are not clear");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="text-center mb-4">
          <span className="text-4xl">❌</span>
          <h3 className="font-extrabold text-[#0F172A] mt-3 mb-1">{title}</h3>
          <p className="text-sm text-[#64748B]">{message}</p>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rejection Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Image are not clear"
            className="w-full text-sm border border-[#E2E8F0] rounded-xl p-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel}
            className="py-[10px] rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)}
            className="py-[10px] rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePropertiesPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [props,         setProps]         = useState(INITIAL);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState("");
  const [search,        setSearch]        = useState("");
  const [typeFilter,    setTypeFilter]    = useState("All Types");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [cityFilter,    setCityFilter]    = useState("All Cities");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [modal,         setModal]         = useState(null);
  const [reviewMode,    setReviewMode]    = useState(false);

  /* ── Derived ── */
  const pendingCount = props.filter(p => (p.approvalStatus || p.status || "").toLowerCase() === "pending").length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return props.filter(p => {
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.createdBy?.name || "").toLowerCase().includes(q);
      const matchType   = typeFilter   === "All Types"  || p.propertyType === typeFilter;
      const matchStatus = statusFilter === "all"        || (p.approvalStatus || p.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchCity   = cityFilter   === "All Cities" || p.city.toLowerCase() === cityFilter.toLowerCase();
      const matchReview = !reviewMode || (p.approvalStatus || p.status || "").toLowerCase() === "pending";
      return matchSearch && matchType && matchStatus && matchCity && matchReview;
    });
  }, [props, search, typeFilter, statusFilter, cityFilter, reviewMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function resetPage() { setCurrentPage(1); }

  /* ── Actions ── */
  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchPendingProperties();
      setProps(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pending properties.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  async function handleApprove(id) {
    try {
      await apiApproveProperty(id);
      setProps(prev => prev.filter(p => p._id !== id));
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve property.");
    }
  }

  async function handleReject(id, reason) {
    try {
      await apiRejectProperty(id, reason);
      setProps(prev => prev.filter(p => p._id !== id));
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject property.");
    }
  }

  async function handleDelete(id) {
    try {
      await apiDeleteProperty(id);
      setProps(prev => prev.filter(p => p._id !== id));
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property.");
    }
  }

  async function handleToggleFeatured(id) {
    try {
      await apiToggleFeaturedProperty(id);
      setProps(prev =>
        prev.map(p => (p._id === id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle featured status.");
    }
  }

  const dropCls = "border border-[#E2E8F0] rounded-xl px-3 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all bg-white cursor-pointer appearance-none pr-8";

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
              <h1 className="text-lg font-extrabold text-[#0F172A]">Manage Properties</h1>
              <p className="text-xs text-[#94A3B8]">Total: {props.length} properties</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-[6px]">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-amber-700">{pendingCount} pending</span>
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-extrabold text-[#0F172A] select-none">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-5">

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Pending Approval Banner ── */}
          {pendingCount > 0 && (
            <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
                  ⏳
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    {pendingCount} propert{pendingCount === 1 ? "y" : "ies"} awaiting approval
                  </p>
                  <p className="text-xs text-amber-600 mt-[1px]">
                    Review and approve or reject agent-submitted listings
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setReviewMode(true); setStatusFilter("all"); resetPage(); }}
                className="shrink-0 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap">
                Review Now →
              </button>
            </div>
          )}

          {/* Review mode pill */}
          {reviewMode && (
            <div className="flex items-center gap-3 bg-[#0F172A] rounded-xl px-5 py-3">
              <span className="text-white text-sm font-semibold">📋 Showing pending properties only</span>
              <button onClick={() => { setReviewMode(false); resetPage(); }}
                className="ml-auto text-[#94A3B8] hover:text-white text-sm transition-colors">✕ Exit review</button>
            </div>
          )}

          {/* ── Filter bar ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search by title or agent..."
                className="w-full border border-[#E2E8F0] rounded-xl pl-9 pr-9 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white" />
              {search && (
                <button onClick={() => { setSearch(""); resetPage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] text-sm">✕</button>
              )}
            </div>

            {/* Type */}
            <div className="relative">
              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); resetPage(); }} className={dropCls}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>

            {/* Status */}
            <div className="relative">
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); resetPage(); }} className={dropCls}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>

            {/* City */}
            <div className="relative">
              <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); resetPage(); }} className={dropCls}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>

            <span className="text-sm text-[#94A3B8] ml-auto shrink-0 hidden sm:block">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Table ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    {["Property","Agent","Type","Price","City","Status","Featured","Actions"].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-4 py-3 whitespace-nowrap first:px-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {isLoading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                              <div className="h-3 bg-slate-200 rounded w-16" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-12" /></td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                        <td className="px-4 py-4"><div className="h-5 bg-slate-200 rounded-full w-16" /></td>
                        <td className="px-4 py-4"><div className="w-8 h-8 rounded-lg bg-slate-200 mx-auto" /></td>
                        <td className="px-4 py-4"><div className="h-8 bg-slate-200 rounded-lg w-24" /></td>
                      </tr>
                    ))
                  ) : (
                    paginated.map(p => {
                      const scfg = getStatusConfig(p.approvalStatus || p.status);
                      const isPending = (p.approvalStatus || p.status || "").toLowerCase() === "pending";
                      const formattedPrice = p.price ? `PKR ${p.price.toLocaleString("en-PK")}` : "PKR 0";
                      const capitalizedCity = p.city ? p.city.charAt(0).toUpperCase() + p.city.slice(1) : "—";
                      return (
                        <tr key={p._id}
                          className={`transition-colors hover:bg-[#F8FAFC]
                            ${isPending ? "bg-amber-50/40" : ""}`}>

                          {/* Property thumbnail + title */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {p.images?.[0]?.url ? (
                                <img src={p.images[0].url} alt={p.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGrad(p.propertyType)}
                                  flex items-center justify-center text-lg shrink-0`}>
                                  {getEmoji(p.propertyType)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-[#1E293B] truncate max-w-[180px]" title={p.title}>{p.title}</p>
                                <p className="text-[10px] text-[#94A3B8] mt-[1px]">ID #{p._id?.slice(-6).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>

                          {/* Agent */}
                          <td className="px-4 py-3 text-[#64748B] whitespace-nowrap text-xs">
                            {p.createdBy?.name || "Unknown Agent"}
                          </td>

                          {/* Type */}
                          <td className="px-4 py-3">
                            <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold px-2 py-[3px] rounded-md whitespace-nowrap">
                              {p.propertyType || "House"}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3 font-bold text-[#0F172A] whitespace-nowrap text-xs">
                            {formattedPrice}
                          </td>

                          {/* City */}
                          <td className="px-4 py-3 text-[#64748B] whitespace-nowrap text-xs">
                            {capitalizedCity}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border ${scfg.badge}`}>
                              {scfg.label}
                            </span>
                          </td>

                          {/* Featured toggle */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleToggleFeatured(p._id)}
                              title={p.isFeatured ? "Remove from featured" : "Mark as featured"}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-150 text-base
                                ${p.isFeatured
                                  ? "bg-[#FFFBEB] text-[#F59E0B] hover:bg-amber-100"
                                  : "bg-[#F1F5F9] text-[#CBD5E1] hover:bg-[#FFFBEB] hover:text-[#F59E0B]"}`}>
                              ⭐
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {/* View */}
                              <button title="View Property"
                                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                👁️
                              </button>

                              {/* Approve — only for pending */}
                              {isPending && (
                                <button title="Approve"
                                  onClick={() => setModal({ type:"approve", payload: p._id })}
                                  className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors text-sm font-bold">
                                  ✓
                                </button>
                              )}

                              {/* Reject — only for pending */}
                              {isPending && (
                                <button title="Reject"
                                  onClick={() => setModal({ type:"reject", payload: p._id })}
                                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors text-sm font-bold">
                                  ✕
                                </button>
                              )}

                              {/* Delete */}
                              <button title="Delete"
                                onClick={() => setModal({ type:"delete", payload: p._id })}
                                className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {!isLoading && paginated.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="text-5xl mb-3">🏠</span>
                  <p className="font-bold text-[#0F172A]">No properties found</p>
                  <p className="text-sm text-[#64748B] mt-1">Adjust your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages}
              onPageChange={p => { setCurrentPage(p); window.scrollTo({ top:0, behavior:"smooth" }); }} />
          )}

        </main>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "approve" && (
        <ConfirmModal title="Approve Property?" message="This listing will go live on the platform."
          confirmLabel="Yes, Approve" confirmStyle="bg-[#0F6E56] hover:bg-[#065F46]"
          onConfirm={() => handleApprove(modal.payload)} onCancel={() => setModal(null)} />
      )}
      {modal?.type === "reject" && (
        <RejectModal title="Reject Property?" message="This listing will be marked as rejected and hidden."
          confirmLabel="Yes, Reject"
          onConfirm={(reason) => handleReject(modal.payload, reason)} onCancel={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal title="Delete Property?" message="This is permanent and cannot be undone."
          confirmLabel="Yes, Delete" confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={() => handleDelete(modal.payload)} onCancel={() => setModal(null)} />
      )}

    </div>
  );
}
