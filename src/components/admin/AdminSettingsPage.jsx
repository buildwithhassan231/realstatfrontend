"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { 
  getSettings, 
  updateGeneralSettings, 
  updatePlatformSettings, 
  updateListingSettings, 
  updateAdminProfile, 
  changeAdminPassword 
} from "@/services/adminSettings.service";

/* ── Shared styles ───────────────────────────────────────── */
const INPUT = "w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#1E293B] outline-none transition-all placeholder:text-[#CBD5E1] bg-white focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20";
const INPUT_E = "w-full border border-red-400 rounded-xl px-4 py-3 text-sm text-[#1E293B] outline-none transition-all placeholder:text-[#CBD5E1] bg-white focus:ring-2 focus:ring-red-200";
const LABEL = "block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]";
const ERR = "text-[11px] text-red-500 mt-1 flex items-center gap-1";

/* ── Field wrapper ───────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
      {error && <p className={ERR}><span>⚠</span>{error}</p>}
    </div>
  );
}

/* ── Toggle switch ───────────────────────────────────────── */
function Toggle({ on, onChange, label, description, danger }) {
  return (
    <div className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-200
      ${on && danger ? "bg-red-50 border-red-200" : on ? "bg-emerald-50 border-emerald-200" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${danger && on ? "text-red-800" : "text-[#0F172A]"}`}>{label}</p>
        {description && (
          <p className={`text-xs mt-[2px] leading-relaxed ${danger && on ? "text-red-600" : "text-[#64748B]"}`}>
            {description}
          </p>
        )}
      </div>
      <button onClick={() => onChange(!on)}
        className={`relative inline-flex h-6 w-11 shrink-0 mt-[2px] items-center rounded-full transition-colors duration-200
          ${on ? (danger ? "bg-red-500" : "bg-[#0F6E56]") : "bg-[#CBD5E1]"}`}>
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
          ${on ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

/* ── Section card ────────────────────────────────────────── */
function Section({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9]">
        <span className="w-9 h-9 rounded-xl bg-[#F59E0B] text-[#0F172A] font-extrabold flex items-center justify-center shrink-0 text-base">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">{title}</h2>
          {subtitle && <p className="text-xs text-[#94A3B8] mt-[1px]">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

/* ── Save footer row ─────────────────────────────────────── */
function SaveRow({ onSave, label = "Save Changes", loading }) {
  return (
    <div className="flex justify-end pt-4 border-t border-[#F1F5F9] mt-2">
      <button onClick={onSave} disabled={loading}
        className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-70 text-[#0F172A] text-sm font-bold px-6 py-[10px] rounded-xl transition-colors">
        {loading ? "⏳ Saving..." : `💾 ${label}`}
      </button>
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold
      ${type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      {message}
      <button onClick={onClose} className="ml-2 text-[#94A3B8] hover:text-[#475569] text-xs">✕</button>
    </div>
  );
}

/* ── Password strength bar ───────────────────────────────── */
function StrengthBar({ score }) {
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];
  return score > 0 ? (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300
            ${i <= score ? colors[score] : "bg-[#E2E8F0]"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${colors[score].replace("bg-","text-")}`}>
        {labels[score]}
      </p>
    </div>
  ) : null;
}

