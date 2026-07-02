"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Inline SVG icons (no react-icons dependency)
const Ico = {
  back:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>,
  ext:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  trash:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  save:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  home:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  bldg:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  pin:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  img:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  star:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  cloud:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>,
  spin:    () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>,
  x:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const PROPERTY_TYPES = [
  { label: "House",      emoji: "🏡" },
  { label: "Apartment",  emoji: "🏢" },
  { label: "Villa",      emoji: "🏖️" },
  { label: "Plot",       emoji: "🏗️" },
  { label: "Commercial", emoji: "🏪" },
];
const STATUSES   = ["Available", "Pending", "Sold", "Rented"];
const CITIES     = ["Karachi","Lahore","Islamabad","Rawalpindi","Peshawar","Quetta","Multan","Other"];
const AMENITIES  = ["Parking","Swimming Pool","Gym","Generator","Security Guard","Central AC","Garden","Elevator","Servant Quarters","Rooftop Access","Solar Panel","Gas Pipeline"];

const sampleProperties = {
  "1": { id:"1", title:"Modern 5-Bed House in DHA Phase 6", description:"Spacious corner house with all modern amenities in the heart of DHA Phase 6. Features a large lawn, double garage and servant quarters.", type:"House", listingType:"Sale", price:"25000000", city:"Karachi", country:"Pakistan", area:"DHA Phase 6", address:"Plot 42, Street 5, DHA Phase 6, Karachi", lat:"24.8073", lng:"67.0311", bedrooms:5, bathrooms:4, areaSqft:500, status:"Available", isFeatured:true, amenities:["Parking","Garden","Security Guard","Generator"], images:[] },
  "2": { id:"2", title:"Luxury Apartment Clifton Block 4", description:"Premium 3-bedroom apartment with sea views on the 14th floor of an elite residential tower in Clifton.", type:"Apartment", listingType:"Rent", price:"85000", city:"Karachi", country:"Pakistan", area:"Clifton Block 4", address:"Clifton Block 4, Karachi", lat:"24.8138", lng:"67.0280", bedrooms:3, bathrooms:2, areaSqft:1800, status:"Rented", isFeatured:false, amenities:["Parking","Swimming Pool","Gym","Central AC","Elevator"], images:[] },
  "3": { id:"3", title:"Premium Villa with Pool — Bahria Town", description:"Stunning 5-bedroom villa with private swimming pool and landscaped garden in one of Lahore's most prestigious societies.", type:"Villa", listingType:"Sale", price:"35000000", city:"Lahore", country:"Pakistan", area:"Bahria Town", address:"Sector B, Bahria Town, Lahore", lat:"31.3742", lng:"74.1484", bedrooms:5, bathrooms:4, areaSqft:700, status:"Available", isFeatured:true, amenities:["Parking","Swimming Pool","Gym","Garden","Generator","Solar Panel"], images:[] },
};

// Input class constant
const iCls = "w-full border border-[#E2E8F0] rounded-xl px-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all bg-white placeholder:text-[#CBD5E1]";

// Section heading component
function SectionHead({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-6 rounded-full bg-[#F59E0B] shrink-0" />
      <span className="text-[#F59E0B]"><Icon /></span>
      <h2 className="text-base font-bold text-[#1E293B]">{title}</h2>
    </div>
  );
}

// Counter input
function Counter({ value, onChange, min = 0 }) {
  return (
    <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-11 flex items-center justify-center text-[#64748B] hover:bg-[#FFFBEB] hover:text-[#F59E0B] transition-colors text-lg font-bold border-r border-[#E2E8F0]">-</button>
      <span className="flex-1 text-center text-sm font-bold text-[#1E293B]">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="w-10 h-11 flex items-center justify-center text-[#64748B] hover:bg-[#FFFBEB] hover:text-[#F59E0B] transition-colors text-lg font-bold border-l border-[#E2E8F0]">+</button>
    </div>
  );
}

// Field label wrapper
function FL({ label, optional, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]">
        {label}
        {optional && <span className="normal-case text-[#CBD5E1] font-normal">optional</span>}
      </label>
      {children}
    </div>
  );
}

export default function EditPropertyPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const fileRef   = useRef(null);

  const [formData,      setFormData]      = useState(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isSaving,      setIsSaving]      = useState(false);
  const [showSuccess,   setShowSuccess]   = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [deleteOpen,    setDeleteOpen]    = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const prop = sampleProperties[id];
      if (!prop) { router.replace("/dashboard/listings"); return; }
      setFormData({ ...prop });
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, router]);

  function updateField(field, value) {
    setFormData(p => ({ ...p, [field]: value }));
  }
  function toggleAmenity(amenity) {
    setFormData(p => ({
      ...p,
      amenities: p.amenities.includes(amenity)
        ? p.amenities.filter(a => a !== amenity)
        : [...p.amenities, amenity],
    }));
  }
  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  }
  function handleDelete() {
    router.push("/dashboard/listings");
  }
  function handleFileChange(e) {
    const files = Array.from(e.target.files).slice(0, 8 - previewImages.length);
    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), name: f.name, id: Math.random().toString(36).slice(2) }));
    setPreviewImages(p => [...p, ...newPreviews].slice(0, 8));
  }
  function removeImage(imgId) {
    setPreviewImages(p => p.filter(i => i.id !== imgId));
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#E2E8F0] border-t-[#F59E0B] rounded-full animate-spin" />
        <p className="text-sm text-[#94A3B8] font-medium">Loading property...</p>
      </div>
    );
  }

  if (!formData) return null;

  const allImages = [...formData.images, ...previewImages];

  return (
    <div className="flex flex-col gap-0 pb-24">

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl px-5 py-4 animate-in slide-in-from-right">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1E293B]">Changes Saved!</p>
            <p className="text-xs text-[#94A3B8]">Property updated successfully</p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <Ico.back />
          <Link href="/dashboard/listings" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors no-underline">My Listings</Link>
          <span className="text-[#E2E8F0]">/</span>
          <span className="font-bold text-[#1E293B]">Edit Property</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/properties/${id}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold px-4 py-[9px] rounded-xl hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all no-underline">
            <Ico.ext /> View Live
          </a>
          <button onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 border border-red-200 text-red-500 text-sm font-semibold px-4 py-[9px] rounded-xl hover:bg-red-50 transition-all">
            <Ico.trash /> Delete
          </button>
          <button onClick={handleSave} disabled={isSaving}
            className={`flex items-center gap-2 text-sm font-bold px-5 py-[9px] rounded-xl transition-all
              ${isSaving ? "bg-[#FCD34D] text-[#92400E] cursor-not-allowed" : "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706]"}`}>
            {isSaving ? <><Ico.spin /> Saving...</> : <><Ico.save /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* SECTION A — Basic Info */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 mb-5">
        <SectionHead icon={Ico.home} title="Basic Information" />

        {/* Listing type toggle */}
        <div className="mb-5">
          <FL label="Listing Type">
            <div className="flex gap-3">
              {["Sale","Rent"].map(lt => (
                <button key={lt} type="button" onClick={() => updateField("listingType", lt)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200
                    ${formData.listingType === lt
                      ? lt === "Sale" ? "bg-[#F59E0B] border-[#F59E0B] text-[#0F172A]" : "bg-[#0F172A] border-[#0F172A] text-white"
                      : "bg-white border-[#E2E8F0] text-[#94A3B8] hover:border-[#F59E0B]"}`}>
                  {lt === "Sale" ? "For Sale" : "For Rent"}
                </button>
              ))}
            </div>
          </FL>
        </div>

        {/* Property type */}
        <div className="mb-5">
          <FL label="Property Type">
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map(({ label, emoji }) => (
                <button key={label} type="button" onClick={() => updateField("type", label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200
                    ${formData.type === label
                      ? "border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]"
                      : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#F59E0B]"}`}>
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </FL>
        </div>

        {/* Title */}
        <div className="mb-5">
          <FL label="Property Title">
            <input type="text" value={formData.title} onChange={e => updateField("title", e.target.value)}
              placeholder="e.g. Modern 5-Bed House in DHA Phase 6" className={iCls} />
          </FL>
        </div>

        {/* Price + Status */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <FL label="Price (PKR)">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8] pointer-events-none select-none">PKR</span>
              <input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)}
                className={`${iCls} pl-14`} />
              {formData.listingType === "Rent" && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] pointer-events-none">/month</span>
              )}
            </div>
          </FL>
          <FL label="Status">
            <select value={formData.status} onChange={e => updateField("status", e.target.value)}
              className={`${iCls} appearance-none cursor-pointer`}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </FL>
        </div>

        {/* Description */}
        <div className="mb-5">
          <FL label="Description">
            <div className="relative">
              <div className="absolute top-3 right-4 text-[11px] text-[#94A3B8] pointer-events-none">
                {formData.description.length}/1000
              </div>
              <textarea rows={5} value={formData.description}
                onChange={e => { if (e.target.value.length <= 1000) updateField("description", e.target.value); }}
                placeholder="Describe the property..."
                className={`${iCls} resize-none pt-3 pr-14`} />
            </div>
          </FL>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-[#F59E0B]"><Ico.star /></span>
            <div>
              <p className="text-sm font-semibold text-[#1E293B]">Featured Listing</p>
              <p className="text-xs text-[#94A3B8] mt-[2px]">Requires admin approval</p>
            </div>
          </div>
          <button type="button" onClick={() => updateField("isFeatured", !formData.isFeatured)}
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0
              ${formData.isFeatured ? "bg-[#F59E0B]" : "bg-[#E2E8F0]"}`}>
            <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200
              ${formData.isFeatured ? "left-[26px]" : "left-[3px]"}`} />
          </button>
        </div>
      </div>

      {/* SECTION B — Property Details */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 mb-5">
        <SectionHead icon={Ico.bldg} title="Property Details" />

        {/* Bedrooms + Bathrooms + Area */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FL label="Bedrooms">
            <Counter value={formData.bedrooms} onChange={v => updateField("bedrooms", v)} />
          </FL>
          <FL label="Bathrooms">
            <Counter value={formData.bathrooms} onChange={v => updateField("bathrooms", v)} />
          </FL>
          <FL label="Area (sqft)">
            <input type="number" value={formData.areaSqft} onChange={e => updateField("areaSqft", e.target.value)}
              placeholder="e.g. 240" className={iCls} />
          </FL>
        </div>

        {/* Amenities */}
        <FL label="Amenities">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {AMENITIES.map(a => {
              const on = formData.amenities.includes(a);
              return (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-2 px-3 py-[10px] rounded-xl border-2 text-xs font-medium transition-all duration-150 text-left
                    ${on ? "border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]" : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#F59E0B]/50"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                    ${on ? "bg-[#F59E0B] border-[#F59E0B] text-white" : "border-[#CBD5E1]"}`}>
                    {on && <Ico.check />}
                  </span>
                  {a}
                </button>
              );
            })}
          </div>
        </FL>
      </div>

      {/* SECTION C — Location */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 mb-5">
        <SectionHead icon={Ico.pin} title="Location Details" />

        <div className="flex flex-col gap-4">
          <FL label="Full Address">
            <input type="text" value={formData.address} onChange={e => updateField("address", e.target.value)}
              placeholder="e.g. Plot 42, Street 5, DHA Phase 6" className={iCls} />
          </FL>

          <div className="grid grid-cols-2 gap-4">
            <FL label="City">
              <select value={formData.city} onChange={e => updateField("city", e.target.value)}
                className={`${iCls} appearance-none cursor-pointer`}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FL>
            <FL label="Area / Society">
              <input type="text" value={formData.area} onChange={e => updateField("area", e.target.value)}
                placeholder="e.g. DHA Phase 6" className={iCls} />
            </FL>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FL label="Country">
              <input type="text" value={formData.country} onChange={e => updateField("country", e.target.value)}
                className={iCls} />
            </FL>
            <div />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FL label="Latitude" optional>
              <input type="number" step="any" value={formData.lat} onChange={e => updateField("lat", e.target.value)}
                placeholder="e.g. 24.8607" className={iCls} />
            </FL>
            <FL label="Longitude" optional>
              <input type="number" step="any" value={formData.lng} onChange={e => updateField("lng", e.target.value)}
                placeholder="e.g. 67.0011" className={iCls} />
            </FL>
          </div>

          {/* Map placeholder */}
          <div className="w-full h-[180px] rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage:"linear-gradient(#94A3B8 1px,transparent 1px),linear-gradient(90deg,#94A3B8 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
            <span className="relative z-10 text-4xl text-[#CBD5E1]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <p className="relative z-10 text-xs font-semibold text-[#94A3B8]">Map preview</p>
            <p className="relative z-10 text-[11px] text-[#CBD5E1]">Add coordinates above to see location</p>
          </div>
        </div>
      </div>

      {/* SECTION D — Images */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 mb-5">
        <SectionHead icon={Ico.img} title="Property Images" />

        {/* Existing / preview images */}
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Current Images</p>
        {allImages.length === 0 ? (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center">
                <Ico.img />
              </div>
            ))}
            <p className="col-span-4 text-center text-xs text-[#94A3B8] mt-1">No images uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {allImages.map((img, idx) => (
              <div key={img.id || idx} className="aspect-square rounded-xl overflow-hidden relative group border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center">
                {img.url
                  ? <img src={img.url} alt="" className="w-full h-full object-cover" />
                  : <Ico.img />}
                {idx === 0 && (
                  <span className="absolute top-2 left-2 bg-[#F59E0B] text-[#0F172A] text-[9px] font-extrabold px-[6px] py-[2px] rounded-md">Cover</span>
                )}
                {img.id && (
                  <button onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Ico.x />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload zone */}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={handleFileChange} />
        <button type="button" onClick={() => fileRef.current?.click()}
          disabled={allImages.length >= 8}
          className={`w-full border-2 border-dashed rounded-2xl py-8 flex flex-col items-center gap-2 transition-all duration-200
            ${allImages.length >= 8
              ? "border-[#E2E8F0] bg-[#F8FAFC] opacity-50 cursor-not-allowed"
              : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#F59E0B] hover:bg-[#FFFBEB] cursor-pointer"}`}>
          <span className="text-[#94A3B8]"><Ico.cloud /></span>
          <p className="text-sm font-bold text-[#1E293B]">Click to upload images</p>
          <p className="text-xs text-[#94A3B8]">or drag and drop</p>
          <p className="text-[11px] text-[#CBD5E1]">JPG, PNG, WEBP — Max 5MB each</p>
          <p className="text-[11px] text-[#CBD5E1]">Maximum 8 images ({allImages.length}/8 uploaded)</p>
        </button>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-white border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-20">
        <p className="text-xs text-[#94A3B8]">Last saved: Just now</p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/listings"
            className="border border-[#E2E8F0] text-[#64748B] font-medium text-sm px-5 py-[9px] rounded-xl hover:bg-[#F8FAFC] transition-colors no-underline">
            Cancel
          </Link>
          <button onClick={handleSave} disabled={isSaving}
            className={`flex items-center gap-2 text-sm font-bold px-6 py-[9px] rounded-xl transition-all
              ${isSaving ? "bg-[#FCD34D] text-[#92400E] cursor-not-allowed" : "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706]"}`}>
            {isSaving ? <><Ico.spin /> Saving...</> : <><Ico.save /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-500 text-2xl"><Ico.trash /></span>
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] text-center">Delete Property?</h3>
            <p className="text-sm font-semibold text-[#F59E0B] text-center mt-1">&ldquo;{formData.title}&rdquo;</p>
            <p className="text-sm text-[#64748B] text-center mt-3 leading-relaxed">
              This will permanently delete this listing and all its data. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteOpen(false)}
                className="flex-1 border border-[#E2E8F0] text-[#64748B] font-medium py-3 rounded-xl hover:bg-[#F8FAFC] transition-colors text-sm">
                Keep Listing
              </button>
              <button onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
