"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axiosClient from "@/lib/axiosClient";

/* ── Constants ────────────────────────────────────────────── */
const CITY_CHIPS = ["All", "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar"];
const SORT_OPTIONS = [
  { value: "listings", label: "Most Listings" },
  { value: "newest",   label: "Newest First"  },
  { value: "name",     label: "Name A–Z"      },
];

const GRADS = [
  "from-[#185FA5] to-[#0C447C]",
  "from-[#0F6E56] to-[#064E3B]",
  "from-[#854F0B] to-[#F59E0B]",
  "from-[#6D28D9] to-[#4C1D95]",
  "from-[#BE185D] to-[#9D174D]",
  "from-[#0369A1] to-[#075985]",
];

/* ── Map API response → card shape ──────────────────────── */
function mapAgent(item, idx) {
  const initials = (item.name || "AG")
    .trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return {
    id:           item._id || item.id,
    name:         item.name          || "Unknown Agent",
    agency:       item.agencyName    || "Independent",
    city:         item.city          || "",
    phone:        item.phoneNumber   || "",
    email:        item.email         || "",
    bio:          item.bio           || "",
    listings:     item.totalListings ?? 0,
    profileImage: item.profileImage?.url || "",
    initials,
    grad:         GRADS[idx % GRADS.length],
    createdAt:    item.createdAt     || "",
  };
}

/* ── Skeleton card ───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-[72px] bg-[#F1F5F9]" />
      <div className="px-5 pb-5 pt-2 flex flex-col gap-3">
        <div className="w-14 h-14 rounded-full bg-[#F1F5F9] -mt-7" />
        <div className="h-4 bg-[#F1F5F9] rounded w-3/4" />
        <div className="h-3 bg-[#F1F5F9] rounded w-1/2" />
        <div className="h-3 bg-[#F1F5F9] rounded w-1/3" />
        <div className="flex gap-2 mt-3">
          <div className="flex-1 h-8 bg-[#F1F5F9] rounded-xl" />
          <div className="flex-1 h-8 bg-[#F1F5F9] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── Agent Card ──────────────────────────────────────────── */