/* ── Password field ──────────────────────────────────────── */
function PwdField({ label, value, onChange, show, onToggleShow, error, hint }) {
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`${error ? INPUT_E : INPUT} pr-11`}
        />
        <button type="button" onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors text-sm">
          {show ? "🙈" : "👁️"}
        </button>
      </div>
      {hint && !error && <p className="text-[11px] text-[#94A3B8] mt-1">{hint}</p>}
    </Field>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function AdminSettingsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab,     setActiveTab]     = useState("general");
  const [toast,         setToast]         = useState(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isSaving,      setIsSaving]      = useState(false);

  /* ── General ── */
  const [siteName,      setSiteName]      = useState("PropFind");
  const [siteTagline,   setSiteTagline]   = useState("Pakistan's #1 Property Platform");
  const [contactEmail,  setContactEmail]  = useState("admin@propfind.pk");
  const [supportPhone,  setSupportPhone]  = useState("+92 300 0001111");
  const [siteUrl,       setSiteUrl]       = useState("https://propfind.pk");
  const [generalErrs,   setGeneralErrs]   = useState({});

  /* ── Platform toggles ── */
  const [maintenance,        setMaintenance]        = useState(false);
  const [registrations,      setRegistrations]      = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApprove,        setAutoApprove]        = useState(false);

  /* ── Listing limits ── */
  const [featuredLimit,   setFeaturedLimit]   = useState(10);
  const [listingsPerPage, setListingsPerPage] = useState(12);
  const [maxImages,       setMaxImages]       = useState(10);
  const [limitErrs,       setLimitErrs]       = useState({});

  /* ── Admin profile ── */
  const [adminName,    setAdminName]    = useState("Hassan Ali");
  const [adminEmail,   setAdminEmail]   = useState("hassan.ali@propfind.pk");
  const [adminPhone,   setAdminPhone]   = useState("+92 333 0001111");
  const [adminBio,     setAdminBio]     = useState("Platform administrator for PropFind.");
  const [profileErrs,  setProfileErrs]  = useState({});

  /* ── Password ── */
  const [curPwd,      setCurPwd]      = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [conPwd,      setConPwd]      = useState("");
  const [showPwd,     setShowPwd]     = useState({ cur: false, nw: false, con: false });
  const [pwdStrength, setPwdStrength] = useState(0);
  const [pwdErrs,     setPwdErrs]     = useState({});

  /* ── Toast helper ── */
  function showToast(msg, type = "success") {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Password strength ── */
  function calcStrength(p) {
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  }

  /* ── Validators ── */
  function validateGeneral() {
    const e = {};
    if (!siteName.trim()) e.siteName = "Site name is required.";
    if (!contactEmail.trim()) e.contactEmail = "Contact email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) e.contactEmail = "Enter a valid email.";
    if (siteUrl && !/^https?:\/\/.+/.test(siteUrl)) e.siteUrl = "Enter a valid URL starting with http(s)://";
    return e;
  }

  function validateLimits() {
    const e = {};
    if (!featuredLimit || featuredLimit < 1 || featuredLimit > 100)
      e.featuredLimit = "Must be between 1 and 100.";
    if (!listingsPerPage || listingsPerPage < 6 || listingsPerPage > 48)
      e.listingsPerPage = "Must be between 6 and 48.";
    if (!maxImages || maxImages < 1 || maxImages > 30)
      e.maxImages = "Must be between 1 and 30.";
    return e;
  }

  function validateProfile() {
    const e = {};
    if (!adminName.trim()) e.adminName = "Name is required.";
    if (!adminEmail.trim()) e.adminEmail = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) e.adminEmail = "Enter a valid email.";
    return e;
  }

  function validatePassword() {
    const e = {};
    if (!curPwd) e.curPwd = "Enter your current password.";
    if (!newPwd) e.newPwd = "Enter a new password.";
    else if (newPwd.length < 8) e.newPwd = "At least 8 characters required.";
    else if (calcStrength(newPwd) < 2) e.newPwd = "Too weak — add uppercase, numbers or symbols.";
    if (!conPwd) e.conPwd = "Confirm your new password.";
    else if (newPwd !== conPwd) e.conPwd = "Passwords do not match.";
    return e;
  }

  /* ── Initial Load ── */
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await getSettings();
        // Extract the actual settings object (handling cases where backend wraps it in { success: true, data: {...} })
        const data = response?.data || response || {};
        
        // fill states
        setSiteName(data.siteName || "");
        setSiteUrl(data.siteUrl || "");
        setSiteTagline(data.siteTagline || "");
        setContactEmail(data.contactEmail || "");
        setSupportPhone(data.supportPhone || "");

        setMaintenance(!!data.maintenance);
        setRegistrations(data.registrations !== false); // default true
        setEmailNotifications(data.emailNotifications !== false); // default true
        setAutoApprove(!!data.autoApprove);

        setFeaturedLimit(data.featuredLimit || 10);
        setListingsPerPage(data.listingsPerPage || 12);
        setMaxImages(data.maxImages || 10);

        setAdminName(data.adminName || "");
        setAdminEmail(data.adminEmail || "");
        setAdminPhone(data.adminPhone || "");
        setAdminBio(data.adminBio || "");
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  /* ── Save handlers ── */
  async function saveGeneral()  { 
    const e = validateGeneral();  
    setGeneralErrs(e); 
    if (!Object.keys(e).length) {
      try {
        setIsSaving(true);
        await updateGeneralSettings({ siteName, siteUrl, siteTagline, contactEmail, supportPhone });
        showToast("General settings saved.");
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setIsSaving(false);
      }
    } 
  }

  async function savePlatform() {
    try {
      setIsSaving(true);
      await updatePlatformSettings({ maintenance, registrations, emailNotifications, autoApprove });
      showToast("Platform settings saved.");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveLimits()   { 
    const e = validateLimits();   
    setLimitErrs(e);   
    if (!Object.keys(e).length) {
      try {
        setIsSaving(true);
        await updateListingSettings({ featuredLimit, listingsPerPage, maxImages });
        showToast("Listing settings saved.");
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setIsSaving(false);
      }
    } 
  }

  async function saveProfile()  { 
    const e = validateProfile();  
    setProfileErrs(e); 
    if (!Object.keys(e).length) {
      try {
        setIsSaving(true);
        await updateAdminProfile({ adminName, adminEmail, adminPhone, adminBio });
        showToast("Admin profile updated.");
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setIsSaving(false);
      }
    } 
  }

  async function savePassword() {
    const e = validatePassword();
    setPwdErrs(e);
    if (!Object.keys(e).length) {
      try {
        setIsSaving(true);
        await changeAdminPassword({ curPwd, newPwd, conPwd });
        setCurPwd(""); setNewPwd(""); setConPwd(""); setPwdStrength(0);
        showToast("Password changed successfully.");
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setIsSaving(false);
      }
    }
  }

  const TABS = [
    { id: "general",  label: "General",      icon: "⚙️" },
    { id: "platform", label: "Platform",      icon: "🔧" },
    { id: "listings", label: "Listings",      icon: "🏠" },
    { id: "profile",  label: "Admin Profile", icon: "👤" },
    { id: "password", label: "Password",      icon: "🔒" },
  ];

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
        {/* ── Topbar ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569]">☰</button>
            <div>
              <h1 className="text-lg font-extrabold text-[#0F172A]">Settings</h1>
              <p className="text-xs text-[#94A3B8]">Manage platform configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {maintenance && (
              <span className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-[6px]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-700">Maintenance ON</span>
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-extrabold text-[#0F172A] select-none">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-6 max-w-3xl w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-8 h-8 rounded-full border-4 border-[#E2E8F0] border-t-[#F59E0B] animate-spin"></span>
            </div>
          ) : (
            <>
          {/* ── Tabs ── */}
          <div className="flex flex-wrap gap-2">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-[9px] rounded-xl text-sm font-semibold transition-all duration-150
                  ${activeTab === t.id
                    ? "bg-[#F59E0B] text-[#0F172A] shadow-sm"
                    : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#F59E0B] hover:text-[#0F172A]"}`}>
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ════════════════════════════════════════════
              TAB: GENERAL
          ════════════════════════════════════════════ */}
          {activeTab === "general" && (
            <Section icon="⚙️" title="General Settings" subtitle="Basic platform identity and contact information">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Site Name *" error={generalErrs.siteName}>
                    <input value={siteName} onChange={e => { setSiteName(e.target.value); setGeneralErrs(p => ({...p, siteName:""})); }}
                      placeholder="PropFind" className={generalErrs.siteName ? INPUT_E : INPUT} />
                  </Field>
                  <Field label="Site URL" error={generalErrs.siteUrl}>
                    <input value={siteUrl} onChange={e => { setSiteUrl(e.target.value); setGeneralErrs(p => ({...p, siteUrl:""})); }}
                      placeholder="https://propfind.pk" className={generalErrs.siteUrl ? INPUT_E : INPUT} />
                  </Field>
                </div>
                <Field label="Site Tagline">
                  <input value={siteTagline} onChange={e => setSiteTagline(e.target.value)}
                    placeholder="Pakistan's #1 Property Platform" className={INPUT} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Contact Email *" error={generalErrs.contactEmail}>
                    <input type="email" value={contactEmail}
                      onChange={e => { setContactEmail(e.target.value); setGeneralErrs(p => ({...p, contactEmail:""})); }}
                      placeholder="admin@propfind.pk" className={generalErrs.contactEmail ? INPUT_E : INPUT} />
                  </Field>
                  <Field label="Support Phone">
                    <input value={supportPhone} onChange={e => setSupportPhone(e.target.value)}
                      placeholder="+92 300 0001111" className={INPUT} />
                  </Field>
                </div>
                <SaveRow onSave={saveGeneral} loading={isSaving} />
              </div>
            </Section>
          )}

          {/* ════════════════════════════════════════════
              TAB: PLATFORM
          ════════════════════════════════════════════ */}
          {activeTab === "platform" && (
            <Section icon="🔧" title="Platform Controls" subtitle="Control site-wide behaviour and access">
              <div className="flex flex-col gap-4">
                <Toggle
                  on={maintenance} onChange={setMaintenance}
                  label="Maintenance Mode"
                  description="When ON, the public site shows a maintenance page. Admin panel stays accessible."
                  danger
                />
                <Toggle
                  on={registrations} onChange={setRegistrations}
                  label="Allow New Registrations"
                  description="When OFF, new users cannot sign up. Existing users can still log in."
                />
                <Toggle
                  on={emailNotifications} onChange={setEmailNotifications}
                  label="Email Notifications"
                  description="Send automated emails for new inquiries, approvals and registrations."
                />
                <Toggle
                  on={autoApprove} onChange={setAutoApprove}
                  label="Auto-Approve Listings"
                  description="When ON, agent listings go live immediately without manual admin review."
                />

                {/* Status summary */}
                <div className="mt-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Current Status</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Site Status",    value: maintenance   ? "Under Maintenance" : "Live",          on: !maintenance },
                      { label: "Registrations",  value: registrations ? "Open"              : "Closed",        on: registrations },
                      { label: "Notifications",  value: emailNotifications ? "Enabled"      : "Disabled",      on: emailNotifications },
                      { label: "Listing Review", value: autoApprove   ? "Auto-Approved"     : "Manual Review", on: !autoApprove },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${s.on ? "bg-emerald-500" : "bg-red-400"}`} />
                        <span className="text-xs text-[#64748B]">{s.label}:</span>
                        <span className={`text-xs font-bold ${s.on ? "text-emerald-700" : "text-red-600"}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#F1F5F9] mt-2">
                  <button onClick={savePlatform} disabled={isSaving}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-70 text-[#0F172A] text-sm font-bold px-6 py-[10px] rounded-xl transition-colors">
                    {isSaving ? "⏳ Saving..." : "💾 Save Settings"}
                  </button>
                </div>
              </div>
            </Section>
          )}

          {/* ════════════════════════════════════════════
              TAB: LISTINGS
          ════════════════════════════════════════════ */}
          {activeTab === "listings" && (
            <Section icon="🏠" title="Listing Settings" subtitle="Control listing limits and display options">
              <div className="flex flex-col gap-5">
                {/* Featured limit */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-sm font-bold text-amber-900">Featured Listings Limit</p>
                      <p className="text-xs text-amber-700 mt-[2px]">
                        Maximum number of properties that can be marked as "Featured" on the platform at one time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setFeaturedLimit(v => Math.max(1, v - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-700 font-extrabold text-lg hover:bg-amber-100 transition-colors flex items-center justify-center">
                      −
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-4xl font-extrabold text-amber-900">{featuredLimit}</span>
                      <p className="text-xs text-amber-600 mt-1">max featured listings</p>
                    </div>
                    <button onClick={() => setFeaturedLimit(v => Math.min(100, v + 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-700 font-extrabold text-lg hover:bg-amber-100 transition-colors flex items-center justify-center">
                      +
                    </button>
                  </div>
                  <input type="range" min={1} max={100} value={featuredLimit}
                    onChange={e => setFeaturedLimit(Number(e.target.value))}
                    className="w-full mt-4 accent-[#F59E0B]" />
                  <div className="flex justify-between text-[10px] text-amber-600 mt-1">
                    <span>1 min</span><span>100 max</span>
                  </div>
                  {limitErrs.featuredLimit && <p className={ERR}><span>⚠</span>{limitErrs.featuredLimit}</p>}
                </div>

                {/* Grid of other limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Listings Per Page" error={limitErrs.listingsPerPage}>
                    <div className="relative">
                      <input type="number" min={6} max={48} value={listingsPerPage}
                        onChange={e => { setListingsPerPage(Number(e.target.value)); setLimitErrs(p => ({...p, listingsPerPage:""})); }}
                        className={limitErrs.listingsPerPage ? INPUT_E : INPUT} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">/ page</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1">Between 6 and 48</p>
                  </Field>
                  <Field label="Max Images Per Listing" error={limitErrs.maxImages}>
                    <div className="relative">
                      <input type="number" min={1} max={30} value={maxImages}
                        onChange={e => { setMaxImages(Number(e.target.value)); setLimitErrs(p => ({...p, maxImages:""})); }}
                        className={limitErrs.maxImages ? INPUT_E : INPUT} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">images</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1">Between 1 and 30</p>
                  </Field>
                </div>

                <SaveRow onSave={saveLimits} loading={isSaving} />
              </div>
            </Section>
          )}

          {/* ════════════════════════════════════════════
              TAB: ADMIN PROFILE
          ════════════════════════════════════════════ */}
          {activeTab === "profile" && (
            <Section icon="👤" title="Admin Profile" subtitle="Update your admin account information">
              <div className="flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-5 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-2xl font-extrabold text-[#0F172A] select-none shrink-0">
                    {adminName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{adminName || "Admin Name"}</p>
                    <p className="text-xs text-[#64748B] mt-[2px]">{adminEmail}</p>
                    <span className="inline-block mt-1 bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-bold px-2 py-[1px] rounded-full">
                      Super Admin
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name *" error={profileErrs.adminName}>
                    <input value={adminName}
                      onChange={e => { setAdminName(e.target.value); setProfileErrs(p => ({...p, adminName:""})); }}
                      placeholder="Hassan Ali"
                      className={profileErrs.adminName ? INPUT_E : INPUT} />
                  </Field>
                  <Field label="Email Address *" error={profileErrs.adminEmail}>
                    <input type="email" value={adminEmail}
                      onChange={e => { setAdminEmail(e.target.value); setProfileErrs(p => ({...p, adminEmail:""})); }}
                      placeholder="admin@propfind.pk"
                      className={profileErrs.adminEmail ? INPUT_E : INPUT} />
                  </Field>
                </div>
                <Field label="Phone Number">
                  <input value={adminPhone} onChange={e => setAdminPhone(e.target.value)}
                    placeholder="+92 333 0001111" className={INPUT} />
                </Field>
                <Field label="Short Bio">
                  <textarea value={adminBio} onChange={e => setAdminBio(e.target.value)}
                    rows={3} placeholder="A short description about the admin..."
                    className={`${INPUT} resize-none`} />
                </Field>
                <SaveRow onSave={saveProfile} label="Update Profile" loading={isSaving} />
              </div>
            </Section>
          )}

          {/* ════════════════════════════════════════════
              TAB: PASSWORD
          ════════════════════════════════════════════ */}
          {activeTab === "password" && (
            <Section icon="🔒" title="Change Password" subtitle="Keep your account secure with a strong password">
              <div className="flex flex-col gap-5">
                {/* Requirements checklist */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-700 mb-2">Password Requirements</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { rule: "At least 8 characters",   check: newPwd.length >= 8       },
                      { rule: "One uppercase letter",     check: /[A-Z]/.test(newPwd)    },
                      { rule: "One number",               check: /[0-9]/.test(newPwd)    },
                      { rule: "One special character",    check: /[^A-Za-z0-9]/.test(newPwd) },
                    ].map(r => (
                      <div key={r.rule} className="flex items-center gap-2">
                        <span className={`text-sm ${newPwd ? (r.check ? "text-emerald-500" : "text-red-400") : "text-[#CBD5E1]"}`}>
                          {newPwd && r.check ? "✓" : "○"}
                        </span>
                        <span className={`text-xs ${newPwd && r.check ? "text-emerald-700" : "text-blue-600"}`}>{r.rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <PwdField
                  label="Current Password *"
                  value={curPwd}
                  onChange={e => { setCurPwd(e.target.value); setPwdErrs(p => ({...p, curPwd:""})); }}
                  show={showPwd.cur}
                  onToggleShow={() => setShowPwd(p => ({...p, cur: !p.cur}))}
                  error={pwdErrs.curPwd}
                />
                <div>
                  <PwdField
                    label="New Password *"
                    value={newPwd}
                    onChange={e => {
                      setNewPwd(e.target.value);
                      setPwdStrength(calcStrength(e.target.value));
                      setPwdErrs(p => ({...p, newPwd:""}));
                    }}
                    show={showPwd.nw}
                    onToggleShow={() => setShowPwd(p => ({...p, nw: !p.nw}))}
                    error={pwdErrs.newPwd}
                  />
                  <StrengthBar score={pwdStrength} />
                </div>
                <PwdField
                  label="Confirm New Password *"
                  value={conPwd}
                  onChange={e => { setConPwd(e.target.value); setPwdErrs(p => ({...p, conPwd:""})); }}
                  show={showPwd.con}
                  onToggleShow={() => setShowPwd(p => ({...p, con: !p.con}))}
                  error={pwdErrs.conPwd}
                  hint={conPwd && conPwd === newPwd ? "✓ Passwords match" : ""}
                />

                <SaveRow onSave={savePassword} label="Change Password" loading={isSaving} />
              </div>
            </Section>
          )}

            </>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
