"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import StatusBadge from "@/components/dashboard/StatusBadge";
import DeleteModal from "@/components/dashboard/DeleteModal";

/* ── Status pill config ──────────────────────────────────── */
const PILL_CFG = {
  All:       { active: "bg-[#0F172A] text-white border-[#0F172A]",   inactive: "bg-white text-[#64748B] border-[#E2E8F0]" },
  Available: { active: "bg-emerald-500 text-white border-emerald-500", inactive: "bg-white text-[#64748B] border-[#E2E8F0]" },
  pending:   { active: "bg-amber-400 text-white border-amber-400",    inactive: "bg-white text-[#64748B] border-[#E2E8F0]" },
  Sold:      { active: "bg-red-500 text-white border-red-500",        inactive: "bg-white text-[#64748B] border-[#E2E8F0]" },
  Rented:    { active: "bg-blue-500 text-white border-blue-500",      inactive: "bg-white text-[#64748B] border-[#E2E8F0]" },
};

/* ── Approval status badge ───────────────────────────────── */
const APPROVAL_CFG = {
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

/* ── Property type emoji map ─────────────────────────────── */
function typeEmoji(type) {
  const map = { House:"🏡", Apartment:"🏢", Villa:"🏖️", Plot:"🏗️", Commercial:"🏪" };
  return map[type] || "🏠";
}

/* ── Price formatter ─────────────────────────────────────── */
function formatPrice(price, listingType) {
  if (!price) return "—";
  const n = Number(price);
  let label;
  if (n >= 10000000)      label = `PKR ${(n/10000000).toFixed(1)} Cr`;
  else if (n >= 100000)   label = `PKR ${(n/100000).toFixed(0)} Lac`;
  else                    label = `PKR ${n.toLocaleString()}`;
  return listingType === "Rent" ? `${label}/mo` : label;
}

/* ── Loading spinner ─────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#94A3B8] font-medium">Loading listings...</p>
    </div>
  );
}

const inputCls = "border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all bg-white";

/* ══════════════════════════════════════════════════════════ */
export default function MyListingsPage() {
  const router = useRouter();

  const [listings,     setListings]     = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [apiError,     setApiError]     = useState("");
  const [viewMode,     setViewMode]     = useState("grid");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [deleteModal,  setDeleteModal]  = useState({ isOpen: false, id: null, title: "" });
  const [isDeleting,   setIsDeleting]   = useState(false);

  /* ── Fetch listings on mount ── */
  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setIsLoading(true);
    setApiError("");
    try {
      const res = await axiosClient.get("/properties/user/my-properties");
      // Handle both { success, data: [...] } and direct array responses
      const raw = res.data?.data ?? res.data ?? [];
      const data = Array.isArray(raw) ? raw : [];
      setListings(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("propfind_user");
        router.push("/login");
        return;
      }
      setApiError(err.response?.data?.message || "Failed to load listings.");
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Stats ── */
  const stats = useMemo(() => ({
    All:       listings.length,
    Available: listings.filter(l => l.status === "Available").length,
    pending:   listings.filter(l => l.approvalStatus === "pending").length,
    Sold:      listings.filter(l => l.status === "Sold").length,
    Rented:    listings.filter(l => l.status === "Rented").length,
  }), [listings]);

  /* ── Filter ── */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return listings.filter(l => {
      // Search — empty string means match all
      const matchSearch = !q
        || l.title?.toLowerCase().includes(q)
        || l.city?.toLowerCase().includes(q)
        || l.address?.toLowerCase().includes(q);

      // Status — "All" always passes
      let matchStatus = true;
      if (statusFilter !== "All") {
        if (statusFilter === "pending") {
          matchStatus = l.approvalStatus === "pending";
        } else {
          matchStatus = l.status === statusFilter;
        }
      }

      // Type — "All" always passes
      const matchType = typeFilter === "All" || l.propertyType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [listings, searchQuery, statusFilter, typeFilter]);

  /* ── Delete handlers ── */
  function openDelete(id, title) {
    setDeleteModal({ isOpen: true, id, title });
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/properties/${deleteModal.id}`);
      setListings(prev => prev.filter(l => (l._id || l.id) !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: "" });
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to delete property.");
      setDeleteModal({ isOpen: false, id: null, title: "" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">My Listings</h1>
          <p className="text-sm text-[#64748B] mt-[2px]">Manage all your property listings</p>
        </div>
        <Link href="/dashboard/add"
          className="flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-5 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors no-underline">
          + Add Property
        </Link>
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <span>⚠️</span> {apiError}
          <button onClick={fetchListings}
            className="ml-auto text-xs font-semibold text-red-600 hover:text-red-800 underline">
            Retry
          </button>
        </div>
      )}

      {/* Status pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "All",       label: "All" },
          { key: "Available", label: "Available" },
          { key: "pending",   label: "Pending Review" },
          { key: "Sold",      label: "Sold" },
          { key: "Rented",    label: "Rented" },
        ].map(({ key, label }) => {
          const cls = PILL_CFG[key];
          return (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`px-4 py-[7px] rounded-full text-xs font-semibold border transition-all duration-200
                ${statusFilter === key ? cls.active : cls.inactive}`}>
              {label}
              <span className="ml-1 opacity-80">({stats[key] ?? 0})</span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
          <input type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, city or address..."
            className={`${inputCls} w-full pl-9`} />
        </div>
        <div className="relative">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className={`${inputCls} pr-8 appearance-none cursor-pointer`}>
            <option value="All">All Types</option>
            {["House","Apartment","Villa","Plot","Commercial"].map(t =>
              <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-[#E2E8F0]">
          {["grid","table"].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition-colors duration-200
                ${viewMode === mode ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"}
                ${mode === "table" ? "border-l border-[#E2E8F0]" : ""}`}>
              {mode === "grid" ? "⊞ Grid" : "☰ Table"}
            </button>
          ))}
        </div>
        <button onClick={fetchListings}
          className="flex items-center gap-1 border border-[#E2E8F0] text-[#64748B] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
          🔄 Refresh
        </button>
      </div>

      {/* Loading */}
      {isLoading && <Spinner />}

      {/* Result count */}
      {!isLoading && (
        <p className="text-xs text-[#94A3B8]">
          Showing <span className="font-semibold text-[#475569]">{filtered.length}</span> of{" "}
          <span className="font-semibold text-[#475569]">{listings.length}</span> properties
        </p>
      )}

      {/* ── GRID VIEW ── */}
      {!isLoading && viewMode === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((l) => {
            const id    = l._id?.toString() || l.id?.toString();
            const img   = l.images?.[0]?.url;
            const emoji = typeEmoji(l.propertyType);
            const price = formatPrice(l.price, l.listingType);
            return (
              <div key={id}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-200 flex flex-col">

                {/* Thumbnail */}
                <div className="h-[160px] relative flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] overflow-hidden">
                  {img ? (
                    <img src={img} alt={l.title}
                      className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl select-none">{emoji}</span>
                  )}
                  {/* Listing type badge */}
                  <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-md
                    ${l.listingType === "Rent" ? "bg-[#185FA5]" : "bg-[#0F6E56]"}`}>
                    For {l.listingType}
                  </span>
                  {/* Featured */}
                  {l.isFeatured && (
                    <span className="absolute top-3 right-3 bg-[#F59E0B] text-[#0F172A] text-[10px] font-bold px-2 py-1 rounded-md">
                      ⭐ Featured
                    </span>
                  )}
                  {/* Approval status */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-[3px] rounded-full border capitalize ${APPROVAL_CFG[l.approvalStatus] || APPROVAL_CFG.pending}`}>
                      {l.approvalStatus === "pending" ? "⏳ Pending Review" :
                       l.approvalStatus === "approved" ? "✅ Approved" : "❌ Rejected"}
                    </span>
                  </div>
                  {/* Views */}
                  <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                    👁 {l.views ?? 0}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <p className="text-lg font-extrabold text-[#0F172A] leading-tight">{price}</p>
                  <p className="text-sm font-semibold text-[#1E293B] truncate" title={l.title}>{l.title}</p>
                  <p className="text-xs text-[#64748B]">📍 {l.address}, {l.city}</p>
                  {l.propertyType !== "Plot" && (
                    <p className="text-xs text-[#94A3B8] flex items-center gap-3">
                      {l.bedrooms > 0  && <span>🛏 {l.bedrooms} Beds</span>}
                      {l.bathrooms > 0 && <span>🚿 {l.bathrooms} Baths</span>}
                      {l.area > 0      && <span>📐 {l.area} sqft</span>}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#F1F5F9] text-[#475569] text-[10px] font-semibold px-2 py-[2px] rounded-md">
                      {l.propertyType}
                    </span>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-[10px] text-[#CBD5E1] mt-auto">
                    Posted {new Date(l.createdAt).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                  <hr className="border-[#F1F5F9] my-1" />
                  <div className="flex items-center gap-2">
                    <button onClick={() => router.push(`/dashboard/edit-property/${id}`)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#475569] text-xs font-semibold py-2 rounded-lg transition-colors">
                      ✏️ Edit
                    </button>
                    <Link href={`/properties/${id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#F1F5F9] hover:bg-emerald-50 hover:text-emerald-600 text-[#475569] text-xs font-semibold py-2 rounded-lg transition-colors no-underline">
                      👁 View
                    </Link>
                    <button onClick={() => openDelete(id, l.title)}
                      className="w-8 h-8 flex items-center justify-center bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#94A3B8] rounded-lg transition-colors text-sm">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {!isLoading && viewMode === "table" && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {["Property","Price","Type","Status","Approval","Views","Posted","Actions"].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((l) => {
                  const id    = l._id?.toString() || l.id?.toString();
                  const img   = l.images?.[0]?.url;
                  const emoji = typeEmoji(l.propertyType);
                  const price = formatPrice(l.price, l.listingType);
                  return (
                    <tr key={id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] flex items-center justify-center">
                            {img
                              ? <img src={img} alt={l.title} className="w-full h-full object-cover" />
                              : <span className="text-xl">{emoji}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1E293B] truncate max-w-[160px]">{l.title}</p>
                            <p className="text-[11px] text-[#94A3B8]">{l.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#0F172A] whitespace-nowrap">{price}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold px-2 py-[3px] rounded-md whitespace-nowrap">
                          {l.propertyType}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize whitespace-nowrap ${APPROVAL_CFG[l.approvalStatus] || APPROVAL_CFG.pending}`}>
                          {l.approvalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">👁 {l.views ?? 0}</td>
                      <td className="px-4 py-3 text-[#94A3B8] text-xs whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => router.push(`/dashboard/edit-property/${id}`)}
                            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-amber-50 hover:text-amber-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                            ✏️
                          </button>
                          <Link href={`/properties/${id}`}
                            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#64748B] flex items-center justify-center transition-colors text-sm no-underline">
                            👁️
                          </Link>
                          <button onClick={() => openDelete(id, l.title)}
                            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!isLoading && filtered.length === 0 && !apiError && (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-[#E2E8F0]">
          <span className="text-6xl mb-4">🏠</span>
          {listings.length === 0 ? (
            <>
              <p className="font-bold text-[#1E293B] text-lg mb-1">No listings yet</p>
              <p className="text-sm text-[#64748B] mb-5">Start by adding your first property listing</p>
              <Link href="/dashboard/add"
                className="bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#D97706] transition-colors no-underline">
                + Add Your First Property
              </Link>
            </>
          ) : (
            <>
              <p className="font-bold text-[#1E293B] text-lg mb-1">No properties match your filters</p>
              <p className="text-sm text-[#64748B]">Try adjusting your search or filters</p>
              <button onClick={() => { setSearchQuery(""); setStatusFilter("All"); setTypeFilter("All"); }}
                className="mt-4 text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                Clear all filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Delete modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        propertyTitle={deleteModal.title}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: "" })}
      />
    </div>
  );
}
