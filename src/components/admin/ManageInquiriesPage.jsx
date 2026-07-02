"use client";

import { useState, useMemo } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Pagination from "@/components/listing/Pagination";

/* ── Sample data ──────────────────────────────────────────── */
const SAMPLE = [
  {
    id: 1,
    initials: "UT", avatarGrad: "from-[#185FA5] to-[#0C447C]",
    name: "Usman Tariq",   email: "usman.tariq@gmail.com",   phone: "+92 300 1112233",
    property: "Modern 5-Bed House in DHA Phase 6",
    propEmoji: "🏡", propGrad: "from-[#1D9E75] to-[#0F6E56]",
    agent: "Ahmed Khan",
    date: "Today, 10:24 AM",
    message: "Hi, I'm very interested in this property. Can we schedule a visit this weekend? I'd like to bring my family along. Please let me know a suitable time and any documents I should bring.",
    status: "unread",
  },
  {
    id: 2,
    initials: "SM", avatarGrad: "from-[#BE185D] to-[#9D174D]",
    name: "Sara Malik",    email: "sara.malik@outlook.com",  phone: "+92 321 9876543",
    property: "Luxury Apartment — Clifton Block 4",
    propEmoji: "🏢", propGrad: "from-[#185FA5] to-[#0C447C]",
    agent: "Fatima Noor",
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
    agent: "Nadia Aziz",
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
    agent: "Ahmed Khan",
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
    agent: "Nadia Aziz",
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
    agent: "Fatima Noor",
    date: "26 Jun, 9:45 AM",
    message: "Hello, I saw your listing online. Can you confirm whether utilities (gas, electricity) are included in the rent? Also is there covered parking available for residents?",
    status: "responded",
  },
  {
    id: 7,
    initials: "HA", avatarGrad: "from-[#065F46] to-[#047857]",
    name: "Hassan Ali",    email: "hassan.ali@gmail.com",    phone: "+92 333 0001111",
    property: "Corner House — Johar Town Lahore",
    propEmoji: "🏡", propGrad: "from-[#065F46] to-[#047857]",
    agent: "Ahmed Khan",
    date: "25 Jun, 4:00 PM",
    message: "I would like to know if there is a mosque and school nearby. Also what is the total covered area and is there a servant quarter included in this house?",
    status: "unread",
  },
  {
    id: 8,
    initials: "NA", avatarGrad: "from-[#4F46E5] to-[#7C3AED]",
    name: "Nadia Sheikh",  email: "nadia.sheikh@hotmail.com", phone: "+92 311 5556677",
    property: "4-Bed House — Gulshan Block 13 Karachi",
    propEmoji: "🏘️", propGrad: "from-[#0369A1] to-[#075985]",
    agent: "Fatima Noor",
    date: "24 Jun, 10:00 AM",
    message: "We are a family of 6 looking for a spacious house. Is this property suitable for us? Are pets allowed? Please share the floor plan if available.",
    status: "read",
  },
];

