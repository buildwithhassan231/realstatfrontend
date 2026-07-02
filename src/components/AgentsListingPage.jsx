"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AGENTS } from "@/data/agents";

/* ── Constants ────────────────────────────────────────────── */
const CITY_CHIPS     = ["All", "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar"];
const SPEC_OPTIONS   = ["All Specializations", "Residential", "Commercial", "Plots", "Apartments", "Rentals", "Luxury Villas", "Investment"];
const SORT_OPTIONS   = [
  { value: "listings",   label: "Most Listings"    },
  { value: "experience", label: "Most Experienced" },
  { value: "rating",     label: "Top Rated"        },
  { value: "newest",     label: "Newest"           },
];

/* ── Star rating ──────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span className="flex items-center gap-[2px]">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= Math.round(rating) ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`}>★</span>
      ))}
    </span>
  );
}

/* ── Agent Card ───────────────────────────────────────────── */
function AgentCard({ agent }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] transition-all duration-200 group flex flex-col">

      {/* Cover */}
      <Link href={`/agents/${agent.id}`} className="block">
        <div className="h-[72px] relative rounded-t-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F6E56 100%)" }}>
          {agent.verified && (
            <span className="absolute top-3 right-3 bg-[#FFFBEB] border border-[#F59E0B]/40 text-[#92400E] text-[10px] font-bold px-2 py-[2px] rounded-full flex items-center gap-1">
              ✅ Verified
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="px-5 pb-5 flex-1 flex flex-col">
        {/* Avatar + rating row */}
        <div className="flex items-end justify-between -mt-7 mb-3">
          <Link href={`/agents/${agent.id}`}>
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${agent.grad}
              flex items-center justify-center text-lg font-extrabold text-white
              border-[3px] border-white shadow-md select-none relative z-10`}>
              {agent.initials}
            </div>
          </Link>
          <div className="flex flex-col items-end gap-[2px] md:mt-8">
            <Stars rating={agent.rating} />
            <span className="text-[10px] text-[#94A3B8]">{agent.rating} ({agent.reviews})</span>
          </div>
        </div>

        {/* Name */}
        <Link href={`/agents/${agent.id}`} className="block">
          <h3 className="font-extrabold text-[#0F172A] text-[15px] leading-tight group-hover:text-[#F59E0B] transition-colors">
            {agent.name}
          </h3>
        </Link>
        <p className="text-xs text-[#64748B] mt-[2px]">{agent.agency}</p>
        <p className="text-xs text-[#94A3B8] mt-[2px] flex items-center gap-1">
          📍 {agent.city} &nbsp;·&nbsp; ⭐ {agent.experience} Years
        </p>

        {/* Specialization tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {agent.specializations.slice(0,3).map(s => (
            <span key={s} className="bg-[#F1F5F9] text-[#475569] text-[10px] font-medium px-2 py-[2px] rounded-full border border-[#E2E8F0]">
              {s}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0F172A]">{agent.listings}</p>
            <p className="text-[10px] text-[#94A3B8]">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0F172A]">{agent.deals}</p>
            <p className="text-[10px] text-[#94A3B8]">Deals</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0F172A]">{agent.rating}</p>
            <p className="text-[10px] text-[#94A3B8]">Rating</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2 mt-auto pt-1">
          <Link href={`/agents/${agent.id}`}
            className="flex-1 text-center bg-[#F59E0B] text-[#0F172A] text-xs font-bold py-[9px] rounded-xl hover:bg-[#D97706] transition-colors no-underline">
            View Profile
          </Link>
          <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center border border-[#0F6E56] text-[#0F6E56] text-xs font-bold py-[9px] rounded-xl hover:bg-[#0F6E56] hover:text-white transition-all">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function AgentListPage() {
  const [search,       setSearch]       = useState("");
  const [citySearch,   setCitySearch]   = useState(""); // search bar city
  const [cityChip,     setCityChip]     = useState("All");
  const [specFilter,   setSpecFilter]   = useState("All Specializations");
  const [sortBy,       setSortBy]       = useState("listings");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  /* Combined filtering */
  const filtered = useMemo(() => {
    const q    = search.toLowerCase();
    const city = cityChip !== "All" ? cityChip : (citySearch || null);

    let list = AGENTS.filter(a => {
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.agency.toLowerCase().includes(q);
      const matchCity   = !city || a.city === city;
      const matchSpec   = specFilter === "All Specializations" || a.specializations.includes(specFilter);
      const matchVerify = !verifiedOnly || a.verified;
      return matchSearch && matchCity && matchSpec && matchVerify;
    });

    // Sort
    if (sortBy === "listings")   list = [...list].sort((a,b) => b.listings   - a.listings);
    if (sortBy === "experience") list = [...list].sort((a,b) => b.experience - a.experience);
    if (sortBy === "rating")     list = [...list].sort((a,b) => b.rating     - a.rating);
    if (sortBy === "newest")     list = [...list].sort((a,b) => b.id         - a.id);

    return list;
  }, [search, citySearch, cityChip, specFilter, sortBy, verifiedOnly]);

  const dropCls = "border border-[#E2E8F0] rounded-xl px-3 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] bg-white cursor-pointer appearance-none";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative px-6 pt-14 pb-12 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #0F6E56 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#F59E0B] opacity-[0.06] blur-3xl" />

        <div className="relative z-10 max-w-[680px] mx-auto">
          <span className="inline-block bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] text-[#F59E0B] text-xs font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-wider">
            🤝 Verified Professionals
          </span>
          <h1 className="text-3xl sm:text-[38px] font-extrabold text-white mb-3 leading-tight">
            Find a <span className="text-[#F59E0B]">Trusted Agent</span>
          </h1>
          <p className="text-[#94A3B8] text-sm mb-8 max-w-md mx-auto">
            Connect with verified real estate agents across Pakistan
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-[6px] flex flex-wrap sm:flex-nowrap gap-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-[640px] mx-auto">
            {/* Name search */}
            <div className="relative flex-1 min-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-sm">🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Agent name or agency..."
                className="w-full pl-9 pr-3 py-[10px] text-sm text-[#1E293B] outline-none bg-transparent placeholder:text-[#CBD5E1]" />
            </div>
            <div className="w-px bg-[#E2E8F0] my-1 hidden sm:block" />
            {/* City in search bar */}
            <div className="relative">
              <select value={citySearch} onChange={e => { setCitySearch(e.target.value); if(e.target.value) setCityChip("All"); }}
                className="border-none outline-none text-sm text-[#1E293B] bg-transparent cursor-pointer py-[10px] pl-2 pr-6 appearance-none">
                <option value="">All Cities</option>
                {CITY_CHIPS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>
            <div className="w-px bg-[#E2E8F0] my-1 hidden sm:block" />
            {/* Specialization */}
            <div className="relative">
              <select value={specFilter} onChange={e => setSpecFilter(e.target.value)}
                className="border-none outline-none text-sm text-[#1E293B] bg-transparent cursor-pointer py-[10px] pl-2 pr-6 appearance-none">
                {SPEC_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>
            <button className="w-full sm:w-auto bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ══ STATS ROW ═════════════════════════════════════════ */}
      <div className="bg-[#0F172A]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 divide-x divide-white/10">
          {[
            { num: "200+", label: "Verified Agents"    },
            { num: "50+",  label: "Cities Covered"      },
            { num: "10k+", label: "Properties Sold"    },
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

        {/* ── Filter bar ── */}
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

          {/* Right: sort + verified */}
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            {/* Verified toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setVerifiedOnly(v => !v)}
                className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer shrink-0
                  ${verifiedOnly ? "bg-[#F59E0B]" : "bg-[#E2E8F0]"}`}>
                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow transition-all duration-200
                  ${verifiedOnly ? "left-[19px]" : "left-[3px]"}`} />
              </div>
              <span className="text-xs text-[#475569] font-medium whitespace-nowrap">Verified only</span>
            </label>

            {/* Sort */}
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className={`${dropCls} text-xs pr-7`}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#64748B]">
            <span className="font-bold text-[#0F172A]">{filtered.length}</span>{" "}
            agent{filtered.length !== 1 ? "s" : ""} found
            {cityChip !== "All" && ` in ${cityChip}`}
          </p>
          {(search || cityChip !== "All" || specFilter !== "All Specializations" || verifiedOnly) && (
            <button onClick={() => { setSearch(""); setCityChip("All"); setCitySearch(""); setSpecFilter("All Specializations"); setVerifiedOnly(false); }}
              className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
              Clear all ✕
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#E2E8F0]">
            <span className="text-5xl mb-4">🔍</span>
            <p className="font-bold text-[#0F172A] text-base mb-1">No agents found</p>
            <p className="text-sm text-[#64748B] mb-4">Try adjusting your filters or search term</p>
            <button onClick={() => { setSearch(""); setCityChip("All"); setCitySearch(""); setSpecFilter("All Specializations"); setVerifiedOnly(false); }}
              className="text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ══ BECOME AN AGENT CTA ═══════════════════════════════ */}
      <section className="mx-4 sm:mx-6 mb-12 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-10">
          <div>
            <p className="text-[10px] font-bold text-[#92400E] uppercase tracking-widest mb-2">Join Our Network</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mb-2">
              Are you a Real Estate Agent?
            </h2>
            <p className="text-[#78350F] text-sm max-w-md leading-relaxed">
              Join PropFind and grow your business. Get verified, list unlimited properties, and connect with thousands of serious buyers across Pakistan.
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
