"use client";

import { useState } from "react";

// Tab icons as inline SVG components
function IconUser()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconBldg()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconLock()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function IconBell()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function IconTrash() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconArrow() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>; }
function IconCheck() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>; }

const TABS = [
  { id: "personal",      label: "Personal Info",     Icon: IconUser,  description: "Name, email, phone" },
  { id: "agency",        label: "Agency Info",        Icon: IconBldg,  description: "Agency details" },
  { id: "password",      label: "Change Password",    Icon: IconLock,  description: "Update password" },
  { id: "notifications", label: "Notifications",      Icon: IconBell,  description: "Email & push alerts" },
  { id: "delete",        label: "Delete Account",     Icon: IconTrash, description: "Permanent action", danger: true },
];

const iCls = "w-full border border-[#E2E8F0] rounded-xl px-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white";

// Toggle component for notifications tab
function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#1E293B]">{label}</p>
        {desc && <p className="text-xs text-[#94A3B8] mt-[2px]">{desc}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0
          ${checked ? "bg-[#F59E0B]" : "bg-[#E2E8F0]"}`}>
        <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200
          ${checked ? "left-[26px]" : "left-[3px]"}`} />
      </button>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  // Personal form state
  const [personal, setPersonal] = useState({
    firstName: "Ahmed", lastName: "Khan",
    email: "ahmed.khan@dhaproperties.pk",
    phone: "+92 300 1234567",
    bio: "Senior Real Estate Consultant at DHA Properties with 5+ years of experience.",
    city: "Karachi",
  });
  const [personalSaved, setPersonalSaved] = useState(false);

  // Agency form state
  const [agency, setAgency] = useState({
    agencyName: "DHA Properties",
    licenseNo: "REA-2024-001",
    website: "www.dhaproperties.pk",
    address: "DHA Phase 6, Karachi",
    description: "Leading real estate agency in DHA Karachi.",
  });
  const [agencySaved, setAgencySaved] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  // Notification state
  const [notifs, setNotifs] = useState({
    emailInquiry:  true,
    emailListing:  true,
    emailMarketing:false,
    pushInquiry:   true,
    pushListings:  false,
    smsAlerts:     true,
  });

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteStep, setDeleteStep] = useState(1);

  function savePersonal(e) {
    e.preventDefault();
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 3000);
  }
  function saveAgency(e) {
    e.preventDefault();
    setAgencySaved(true);
    setTimeout(() => setAgencySaved(false), 3000);
  }
  function savePassword(e) {
    e.preventDefault();
    setPwError("");
    if (!pwForm.current)              { setPwError("Enter your current password"); return; }
    if (pwForm.newPw.length < 8)      { setPwError("New password must be at least 8 characters"); return; }
    if (pwForm.newPw !== pwForm.confirm){ setPwError("Passwords do not match"); return; }
    setPwSaved(true);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  }

  const activeTabObj = TABS.find(t => t.id === activeTab);

  return (
    <div>
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">Profile Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage your account and preferences</p>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT — tab list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-3">
            {TABS.map(tab => {
              const active  = activeTab === tab.id;
              const danger  = !!tab.danger;
              const bgCard  = active ? (danger ? "bg-red-50" : "bg-[#FFFBEB]") : "hover:bg-[#F8FAFC]";
              const iconBg  = active ? (danger ? "bg-red-100" : "bg-[#F59E0B]/10") : "bg-[#F8FAFC]";
              const iconClr = active ? (danger ? "text-red-500" : "text-[#F59E0B]") : "text-[#94A3B8]";
              const labelCl = active ? (danger ? "text-red-500" : "text-[#F59E0B]") : "text-[#1E293B]";
              const arrowCl = active ? (danger ? "text-red-400" : "text-[#F59E0B]") : "text-[#E2E8F0]";
              const { Icon } = tab;

              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left rounded-xl p-3 mb-1 transition-all duration-200 flex items-center gap-3 ${bgCard}`}>
                  <div className={`${iconBg} ${iconClr} rounded-lg p-2 shrink-0`}>
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${labelCl}`}>{tab.label}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{tab.description}</p>
                  </div>
                  <span className={`shrink-0 ${arrowCl}`}><IconArrow /></span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT — tab content */}
        <div className="lg:col-span-3">

          {/* Personal Info */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="text-base font-bold text-[#1E293B]">Personal Information</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Update your name, contact and bio</p>
              </div>

              {personalSaved && (
                <div className="mx-6 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                  <span className="text-base"><IconCheck /></span> Changes saved successfully!
                </div>
              )}

              <form onSubmit={savePersonal} className="px-6 py-6 flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0F172A] text-2xl font-extrabold select-none shrink-0">
                    {personal.firstName[0]}{personal.lastName[0]}
                  </div>
                  <div>
                    <button type="button" className="text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-[#94A3B8] mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">First Name</label>
                    <input type="text" value={personal.firstName}
                      onChange={e => setPersonal(p => ({ ...p, firstName: e.target.value }))}
                      className={iCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Last Name</label>
                    <input type="text" value={personal.lastName}
                      onChange={e => setPersonal(p => ({ ...p, lastName: e.target.value }))}
                      className={iCls} />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Email Address</label>
                    <input type="email" value={personal.email}
                      onChange={e => setPersonal(p => ({ ...p, email: e.target.value }))}
                      className={iCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Phone Number</label>
                    <input type="tel" value={personal.phone}
                      onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))}
                      className={iCls} />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">City</label>
                  <select value={personal.city} onChange={e => setPersonal(p => ({ ...p, city: e.target.value }))}
                    className={`${iCls} appearance-none cursor-pointer`}>
                    {["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar"].map(c =>
                      <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Bio</label>
                  <textarea rows={3} value={personal.bio}
                    onChange={e => setPersonal(p => ({ ...p, bio: e.target.value }))}
                    className={`${iCls} resize-none`} />
                  <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{personal.bio.length}/300</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit"
                    className="bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Agency Info */}
          {activeTab === "agency" && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="text-base font-bold text-[#1E293B]">Agency Information</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Update your agency details and license</p>
              </div>

              {agencySaved && (
                <div className="mx-6 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                  <IconCheck /> Agency info saved!
                </div>
              )}

              <form onSubmit={saveAgency} className="px-6 py-6 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Agency Name</label>
                    <input type="text" value={agency.agencyName}
                      onChange={e => setAgency(p => ({ ...p, agencyName: e.target.value }))}
                      className={iCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">License Number</label>
                    <input type="text" value={agency.licenseNo}
                      onChange={e => setAgency(p => ({ ...p, licenseNo: e.target.value }))}
                      className={iCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Website</label>
                    <input type="text" value={agency.website}
                      onChange={e => setAgency(p => ({ ...p, website: e.target.value }))}
                      className={iCls} placeholder="www.example.com" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Office Address</label>
                    <input type="text" value={agency.address}
                      onChange={e => setAgency(p => ({ ...p, address: e.target.value }))}
                      className={iCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">Agency Description</label>
                  <textarea rows={3} value={agency.description}
                    onChange={e => setAgency(p => ({ ...p, description: e.target.value }))}
                    className={`${iCls} resize-none`} />
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit"
                    className="bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors">
                    Save Agency Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password */}
          {activeTab === "password" && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="text-base font-bold text-[#1E293B]">Change Password</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Use a strong password of at least 8 characters</p>
              </div>

              {pwSaved && (
                <div className="mx-6 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                  <IconCheck /> Password updated successfully!
                </div>
              )}
              {pwError && (
                <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {pwError}
                </div>
              )}

              <form onSubmit={savePassword} className="px-6 py-6 flex flex-col gap-5">
                {[
                  { key: "current", label: "Current Password" },
                  { key: "newPw",   label: "New Password" },
                  { key: "confirm", label: "Confirm New Password" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">{label}</label>
                    <div className="relative">
                      <input type={showPw[key] ? "text" : "password"}
                        value={pwForm[key]}
                        onChange={e => { setPwError(""); setPwForm(p => ({ ...p, [key]: e.target.value })); }}
                        placeholder="••••••••"
                        className={`${iCls} pr-11`} />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors text-sm">
                        {showPw[key] ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button type="submit"
                    className="bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="text-base font-bold text-[#1E293B]">Notification Preferences</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Control which alerts you receive</p>
              </div>
              <div className="px-6 py-2">
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider py-3">Email Notifications</p>
                <Toggle checked={notifs.emailInquiry}   onChange={v => setNotifs(p => ({ ...p, emailInquiry: v }))}   label="New Inquiry Received"  desc="Email when a buyer sends an inquiry" />
                <Toggle checked={notifs.emailListing}   onChange={v => setNotifs(p => ({ ...p, emailListing: v }))}   label="Listing Status Update" desc="When your listing is approved or rejected" />
                <Toggle checked={notifs.emailMarketing} onChange={v => setNotifs(p => ({ ...p, emailMarketing: v }))} label="Marketing & Tips"       desc="PropFind tips and feature announcements" />
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider py-3 mt-2">Push Notifications</p>
                <Toggle checked={notifs.pushInquiry}  onChange={v => setNotifs(p => ({ ...p, pushInquiry: v }))}  label="Inquiry Alerts"    desc="Real-time alerts for new inquiries" />
                <Toggle checked={notifs.pushListings} onChange={v => setNotifs(p => ({ ...p, pushListings: v }))} label="Listing Updates"   desc="Updates on your listing performance" />
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider py-3 mt-2">SMS</p>
                <Toggle checked={notifs.smsAlerts} onChange={v => setNotifs(p => ({ ...p, smsAlerts: v }))} label="SMS Alerts" desc="Critical updates via text message" />
              </div>
              <div className="px-6 py-4 border-t border-[#F1F5F9] flex justify-end">
                <button className="bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-[10px] rounded-xl hover:bg-[#D97706] transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Delete Account */}
          {activeTab === "delete" && (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm">
              <div className="px-6 py-4 border-b border-red-100">
                <h2 className="text-base font-bold text-red-600">Delete Account</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">This action is permanent and cannot be undone</p>
              </div>
              <div className="px-6 py-6">
                {deleteStep === 1 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-4 bg-red-50 border border-red-100 rounded-xl p-4">
                      <span className="text-2xl shrink-0">&#9888;&#65039;</span>
                      <div>
                        <p className="text-sm font-bold text-red-700 mb-1">Before you delete your account</p>
                        <ul className="text-sm text-red-600 space-y-1">
                          <li>- All your listings will be permanently removed</li>
                          <li>- Your inquiry history will be deleted</li>
                          <li>- Your agent profile will no longer be visible</li>
                          <li>- This action cannot be reversed</li>
                        </ul>
                      </div>
                    </div>
                    <button onClick={() => setDeleteStep(2)}
                      className="w-full border-2 border-red-300 text-red-500 font-bold text-sm py-3 rounded-xl hover:bg-red-50 transition-colors">
                      I understand, continue to delete
                    </button>
                  </div>
                )}

                {deleteStep === 2 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">
                        Type <span className="text-red-500 font-bold">DELETE</span> to confirm
                      </label>
                      <input type="text" value={deleteConfirm}
                        onChange={e => setDeleteConfirm(e.target.value)}
                        placeholder="Type DELETE here"
                        className="w-full border border-red-300 rounded-xl px-4 py-[11px] text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { setDeleteStep(1); setDeleteConfirm(""); }}
                        className="flex-1 border border-[#E2E8F0] text-[#64748B] font-medium py-3 rounded-xl hover:bg-[#F8FAFC] transition-colors text-sm">
                        Cancel
                      </button>
                      <button
                        disabled={deleteConfirm !== "DELETE"}
                        className={`flex-1 font-bold py-3 rounded-xl text-sm transition-colors
                          ${deleteConfirm === "DELETE"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-red-100 text-red-300 cursor-not-allowed"}`}>
                        Permanently Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
