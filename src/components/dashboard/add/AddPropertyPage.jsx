"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormSection from "@/components/dashboard/add/FormSection";
import FieldLabel from "@/components/dashboard/add/FieldLabel";
import ImageUploader from "@/components/dashboard/add/ImageUploader";
import axiosClient from "@/lib/axiosClient";

/* ── Constants ───────────────────────────────────────────── */
const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Plot", "Commercial"];
const CITIES = [
  "Select City","Karachi","Lahore","Islamabad","Rawalpindi",
  "Faisalabad","Multan","Peshawar","Quetta",
];
const AMENITIES = [
  { key: "parking",  label: "Parking",       icon: "🚗" },
  { key: "pool",     label: "Swimming Pool",  icon: "🏊" },
  { key: "gym",      label: "Gym",            icon: "🏋️" },
  { key: "garden",   label: "Garden",         icon: "🌿" },
  { key: "security", label: "Security Guard", icon: "🔒" },
  { key: "elevator", label: "Elevator",       icon: "🛗" },
];

const iCls = "w-full border border-[#E2E8F0] rounded-xl px-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white";
const eCls = "w-full border border-red-300 rounded-xl px-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-[#CBD5E1] bg-white";

/* ── Stepper ─────────────────────────────────────────────── */
function Stepper({ val, onDec, onInc, error }) {
  return (
    <div className={`flex items-center rounded-xl overflow-hidden border ${error ? "border-red-300" : "border-[#E2E8F0]"} bg-white`}>
      <button type="button" onClick={onDec}
        className="w-10 h-11 flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors text-lg font-bold border-r border-[#E2E8F0]">−</button>
      <span className="w-12 text-center text-sm font-bold text-[#0F172A]">{val}</span>
      <button type="button" onClick={onInc}
        className="w-10 h-11 flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors text-lg font-bold border-l border-[#E2E8F0]">+</button>
    </div>
  );
}

