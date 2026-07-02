"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ── Nav links ────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Buy",      href: "/properties" },
  { label: "Rent",     href: "/properties?purpose=rent" },
  { label: "Agents",   href: "/agents"     },
  { label: "Projects", href: "/projects"   },
];

/* ── Role badge config ────────────────────────────────────── */
const ROLE_BADGE = {
  agent: "bg-emerald-100 text-emerald-700",
  buyer: "bg-blue-100   text-blue-700",
  admin: "bg-red-100    text-red-700",
};

/* ── User initials helper ─────────────────────────────────── */
function getInitials(name = "") {
  return name.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
}

/* ── Dashboard href by role ───────────────────────────────── */
function dashboardHref(role) {
  if (role === "admin")  return "/admin";
  if (role === "agent")  return "/dashboard";
  return "/favorites";
}

export default function Navbar() {
  const { user, logout }      = useAuth();
  const pathname              = usePathname();
  const router                = useRouter();
  const dropdownRef           = useRef(null);

  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [mounted,       setMounted]       = useState(false);

  /* Mark as mounted — auth state is now safe to read */
  useEffect(() => { setMounted(true); }, []);

  /* Scroll effect */
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on route change */
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/login");
  }

  /* Active link check */
  function isActive(href) {
    return pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));
  }

  const initials = user ? getInitials(user.name) : "";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "backdrop-blur-md border-b border-white/10 shadow-lg"
            : ""}`}
        style={{ background: "#0F172A", height: "68px" }}
      >
        <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between gap-6">

          {/* ── LEFT: Logo ── */}
          <Link href="/" className="flex items-center gap-[6px] shrink-0 no-underline group">
            {/* Gold accent dot */}
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] mt-[1px] group-hover:scale-110 transition-transform" />
            <span className="text-white text-xl font-extrabold tracking-tight leading-none">
              Prop<span className="text-[#F59E0B]">Find</span>
            </span>
          </Link>

          {/* ── CENTER: Nav links (desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-[14px] font-medium no-underline transition-colors duration-200 group
                    ${active ? "text-[#F59E0B]" : "text-white hover:text-[#F59E0B]"}`}
                >
                  {link.label}
                  {/* Underline bar */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#F59E0B] transition-all duration-200
                      ${active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"}`}
                    style={{ transformOrigin: "center" }}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT: Actions (desktop) ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Render placeholder until mounted to avoid hydration mismatch */}
            {!mounted ? (
              <div className="w-[168px] h-[34px]" />
            ) : !user ? (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="px-5 py-[7px] rounded-full border border-white/40 text-white text-sm font-medium no-underline
                    hover:bg-white hover:text-[#0F172A] hover:border-white transition-all duration-200"
                >
                  Login
                </Link>
                {/* Post Property */}
                <Link
                  href="/register"
                  className="px-5 py-[7px] rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-bold no-underline
                    hover:bg-[#D97706] transition-all duration-200"
                >
                  + Post Property
                </Link>
              </>
            ) : (
              <>
                {/* Post Property */}
                <Link
                  href="/dashboard/add"
                  className="px-5 py-[7px] rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-bold no-underline
                    hover:bg-[#D97706] transition-all duration-200"
                >
                  + Post Property
                </Link>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="w-9 h-9 rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-extrabold
                      flex items-center justify-center select-none hover:bg-[#D97706] transition-colors duration-200
                      ring-2 ring-[#F59E0B]/30 hover:ring-[#F59E0B]/60"
                    aria-label="Profile menu"
                  >
                    {initials}
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-[240px] bg-white rounded-2xl shadow-2xl border border-[#F1F5F9] overflow-hidden z-50 animate-in">

                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-4">
                        <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-[#0F172A] text-base font-extrabold
                          flex items-center justify-center select-none shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#0F172A] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-[1px] rounded-full capitalize ${ROLE_BADGE[user.role] || ROLE_BADGE.buyer}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <hr className="border-[#F1F5F9]" />

                      {/* Menu items */}
                      <div className="py-2">
                        <DropItem href={dashboardHref(user.role)} icon="🏠" label="My Dashboard" />

                        {user.role === "agent" && (
                          <DropItem href="/dashboard/listings" icon="📋" label="My Listings" />
                        )}
                        {user.role === "buyer" && (
                          <DropItem href="/favorites" icon="❤️" label="Saved Properties" />
                        )}

                        <DropItem href="/dashboard/profile" icon="👤" label="Profile Settings" />
                      </div>

                      <hr className="border-[#F1F5F9]" />

                      {/* Logout */}
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-[10px] text-sm font-medium text-red-500
                            hover:bg-red-50 hover:text-red-600 transition-colors duration-150 text-left"
                        >
                          <span className="text-base">🔴</span> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Mobile: hamburger ── */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-200
              ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-200
              ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-200
              ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ───────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300
          ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300
            ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-[68px] left-0 right-0 bg-[#0F172A] border-t border-white/10
            transition-all duration-300 overflow-y-auto max-h-[calc(100vh-68px)]
            ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
        >
          <div className="px-5 py-5 flex flex-col gap-2">

            {/* Logged-in: user card — only after mount */}
            {mounted && user && (
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-extrabold
                  flex items-center justify-center shrink-0 select-none">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold truncate">{user.name}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-[1px] rounded-full capitalize ${ROLE_BADGE[user.role] || ROLE_BADGE.buyer}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {/* Nav links */}
            {NAV_LINKS.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all duration-150
                    ${active
                      ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                      : "text-[#94A3B8] hover:bg-white/5 hover:text-white"}`}
                >
                  {link.label}
                  {active && <span className="ml-auto w-1 h-4 rounded-full bg-[#F59E0B]" />}
                </Link>
              );
            })}

            <hr className="border-white/10 my-1" />

            {/* Auth links — only render after mount to avoid hydration mismatch */}
            {!mounted ? null : !user ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login"
                  className="w-full text-center py-[10px] rounded-full border border-white/30 text-white text-sm font-medium no-underline hover:bg-white hover:text-[#0F172A] transition-all">
                  Login
                </Link>
                <Link href="/register"
                  className="w-full text-center py-[10px] rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-bold no-underline hover:bg-[#D97706] transition-all">
                  + Post Property
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-1">
                <MobileItem href={dashboardHref(user.role)} icon="🏠" label="My Dashboard" />
                {user.role === "agent" && <MobileItem href="/dashboard/listings" icon="📋" label="My Listings" />}
                {user.role === "buyer" && <MobileItem href="/favorites" icon="❤️" label="Saved Properties" />}
                <MobileItem href="/dashboard/profile" icon="👤" label="Profile Settings" />
                <Link href="/dashboard/add"
                  className="w-full text-center py-[10px] mt-1 rounded-full bg-[#F59E0B] text-[#0F172A] text-sm font-bold no-underline hover:bg-[#D97706] transition-all">
                  + Post Property
                </Link>
                <button onClick={handleLogout}
                  className="w-full text-center py-[10px] rounded-full border border-red-400/30 text-red-400 text-sm font-medium hover:bg-red-50/10 transition-all">
                  🔴 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer so content doesn't go under sticky nav */}
      <div style={{ height: "68px" }} />
    </>
  );
}

/* ── Dropdown item ────────────────────────────────────────── */
function DropItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-[10px] text-sm font-medium text-[#1E293B] no-underline
        hover:bg-[#FFFBEB] hover:text-[#F59E0B] transition-colors duration-150"
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </Link>
  );
}

/* ── Mobile nav item ──────────────────────────────────────── */
function MobileItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#94A3B8] no-underline
        hover:bg-white/5 hover:text-white transition-colors duration-150"
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </Link>
  );
}