function AgentCard({ agent }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] transition-all duration-200 group flex flex-col">

      {/* Cover strip */}
      <Link href={`/agents/${agent.id}`} className="block">
        <div className="h-[72px] rounded-t-2xl"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F6E56 100%)" }} />
      </Link>

      {/* Body */}
      <div className="px-5 pb-5 flex-1 flex flex-col">

        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-7 mb-3">
          <Link href={`/agents/${agent.id}`}>
            {agent.profileImage ? (
              <div className="w-14 h-14 rounded-full overflow-hidden border-[3px] border-white shadow-md relative z-10 shrink-0">
                <img src={agent.profileImage} alt={agent.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${agent.grad}
                flex items-center justify-center text-lg font-extrabold text-white
                border-[3px] border-white shadow-md select-none relative z-10`}>
                {agent.initials}
              </div>
            )}
          </Link>
          <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-bold px-3 py-1 rounded-full mt-8">
            {agent.listings} listings
          </span>
        </div>

        {/* Name + agency */}
        <Link href={`/agents/${agent.id}`} className="block no-underline">
          <h3 className="font-extrabold text-[#0F172A] text-[15px] leading-tight group-hover:text-[#F59E0B] transition-colors">
            {agent.name}
          </h3>
        </Link>
        <p className="text-xs text-[#64748B] mt-[2px]">{agent.agency}</p>

        {agent.city && (
          <p className="text-xs text-[#94A3B8] mt-[2px]">📍 {agent.city}</p>
        )}

        {agent.bio && (
          <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">{agent.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[#F1F5F9] mt-4">
          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0F172A]">{agent.listings}</p>
            <p className="text-[10px] text-[#94A3B8]">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0F172A]">
              {agent.createdAt ? new Date(agent.createdAt).getFullYear() : "—"}
            </p>
            <p className="text-[10px] text-[#94A3B8]">Member Since</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <Link href={`/agents/${agent.id}`}
            className="flex-1 text-center bg-[#F59E0B] text-[#0F172A] text-xs font-bold py-[9px] rounded-xl hover:bg-[#D97706] transition-colors no-underline">
            View Profile
          </Link>
          {agent.phone && (
            <a href={`https://wa.me/${agent.phone.replace(/\D/g, "")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center border border-[#0F6E56] text-[#0F6E56] text-xs font-bold py-[9px] rounded-xl hover:bg-[#0F6E56] hover:text-white transition-all no-underline">
              💬 WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function AgentListPage() {
  const [agents,    setAgents]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError,  setApiError]  = useState("");
  const [search,    setSearch]    = useState("");
  const [citySearch,setCitySearch]= useState("");
  const [cityChip,  setCityChip]  = useState("All");
  const [sortBy,    setSortBy]    = useState("listings");

  /* ── Fetch ── */
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await axiosClient.get("/users/agents");
        const raw = res.data?.data || res.data || [];
        setAgents(Array.isArray(raw) ? raw.map(mapAgent) : []);
      } catch {
        setApiError("Failed to load agents. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAgents();
  }, []);

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    const q    = search.toLowerCase().trim();
    const city = cityChip !== "All" ? cityChip : (citySearch || "");

    let list = agents.filter(a => {
      const matchSearch = !q
        || a.name.toLowerCase().includes(q)
        || a.agency.toLowerCase().includes(q)
        || a.email.toLowerCase().includes(q);
      const matchCity = !city || a.city === city;
      return matchSearch && matchCity;
    });

    if (sortBy === "listings") list = [...list].sort((a, b) => b.listings - a.listings);
    if (sortBy === "newest")   list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "name")     list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [agents, search, citySearch, cityChip, sortBy]);

  const hasFilters = search || cityChip !== "All" || citySearch;
  const dropCls = "border border-[#E2E8F0] rounded-xl px-3 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] bg-white cursor-pointer appearance-none";

  function clearFilters() {
    setSearch(""); setCityChip("All"); setCitySearch("");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative px-6 pt-14 pb-12 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #0F6E56 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#F59E0B] opacity-[0.06] blur-3xl" />

        <div className="relative z-10 max-w-[680px] mx-auto">
          <span className="inline-block bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] text-[#F59E0B] text-xs font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-wider">
            🤝 Real Estate Professionals
          </span>
          <h1 className="text-3xl sm:text-[38px] font-extrabold text-white mb-3 leading-tight">
            Find a <span className="text-[#F59E0B]">Trusted Agent</span>
          </h1>
          <p className="text-[#94A3B8] text-sm mb-8 max-w-md mx-auto">
            Connect with real estate agents across Pakistan
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-[6px] flex flex-wrap sm:flex-nowrap gap-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-[580px] mx-auto">
            <div className="relative flex-1 min-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Agent name or agency..."
                className="w-full pl-9 pr-3 py-[10px] text-sm text-[#1E293B] outline-none bg-transparent placeholder:text-[#CBD5E1]" />
            </div>
            <div className="w-px bg-[#E2E8F0] my-1 hidden sm:block" />
            <div className="relative">
              <select value={citySearch}
                onChange={e => { setCitySearch(e.target.value); if (e.target.value) setCityChip("All"); }}
                className="border-none outline-none text-sm text-[#1E293B] bg-transparent cursor-pointer py-[10px] pl-2 pr-6 appearance-none">
                <option value="">All Cities</option>
                {CITY_CHIPS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>
            <button onClick={() => {}} className="w-full sm:w-auto bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ══ LIVE STATS BAR ════════════════════════════════════ */}
      <div className="bg-[#0F172A]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 divide-x divide-white/10">
          {[
            { num: isLoading ? "—" : agents.length,                                       label: "Total Agents"    },
            { num: isLoading ? "—" : agents.filter(a => a.listings > 0).length,           label: "Active Agents"   },
            { num: isLoading ? "—" : agents.reduce((s, a) => s + a.listings, 0),          label: "Total Listings"  },
          ].map(s => (
            <div key={s.label} className="text-center px-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B]">{s.num}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CONTENT ═══════════════════════════════════════════ */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-7 w-full flex-1 flex flex-col gap-5">

        {/* API error */}
        {apiError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <span>⚠️</span> {apiError}
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* City chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {CITY_CHIPS.map(c => (
              <button key={c} onClick={() => { setCityChip(c); setCitySearch(""); }}
                className={`px-4 py-[7px] rounded-full text-xs font-semibold border transition-all duration-150
                  ${cityChip === c && !citySearch
                    ? "bg-[#0F172A] text-white border-[#0F172A]"
                    : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#0F172A] hover:text-[#0F172A]"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative ml-auto">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className={`${dropCls} text-xs pr-7`}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#64748B]">
            <span className="font-bold text-[#0F172A]">{isLoading ? "..." : filtered.length}</span>{" "}
            agent{filtered.length !== 1 ? "s" : ""} found
            {cityChip !== "All" && ` in ${cityChip}`}
          </p>
          {hasFilters && (
            <button onClick={clearFilters}
              className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
              Clear all ✕
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Agent grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && !apiError && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#E2E8F0]">
            <span className="text-5xl mb-4">🔍</span>
            <p className="font-bold text-[#0F172A] text-base mb-1">No agents found</p>
            <p className="text-sm text-[#64748B] mb-4">Try adjusting your filters or search term</p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section className="mx-4 sm:mx-6 mb-12 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-10">
          <div>
            <p className="text-[10px] font-bold text-[#92400E] uppercase tracking-widest mb-2">Join Our Network</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mb-2">
              Are you a Real Estate Agent?
            </h2>
            <p className="text-[#78350F] text-sm max-w-md leading-relaxed">
              Join PropFind and grow your business. List unlimited properties and connect with thousands of serious buyers across Pakistan.
            </p>
          </div>
          <Link href="/register"
            className="shrink-0 bg-[#0F172A] text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#1E293B] transition-colors no-underline whitespace-nowrap">
            Register as Agent →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