/* ── Success Toast ───────────────────────────────────────── */
function SuccessToast({ visible }) {
  if (!visible) return null;
  return (
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-2xl min-w-[280px]">
      <span className="text-xl shrink-0">✅</span>
      <div>
        <p className="font-extrabold text-sm">Property Submitted!</p>
        <p className="text-emerald-200 text-xs mt-[2px]">Redirecting to listings...</p>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function AddPropertyPage() {
  const router = useRouter();

  /* Form state */
  const [formData, setFormData] = useState({
    title: "",        description: "",  price: "",
    propertyType: "", listingType: "",  bedrooms: 0,
    bathrooms: 0,     area: "",         address: "",
    city: "",         country: "Pakistan",
    lat: "",          lng: "",
    parking: false,   pool: false,      gym: false,
    garden: false,    security: false,  elevator: false,
    status: "Available",
  });

  /* Image state — ImageUploader returns { id, file, url, name } objects */
  const [images,      setImages]      = useState([]);

  /* UI state */
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState("");
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── Helpers ── */
  function set(field, value) {
    setFormData(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: "" }));
  }

  function step(field, dir, min = 0, max = 20) {
    const v = parseInt(formData[field]) || 0;
    const next = Math.min(max, Math.max(min, v + dir));
    setFormData(p => ({ ...p, [field]: next }));
    setErrors(p => ({ ...p, [field]: "" }));
  }

  function toggleBoolean(key) {
    setFormData(p => ({ ...p, [key]: !p[key] }));
  }

  /* ── Validation ── */
  function validate() {
    const e = {};
    if (!formData.title.trim())          e.title        = "Required";
    if (!formData.description.trim())    e.description  = "Required";
    if (!formData.price || Number(formData.price) <= 0) e.price = "Enter a valid price";
    if (!formData.propertyType)          e.propertyType = "Select a type";
    if (!formData.listingType)           e.listingType  = "Select listing type";
    if (!formData.bedrooms || formData.bedrooms < 1)   e.bedrooms  = "At least 1 required";
    if (!formData.bathrooms || formData.bathrooms < 1) e.bathrooms = "At least 1 required";
    if (!formData.area || Number(formData.area) <= 0)  e.area      = "Enter area in sqft";
    if (!formData.address.trim())        e.address      = "Required";
    if (!formData.city || formData.city === "Select City") e.city = "Select a city";
    if (images.length === 0)             e.images       = "Please upload at least one image";
    return e;
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      setTimeout(() => {
        document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();

      /* Required text fields */
      fd.append("title",       formData.title.trim());
      fd.append("description", formData.description.trim());
      fd.append("price",       formData.price);
      fd.append("propertyType",formData.propertyType);
      fd.append("listingType", formData.listingType);
      fd.append("bedrooms",    formData.bedrooms);
      fd.append("bathrooms",   formData.bathrooms);
      fd.append("area",        formData.area);
      fd.append("address",     formData.address.trim());
      fd.append("city",        formData.city);
      fd.append("country",     formData.country);
      fd.append("status",      formData.status);

      /* Optional coordinates — only if filled */
      if (formData.lat !== "") fd.append("lat", formData.lat);
      if (formData.lng !== "") fd.append("lng", formData.lng);

      /* Boolean amenities */
      fd.append("parking",  formData.parking);
      fd.append("pool",     formData.pool);
      fd.append("gym",      formData.gym);
      fd.append("garden",   formData.garden);
      fd.append("security", formData.security);
      fd.append("elevator", formData.elevator);

      /* Images — extract File objects from ImageUploader's { id, file, url, name } objects */
      images.forEach(imgObj => {
        fd.append("images", imgObj.file);
      });

      /* API call — axiosClient handles token automatically */
      const response = await axiosClient.post("/properties", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;

      if (data.success === true || response.status === 201 || response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/listings");
        }, 2000);
      } else {
        setApiError(data.message || "Submission failed. Please try again.");
      }

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("propfind_user");
        router.push("/login");
        return;
      }
      setApiError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Completion % for sidebar ── */
  const checklistItems = [
    !!formData.title.trim(),
    !!formData.propertyType,
    !!formData.listingType,
    !!formData.price,
    formData.description.length > 30,
    formData.bedrooms > 0,
    !!formData.address.trim(),
    formData.city && formData.city !== "Select City",
    images.length > 0,
  ];
  const completePct = Math.round((checklistItems.filter(Boolean).length / checklistItems.length) * 100);

  return (
    <div className="flex flex-col min-w-0">
      <SuccessToast visible={showSuccess} />

      <div className="flex-1 px-6 py-6 flex gap-6 items-start max-w-[1200px] w-full mx-auto">

        {/* ══ LEFT — main form ══ */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 min-w-0 flex flex-col gap-6">

          {/* API error banner */}
          {apiError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4">
              <span className="text-lg shrink-0">⚠️</span>
              <div>
                <p className="font-bold">Submission Failed</p>
                <p className="text-red-600 text-xs mt-[2px]">{apiError}</p>
              </div>
            </div>
          )}

          {/* ── Section 1: Basic Info ── */}
          <FormSection number="1" title="Basic Information" subtitle="Title, type, listing mode and price">
            <div className="flex flex-col gap-5">

              <FieldLabel label="Property Title" id="title" required error={errors.title}>
                <input id="title" type="text" value={formData.title}
                  onChange={e => set("title", e.target.value)}
                  placeholder="e.g. Modern 5-Bed House in DHA Phase 6"
                  data-error={errors.title ? "true" : undefined}
                  className={errors.title ? eCls : iCls} />
              </FieldLabel>

              <div className="grid grid-cols-2 gap-4">
                <FieldLabel label="Property Type" id="propertyType" required error={errors.propertyType}>
                  <select id="propertyType" value={formData.propertyType}
                    onChange={e => set("propertyType", e.target.value)}
                    className={`${errors.propertyType ? eCls : iCls} appearance-none cursor-pointer`}>
                    <option value="">Select type...</option>
                    {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FieldLabel>

                <FieldLabel label="Listing Type" id="listingType" required error={errors.listingType}>
                  <div className={`flex h-[46px] rounded-xl border overflow-hidden bg-white ${errors.listingType ? "border-red-300" : "border-[#E2E8F0]"}`}>
                    {[{val:"Sale",label:"🏷️ For Sale"},{val:"Rent",label:"🔑 For Rent"}].map(opt => (
                      <button key={opt.val} type="button"
                        onClick={() => set("listingType", opt.val)}
                        className={`flex-1 text-sm font-bold transition-all duration-150
                          ${formData.listingType === opt.val
                            ? "bg-[#F59E0B] text-[#0F172A]"
                            : "text-[#94A3B8] hover:bg-[#F8FAFC]"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.listingType && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span>{errors.listingType}
                    </p>
                  )}
                </FieldLabel>
              </div>

              <FieldLabel label="Price (PKR)" id="price" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8] pointer-events-none">PKR</span>
                  <input id="price" type="number" value={formData.price}
                    onChange={e => set("price", e.target.value)}
                    placeholder="e.g. 25000000"
                    className={`${errors.price ? eCls : iCls} pl-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">
                    {formData.listingType === "Rent" ? "/month" : "/total"}
                  </span>
                </div>
              </FieldLabel>

              <FieldLabel label="Description" id="description" required error={errors.description}>
                <textarea id="description" rows={4} value={formData.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe the property — highlights, nearby amenities, condition..."
                  className={`${errors.description ? eCls : iCls} resize-none`} />
                <p className="text-[11px] text-[#94A3B8] mt-1 text-right">{formData.description.length}/1000</p>
              </FieldLabel>
            </div>
          </FormSection>

          {/* ── Section 2: Property Details ── */}
          <FormSection number="2" title="Property Details" subtitle="Rooms, area and amenities">
            <div className="flex flex-col gap-6">

              <div className="grid grid-cols-3 gap-4">
                <FieldLabel label="Bedrooms" id="bedrooms" required error={errors.bedrooms}>
                  <Stepper val={formData.bedrooms} error={errors.bedrooms}
                    onDec={() => step("bedrooms",-1)}
                    onInc={() => step("bedrooms",1,0,15)} />
                </FieldLabel>
                <FieldLabel label="Bathrooms" id="bathrooms" required error={errors.bathrooms}>
                  <Stepper val={formData.bathrooms} error={errors.bathrooms}
                    onDec={() => step("bathrooms",-1)}
                    onInc={() => step("bathrooms",1,0,10)} />
                </FieldLabel>
                <FieldLabel label="Area (sqft)" id="area" required error={errors.area}>
                  <input id="area" type="number" value={formData.area}
                    onChange={e => set("area", e.target.value)}
                    placeholder="e.g. 2250"
                    className={errors.area ? eCls : iCls} />
                </FieldLabel>
              </div>

              {/* Amenities — boolean checkboxes */}
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Amenities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES.map(a => {
                    const on = formData[a.key];
                    return (
                      <label key={a.key}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-all duration-150 select-none
                          ${on ? "border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]"
                               : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#F59E0B]/50"}`}>
                        <input type="checkbox" checked={on}
                          onChange={() => toggleBoolean(a.key)}
                          className="hidden" />
                        <span className="text-base shrink-0">{a.icon}</span>
                        <span className="text-xs font-medium leading-tight">{a.label}</span>
                        {on && <span className="ml-auto text-[#F59E0B] text-xs font-bold shrink-0">✓</span>}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <FieldLabel label="Listing Status" id="status">
                <div className="flex gap-2 flex-wrap">
                  {["Available","Sold","Rented"].map(s => (
                    <button key={s} type="button"
                      onClick={() => set("status", s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-150
                        ${formData.status === s
                          ? "bg-[#0F172A] text-white border-[#0F172A]"
                          : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F172A]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </FieldLabel>
            </div>
          </FormSection>

          {/* ── Section 3: Location ── */}
          <FormSection number="3" title="Location" subtitle="Help buyers find your property">
            <div className="flex flex-col gap-4">
              <FieldLabel label="Street Address" id="address" required error={errors.address}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">📍</span>
                  <input id="address" type="text" value={formData.address}
                    onChange={e => set("address", e.target.value)}
                    placeholder="e.g. Plot 42, Street 5, DHA Phase 6"
                    className={`${errors.address ? eCls : iCls} pl-10`} />
                </div>
              </FieldLabel>

              <div className="grid grid-cols-2 gap-4">
                <FieldLabel label="City" id="city" required error={errors.city}>
                  <select id="city" value={formData.city}
                    onChange={e => set("city", e.target.value)}
                    className={`${errors.city ? eCls : iCls} appearance-none cursor-pointer`}>
                    <option value="">Select City</option>
                    {CITIES.filter(c => c !== "Select City").map(c => <option key={c}>{c}</option>)}
                  </select>
                </FieldLabel>
                <FieldLabel label="Country" id="country">
                  <input id="country" type="text" value={formData.country}
                    onChange={e => set("country", e.target.value)}
                    placeholder="Pakistan" className={iCls} />
                </FieldLabel>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldLabel label="Latitude (optional)" id="lat">
                  <input id="lat" type="number" step="any" value={formData.lat}
                    onChange={e => set("lat", e.target.value)}
                    placeholder="e.g. 24.8607" className={iCls} />
                </FieldLabel>
                <FieldLabel label="Longitude (optional)" id="lng">
                  <input id="lng" type="number" step="any" value={formData.lng}
                    onChange={e => set("lng", e.target.value)}
                    placeholder="e.g. 67.0011" className={iCls} />
                </FieldLabel>
              </div>

              <div className="w-full h-[140px] rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage:"linear-gradient(#94A3B8 1px,transparent 1px),linear-gradient(90deg,#94A3B8 1px,transparent 1px)",
                  backgroundSize:"36px 36px"}} />
                <span className="relative z-10 text-3xl">🗺️</span>
                <p className="relative z-10 text-xs font-semibold text-[#64748B]">Map preview — enter coordinates above</p>
              </div>
            </div>
          </FormSection>

          {/* ── Section 4: Images ── */}
          <FormSection number="4" title="Property Images" subtitle="Upload up to 10 photos · First image = main cover">
            <ImageUploader images={images} onChange={setImages} />
            {errors.images && (
              <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.images}
              </p>
            )}
          </FormSection>

          {/* ── Submit bar ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Ready to publish?</p>
              <p className="text-xs text-[#94A3B8] mt-[2px]">Listing goes live after a quick review (~2 hours).</p>
            </div>
            <button type="submit" disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 text-sm font-bold px-8 py-3 rounded-xl transition-all w-full sm:w-auto
                ${isSubmitting
                  ? "bg-[#FCD34D] text-[#92400E] cursor-not-allowed"
                  : "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706] active:scale-[0.98]"}`}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Submitting...
                </>
              ) : "🚀 Post Property"}
            </button>
          </div>

        </form>{/* end LEFT */}

        {/* ══ RIGHT — sticky summary ══ */}
        <aside className="hidden xl:flex flex-col gap-4 w-[280px] shrink-0">
          <div className="sticky top-20 flex flex-col gap-4">

            {/* Live Preview Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] h-[120px] flex items-center justify-center text-5xl relative">
                {formData.propertyType === "House"      ? "🏡" :
                 formData.propertyType === "Apartment"  ? "🏢" :
                 formData.propertyType === "Villa"      ? "🏖️" :
                 formData.propertyType === "Plot"       ? "🏗️" :
                 formData.propertyType === "Commercial" ? "🏪" : "🏠"}
                {formData.listingType && (
                  <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-[3px] rounded-md
                    ${formData.listingType === "Sale" ? "bg-[#0F6E56]" : "bg-[#185FA5]"}`}>
                    For {formData.listingType}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-bold text-[#0F172A] text-sm leading-snug mb-1 line-clamp-2">
                  {formData.title || <span className="text-[#CBD5E1] font-normal">Property title will appear here</span>}
                </p>
                {formData.price && (
                  <p className="text-[#F59E0B] font-extrabold text-base mb-1">
                    PKR {parseInt(formData.price).toLocaleString()}
                    <span className="text-[#94A3B8] text-xs font-normal ml-1">
                      {formData.listingType === "Rent" ? "/month" : "/total"}
                    </span>
                  </p>
                )}
                {(formData.city || formData.address) && (
                  <p className="text-xs text-[#64748B] flex items-center gap-1">
                    📍 {[formData.address, formData.city].filter(Boolean).join(", ")}
                  </p>
                )}
                {(formData.bedrooms > 0 || formData.bathrooms > 0 || formData.area) && (
                  <div className="flex gap-3 mt-3 pt-3 border-t border-[#F1F5F9]">
                    {formData.bedrooms  > 0 && <span className="text-xs text-[#64748B]">🛏️ {formData.bedrooms}</span>}
                    {formData.bathrooms > 0 && <span className="text-xs text-[#64748B]">🚿 {formData.bathrooms}</span>}
                    {formData.area          && <span className="text-xs text-[#64748B]">📐 {formData.area} sqft</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Listing Checklist</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Title added",        done: !!formData.title.trim() },
                  { label: "Type selected",       done: !!formData.propertyType },
                  { label: "Listing type",        done: !!formData.listingType },
                  { label: "Price set",           done: !!formData.price },
                  { label: "Description (30+)",   done: formData.description.length > 30 },
                  { label: "Bedrooms set",        done: formData.bedrooms > 0 },
                  { label: "Address provided",    done: !!formData.address.trim() },
                  { label: "City selected",       done: !!formData.city && formData.city !== "Select City" },
                  { label: "Photos uploaded",     done: images.length > 0 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                      ${item.done ? "bg-[#0F6E56] text-white" : "bg-[#F1F5F9] text-[#CBD5E1]"}`}>
                      {item.done ? "✓" : "·"}
                    </span>
                    <span className={`text-xs ${item.done ? "text-[#1E293B] font-medium" : "text-[#94A3B8]"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#94A3B8] font-semibold">Completeness</span>
                  <span className="text-[10px] font-bold text-[#0F172A]">{completePct}%</span>
                </div>
                <div className="h-[6px] bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                    style={{ width: `${completePct}%` }} />
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#FFFBEB] border border-[#F59E0B]/30 rounded-2xl p-4">
              <p className="text-xs font-bold text-[#92400E] mb-2">💡 Tips for better listings</p>
              <ul className="flex flex-col gap-1">
                {["Add at least 5 clear photos","Write 100+ word description","Include exact address for more views"].map(t => (
                  <li key={t} className="text-[11px] text-[#78350F] flex items-start gap-1">
                    <span className="mt-[2px] shrink-0">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