const ITEMS_PER_PAGE = 5;
const TABS = ["all", "unread", "read", "responded"];

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CFG = {
  unread:    { label: "Unread",    badge: "bg-red-50     text-red-700     border-red-200"   },
  read:      { label: "Read",      badge: "bg-[#F1F5F9]  text-[#475569]   border-[#E2E8F0]" },
  responded: { label: "Responded", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
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

/* ── Inquiry Row ──────────────────────────────────────────── */
function InquiryRow({ inq, onMarkRead, onMarkResponded, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CFG[inq.status];
  const isUnread = inq.status === "unread";
  const SHORT = 100;
  const isLong = inq.message.length > SHORT;

  return (
    <tr className={`transition-colors hover:bg-[#F8FAFC] align-top
      ${isUnread ? "bg-amber-50/40" : ""}`}>

      {/* Avatar + Name */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${inq.avatarGrad}
            flex items-center justify-center text-xs font-extrabold text-white shrink-0 select-none`}>
            {inq.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#1E293B] whitespace-nowrap text-sm">{inq.name}</p>
            <p className="text-[11px] text-[#94A3B8] truncate max-w-[140px]">{inq.email}</p>
          </div>
        </div>
      </td>

      {/* Property */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${inq.propGrad}
            flex items-center justify-center text-sm shrink-0`}>
            {inq.propEmoji}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#1E293B] truncate max-w-[160px]">{inq.property}</p>
            <p className="text-[11px] text-[#94A3B8]">Agent: {inq.agent}</p>
          </div>
        </div>
      </td>

      {/* Message */}
      <td className="px-4 py-4 max-w-[240px]">
        <p className="text-xs text-[#475569] leading-relaxed">
          {expanded || !isLong ? inq.message : inq.message.slice(0, SHORT) + "…"}
        </p>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors mt-1">
            {expanded ? "Less ↑" : "More ↓"}
          </button>
        )}
      </td>

      {/* Date */}
      <td className="px-4 py-4 text-[11px] text-[#94A3B8] whitespace-nowrap">{inq.date}</td>

      {/* Status */}
      <td className="px-4 py-4">
        <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border whitespace-nowrap ${cfg.badge}`}>
          {isUnread && <span className="inline-block w-[6px] h-[6px] rounded-full bg-red-500 mr-1 mb-[1px] align-middle" />}
          {cfg.label}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 flex-wrap">
          {inq.status === "unread" && (
            <button title="Mark as Read"
              onClick={() => onMarkRead(inq.id)}
              className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
              👁️
            </button>
          )}
          {inq.status !== "responded" && (
            <button title="Mark as Responded"
              onClick={() => onMarkResponded(inq.id)}
              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors text-sm">
              ✅
            </button>
          )}
          <button title="Delete Inquiry"
            onClick={() => onDelete(inq.id)}
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#64748B] flex items-center justify-center transition-colors text-sm">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function ManageInquiriesPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [inquiries,     setInquiries]     = useState(SAMPLE);
  const [activeTab,     setActiveTab]     = useState("all");
  const [search,        setSearch]        = useState("");
  const [agentFilter,   setAgentFilter]   = useState("All Agents");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [modal,         setModal]         = useState(null);

  /* Unique agents list */
  const agents = useMemo(() => {
    const unique = [...new Set(SAMPLE.map(i => i.agent))].sort();
    return ["All Agents", ...unique];
  }, []);

  /* Counts per tab */
  const counts = useMemo(() => ({
    all:       inquiries.length,
    unread:    inquiries.filter(i => i.status === "unread").length,
    read:      inquiries.filter(i => i.status === "read").length,
    responded: inquiries.filter(i => i.status === "responded").length,
  }), [inquiries]);

  /* Filtered list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inquiries.filter(i => {
      const tabOk    = activeTab === "all" || i.status === activeTab;
      const searchOk = !q || i.name.toLowerCase().includes(q) || i.property.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
      const agentOk  = agentFilter === "All Agents" || i.agent === agentFilter;
      return tabOk && searchOk && agentOk;
    });
  }, [inquiries, activeTab, search, agentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function resetPage() { setCurrentPage(1); }

  /* Actions */
  function markRead(id)       { setInquiries(p => p.map(i => i.id === id ? { ...i, status: "read"      } : i)); }
  function markResponded(id)  { setInquiries(p => p.map(i => i.id === id ? { ...i, status: "responded" } : i)); }
  function deleteInquiry(id)  { setInquiries(p => p.filter(i => i.id !== id)); setModal(null); }

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
              <h1 className="text-lg font-extrabold text-[#0F172A]">Manage Inquiries</h1>
              <p className="text-xs text-[#94A3B8]">Total: {inquiries.length} inquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {counts.unread > 0 && (
              <span className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-[6px]">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-red-700">{counts.unread} unread</span>
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-extrabold text-[#0F172A] select-none">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-5">

          {/* ── Unread Banner ── */}
          {counts.unread > 0 && (
            <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-xl shrink-0">
                  💬
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">
                    {counts.unread} unread {counts.unread === 1 ? "inquiry" : "inquiries"} need attention
                  </p>
                  <p className="text-xs text-red-600 mt-[1px]">Buyers are waiting for a response from your agents</p>
                </div>
              </div>
              <button
                onClick={() => { setActiveTab("unread"); resetPage(); }}
                className="shrink-0 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors whitespace-nowrap">
                View Unread →
              </button>
            </div>
          )}

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total",     value: counts.all,       bg: "bg-[#F1F5F9]",    text: "text-[#475569]",   icon: "💬" },
              { label: "Unread",    value: counts.unread,    bg: "bg-red-50",        text: "text-red-700",     icon: "🔴" },
              { label: "Read",      value: counts.read,      bg: "bg-blue-50",       text: "text-blue-700",    icon: "👁️" },
              { label: "Responded", value: counts.responded,  bg: "bg-emerald-50",    text: "text-emerald-700", icon: "✅" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3`}>
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className={`text-xl font-extrabold ${s.text}`}>{s.value}</p>
                  <p className="text-xs text-[#94A3B8] font-semibold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 w-fit flex-wrap">
            {TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); resetPage(); }}
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

          {/* ── Filter bar ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search by buyer name, email or property..."
                className="w-full border border-[#E2E8F0] rounded-xl pl-9 pr-9 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white" />
              {search && (
                <button onClick={() => { setSearch(""); resetPage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] text-sm">✕</button>
              )}
            </div>

            {/* Agent filter */}
            <div className="relative">
              <select value={agentFilter} onChange={e => { setAgentFilter(e.target.value); resetPage(); }} className={dropCls}>
                {agents.map(a => <option key={a}>{a}</option>)}
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
                    {["Buyer", "Property / Agent", "Message", "Date", "Status", "Actions"].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-4 py-3 whitespace-nowrap first:px-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {paginated.map(inq => (
                    <InquiryRow
                      key={inq.id}
                      inq={inq}
                      onMarkRead={markRead}
                      onMarkResponded={markResponded}
                      onDelete={id => setModal({ type: "delete", payload: id })}
                    />
                  ))}
                </tbody>
              </table>

              {paginated.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="text-5xl mb-3">💬</span>
                  <p className="font-bold text-[#0F172A]">No inquiries found</p>
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

      {/* ── Delete Modal ── */}
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Delete Inquiry?"
          message="This action is permanent and cannot be undone."
          confirmLabel="Yes, Delete"
          confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={() => deleteInquiry(modal.payload)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
