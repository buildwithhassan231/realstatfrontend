"use client";

import { useState, useMemo } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Pagination from "@/components/listing/Pagination";

/* ── Sample data ──────────────────────────────────────────── */
const SAMPLE = [
  {
    id: 1,
    initials: "UT", avatarGrad: "from-[#185FA5] to-[#0C447C]",
    name: "Usman Tariq",   email: "usman.tariq@gmail.com",   phone: "+92 300 1112233",
    property: "Modern 5-Bed House in DHA Phase 6",
    propEmoji: "🏡", propGrad: "from-[#1D9E75] to-[#0F6E56]",
    date: "Today, 10:24 AM",
    message: "Hi, I'm very interested in this property. Can we schedule a visit this weekend? I'd like to bring my family along to have a look. Please let me know a suitable time and any documents I should bring.",
    status: "unread",
  },
  {
    id: 2,
    initials: "SM", avatarGrad: "from-[#BE185D] to-[#9D174D]",
    name: "Sara Malik",    email: "sara.malik@outlook.com",  phone: "+92 321 9876543",
    property: "Luxury Apartment Clifton Block 4",
    propEmoji: "🏢", propGrad: "from-[#185FA5] to-[#0C447C]",
    date: "Today, 08:05 AM",
    message: "Is the apartment still available for rent? I am looking for immediate possession from next month. Could you please share more photos of the kitchen and bathrooms?",
    status: "unread",
  },
  {
    id: 3,
    initials: "BR", avatarGrad: "from-[#0F6E56] to-[#064E3B]",
    name: "Bilal Raza",    email: "bilal.raza@yahoo.com",    phone: "+92 333 4455667",
    property: "10 Marla Residential Plot — Bahria",
    propEmoji: "🏗️", propGrad: "from-[#4F46E5] to-[#7C3AED]",
    date: "Yesterday, 3:15 PM",
    message: "What is the exact location of the plot? Is it near the main gate or inner sector? Also is the price negotiable? I'm a serious buyer.",
    status: "read",
  },
  {
    id: 4,
    initials: "AK", avatarGrad: "from-[#854F0B] to-[#92400E]",
    name: "Asim Khan",     email: "asim.khan@hotmail.com",   phone: "+92 311 2223344",
    property: "Premium Villa with Pool — Bahria Town",
    propEmoji: "🏖️", propGrad: "from-[#854F0B] to-[#F59E0B]",
    date: "28 Jun, 11:00 AM",
    message: "I visited the villa last week and I'm very impressed. I'd like to discuss the final price and payment terms. When can we meet to proceed with the paperwork?",
    status: "responded",
  },
  {
    id: 5,
    initials: "FN", avatarGrad: "from-[#6D28D9] to-[#4C1D95]",
    name: "Fatima Noor",   email: "fatima.noor@gmail.com",   phone: "+92 345 6677889",
    property: "Commercial Shop — Main Boulevard Lahore",
    propEmoji: "🏪", propGrad: "from-[#BE185D] to-[#9D174D]",
    date: "27 Jun, 2:30 PM",
    message: "Is this shop available for rent on a long-term lease? We are looking for a minimum 3-year agreement. What is the security deposit required?",
    status: "read",
  },
  {
    id: 6,
    initials: "ZA", avatarGrad: "from-[#0369A1] to-[#075985]",
    name: "Zara Ahmed",    email: "zara.ahmed@gmail.com",    phone: "+92 312 8899001",
    property: "2-Bed Apartment — F-10 Islamabad",
    propEmoji: "🏢", propGrad: "from-[#0369A1] to-[#075985]",
    date: "26 Jun, 9:45 AM",
    message: "Hello, I saw your listing online. Can you confirm whether utilities (gas, electricity) are included in the rent? Also is there covered parking available for residents?",
    status: "responded",
  },
];

const ITEMS_PER_PAGE = 4;

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CFG = {
  unread:    { label: "Unread",     dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200"   },
  read:      { label: "Read",       dot: "bg-[#94A3B8]",   badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" },
  responded: { label: "Responded",  dot: "bg-[#0F6E56]",   badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const TABS = ["all", "unread", "read", "responded"];

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab,     setActiveTab]     = useState("all");
  const [search,        setSearch]        = useState("");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [inquiries,     setInquiries]     = useState(SAMPLE);

  /* Badge counts */
  const counts = useMemo(() => ({
    all:       inquiries.length,
    unread:    inquiries.filter(i => i.status === "unread").length,
    read:      inquiries.filter(i => i.status === "read").length,
    responded: inquiries.filter(i => i.status === "responded").length,
  }), [inquiries]);

  /* Filter + search */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inquiries.filter(i => {
      const tabOk = activeTab === "all" || i.status === activeTab;
      const searchOk = !q || i.name.toLowerCase().includes(q) || i.property.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
      return tabOk && searchOk;
    });
  }, [inquiries, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function handleTabChange(tab) { setActiveTab(tab); setCurrentPage(1); }
  function handleSearch(val)    { setSearch(val);    setCurrentPage(1); }

  function markRead(id) {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: "read" } : i));
  }
  function markResponded(id) {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: "responded" } : i));
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
      <div className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-transform duration-300
        ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569]">☰</button>
            <div>
              <h1 className="text-lg font-extrabold text-[#0F172A]">My Inquiries</h1>
              <p className="text-xs text-[#94A3B8] hidden sm:block">Manage and respond to buyer messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {counts.unread > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {counts.unread} unread
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#0F6E56] flex items-center justify-center text-xs font-extrabold text-white select-none">
              AK
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 max-w-[900px] w-full mx-auto flex flex-col gap-5">

          {/* ── Heading row ── */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">All Inquiries</h2>
              <p className="text-xs text-[#94A3B8] mt-[2px]">
                {filtered.length} {filtered.length === 1 ? "inquiry" : "inquiries"} found
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-[280px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
              <input
                type="text" value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by buyer or property..."
                className="w-full border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white"
              />
              {search && (
                <button onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] text-sm">✕</button>
              )}
            </div>
          </div>

          {/* ── Filter tabs ── */}
          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 w-fit flex-wrap">
            {TABS.map(tab => (
              <button key={tab} onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 capitalize
                  ${activeTab === tab
                    ? "bg-[#F59E0B] text-[#0F172A]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>
                {tab}
                {counts[tab] > 0 && (
                  <span className={`text-[10px] font-bold px-[7px] py-[1px] rounded-full
                    ${activeTab === tab
                      ? "bg-[#0F172A]/20 text-[#0F172A]"
                      : tab === "unread"
                        ? "bg-red-100 text-red-600"
                        : "bg-[#F1F5F9] text-[#475569]"}`}>
                    {counts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Inquiry list ── */}
          {paginated.length > 0 ? (
            <div className="flex flex-col gap-4">
              {paginated.map(inq => (
                <InquiryCard
                  key={inq.id} inq={inq}
                  onMarkRead={markRead}
                  onMarkResponded={markResponded}
                />
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
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}

        </main>
      </div>
    </div>
  );
}
