"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/listing/Pagination";
import axiosClient from "@/lib/axiosClient";

const ITEMS_PER_PAGE = 4;

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CFG = {
  unread:    { label: "Unread",     dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200"   },
  read:      { label: "Read",       dot: "bg-[#94A3B8]",   badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" },
  responded: { label: "Responded",  dot: "bg-[#0F6E56]",   badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const TABS = ["all", "unread", "read", "responded"];

/* ── Map API response item to component shape ────────────── */
function mapInquiry(item) {
  const buyer = item.buyer || item.buyerInfo || {};
  const prop  = item.property || {};
  const name  = buyer.name || item.buyerName || "Unknown";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return {
    id:        item._id || item.id,
    initials,
    avatarGrad: "from-[#185FA5] to-[#0C447C]",   // default gradient
    name,
    email:     buyer.email || item.buyerEmail || "—",
    phone:     buyer.phoneNumber || buyer.phone || item.buyerPhone || "—",
    property:  prop.title || item.propertyTitle || "—",
    propEmoji: "🏠",
    propGrad:  "from-[#0F172A] to-[#1E3A5F]",
    date:      item.createdAt
      ? new Date(item.createdAt).toLocaleString("en-PK", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })
      : "—",
    message:   item.message || "",
    status:    item.status || "unread",
  };
}

/* ── Inquiry Card ─────────────────────────────────────────── */
function InquiryCard({ inq, onMarkRead, onMarkResponded }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CFG[inq.status];
  const isUnread = inq.status === "unread";
  const SHORT_LEN = 120;
  const isLong = inq.message.length > SHORT_LEN;

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden 
      ${isUnread ? "border-[#F59E0B]/30 bg-[#FFFBEB]/60" : "border-[#E2E8F0] bg-white"}`}>

      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${inq.avatarGrad}
            flex items-center justify-center text-sm font-extrabold text-white shrink-0 select-none`}>
            {inq.initials}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Row 1: name + status + date */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-[#0F172A]">{inq.name}</span>
                {isUnread && <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />}
                <span className={`text-[11px] font-bold px-[9px] py-[2px] rounded-full border ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] whitespace-nowrap shrink-0">{inq.date}</span>
            </div>

            {/* Row 2: contact info */}
            <div className="flex flex-wrap gap-x-4 gap-y-[2px] mt-1">
              <span className="text-xs text-[#64748B] flex items-center gap-1">✉️ {inq.email}</span>
              <span className="text-xs text-[#64748B] flex items-center gap-1">📞 {inq.phone}</span>
            </div>

            {/* Row 3: property thumbnail */}
            <div className="flex items-center gap-2 mt-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 w-fit max-w-full">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${inq.propGrad}
                flex items-center justify-center text-base shrink-0`}>
                {inq.propEmoji}
              </div>
              <span className="text-xs font-semibold text-[#1E293B] truncate max-w-[260px]">
                {inq.property}
              </span>
            </div>

            {/* Row 4: message */}
            <div className="mt-3">
              <p className="text-sm text-[#475569] leading-relaxed">
                {expanded || !isLong
                  ? inq.message
                  : inq.message.slice(0, SHORT_LEN) + "..."}
              </p>
              {isLong && (
                <button onClick={() => setExpanded(!expanded)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors mt-1">
                  {expanded ? "Show less ↑" : "Read more ↓"}
                </button>
              )}
            </div>

            {/* Row 5: action buttons */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <button className="flex items-center gap-1 bg-[#0F172A] text-white text-xs font-semibold px-3 py-[7px] rounded-lg hover:bg-[#1E293B] transition-colors">
                💬 Reply
              </button>
              {inq.status === "unread" && (
                <button onClick={() => onMarkRead(inq.id)}
                  className="flex items-center gap-1 border border-[#E2E8F0] text-[#475569] text-xs font-semibold px-3 py-[7px] rounded-lg hover:border-[#F59E0B] hover:text-[#0F172A] transition-colors bg-white">
                  ✓ Mark as Read
                </button>
              )}
              {inq.status !== "responded" && (
                <button onClick={() => onMarkResponded(inq.id)}
                  className="flex items-center gap-1 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-[7px] rounded-lg hover:bg-emerald-50 transition-colors bg-white">
                  ✅ Mark as Responded
                </button>
              )}
              <button className="flex items-center gap-1 border border-red-100 text-red-400 text-xs font-semibold px-3 py-[7px] rounded-lg hover:bg-red-50 transition-colors bg-white ml-auto">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function AgentInquiriesPage() {
  const [activeTab,   setActiveTab]   = useState("all");
  const [search,      setSearch]      = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiries,   setInquiries]   = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [apiError,    setApiError]    = useState("");

  /* ── Fetch on mount ── */
  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setIsLoading(true);
    setApiError("");
    try {
      const res = await axiosClient.get(
        "/inquiries/received/my-listings",
        { params: { page: 1, limit: 100 } }   // fetch all, paginate client-side
      );
      const raw = res.data?.data || res.data || [];
      setInquiries(Array.isArray(raw) ? raw.map(mapInquiry) : []);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to load inquiries.");
    } finally {
      setIsLoading(false);
    }
  }

  const counts = useMemo(() => ({
    all:       inquiries.length,
    unread:    inquiries.filter(i => i.status === "unread").length,
    read:      inquiries.filter(i => i.status === "read").length,
    responded: inquiries.filter(i => i.status === "responded").length,
  }), [inquiries]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inquiries.filter(i => {
      const tabOk    = activeTab === "all" || i.status === activeTab;
      const searchOk = !q || i.name.toLowerCase().includes(q) || i.property.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
      return tabOk && searchOk;
    });
  }, [inquiries, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function handleTabChange(tab) { setActiveTab(tab); setCurrentPage(1); }
  function handleSearch(val)    { setSearch(val);    setCurrentPage(1); }
  function markRead(id)        { setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: "read" } : i)); }
  function markResponded(id)   { setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: "responded" } : i)); }

  return (
    <div className="flex flex-col gap-5 max-w-full">

      {/* Heading row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">All Inquiries</h2>
          <p className="text-xs text-[#94A3B8] mt-[2px]">
            {isLoading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "inquiry" : "inquiries"} found`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {counts.unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {counts.unread} unread
            </span>
          )}
          <button onClick={fetchInquiries}
            className="border border-[#E2E8F0] text-[#64748B] text-xs font-semibold px-3 py-[9px] rounded-xl hover:bg-[#F8FAFC] transition-colors">
            🔄 Refresh
          </button>
          <div className="relative w-full sm:w-[280px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
            <input type="text" value={search} onChange={e => handleSearch(e.target.value)}
              placeholder="Search by buyer or property..."
              className="w-full border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white" />
            {search && (
              <button onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] text-sm">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <span>⚠️</span> {apiError}
          <button onClick={fetchInquiries} className="ml-auto text-xs font-semibold underline">Retry</button>
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#94A3B8]">Loading inquiries...</span>
        </div>
      )}

      {/* Filter tabs */}
      {!isLoading && (
        <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 w-fit flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 capitalize
                ${activeTab === tab ? "bg-[#F59E0B] text-[#0F172A]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>
              {tab}
              {counts[tab] > 0 && (
                <span className={`text-[10px] font-bold px-[7px] py-[1px] rounded-full
                  ${activeTab === tab ? "bg-[#0F172A]/20 text-[#0F172A]" : tab === "unread" ? "bg-red-100 text-red-600" : "bg-[#F1F5F9] text-[#475569]"}`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Inquiry list */}
      {!isLoading && (paginated.length > 0 ? (
        <div className="flex flex-col gap-4">
          {paginated.map(inq => (
            <InquiryCard key={inq.id} inq={inq} onMarkRead={markRead} onMarkResponded={markResponded} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <span className="text-5xl mb-4">💬</span>
          <p className="font-bold text-[#0F172A] text-base mb-1">No inquiries found</p>
          <p className="text-sm text-[#64748B]">
            {search ? "Try a different search term" : "No inquiries in this category yet"}
          </p>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages}
          onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      )}
    </div>
  );
}
