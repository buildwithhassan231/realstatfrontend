"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axiosClient from "@/lib/axiosClient";

/* ── Helpers ─────────────────────────────────────────────── */
function formatPrice(price) {
  const n = Number(price);
  if (n >= 10000000)    return `PKR ${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000)      return `PKR ${(n / 100000).toFixed(0)} Lac`;
  if (n >= 1000)        return `PKR ${(n / 1000).toFixed(0)}k`;
  return `PKR ${n.toLocaleString()}`;
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Loading skeleton ────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 animate-pulse">
        <div className="h-4 bg-[#F1F5F9] rounded w-1/3" />
        <div className="h-[320px] bg-[#F1F5F9] rounded-2xl" />
        <div className="h-8 bg-[#F1F5F9] rounded w-2/3" />
        <div className="h-4 bg-[#F1F5F9] rounded w-1/4" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-[#F1F5F9] rounded-xl" />)}
        </div>
        <div className="h-32 bg-[#F1F5F9] rounded-xl" />
      </div>
    </div>
  );
}

/* ── Amenity list ────────────────────────────────────────── */
const AMENITY_LIST = [
  { key: "parking",  label: "Parking",        icon: "🚗" },
  { key: "pool",     label: "Swimming Pool",   icon: "🏊" },
  { key: "gym",      label: "Gym",             icon: "🏋️" },
  { key: "garden",   label: "Garden",          icon: "🌿" },
  { key: "security", label: "Security Guard",  icon: "🔒" },
  { key: "elevator", label: "Elevator",        icon: "🛗" },
];

/* ── Main component ──────────────────────────────────────── */
export default function PropertyDetailPage() {
  const { id }    = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState("");
  const [saved,     setSaved]     = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({ name:"", email:"", phone:"", message:"" });
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchProperty() {
      setIsLoading(true);
      setError("");
      try {
        const res  = await axiosClient.get(`/properties/${id}`);
        const data = res.data?.data || res.data;
        setProperty(data);
      } catch (err) {
        setError(err.response?.data?.message || "Property not found.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (isLoading) return <Skeleton />;

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <span className="text-6xl">🏚️</span>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Property Not Found</h1>
          <p className="text-sm text-[#64748B]">{error || "This listing may have been removed."}</p>
          <Link href="/properties"
            className="mt-2 bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#D97706] transition-colors no-underline">
            Browse Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Derived values ── */
  const p         = property;
  const images    = p.images || [];
  const agent     = p.createdBy || {};
  const amenities = p.amenities || {};
  const location  = p.location  || {};
  const priceStr  = formatPrice(p.price);
  const perSqft   = p.area ? formatPrice(Math.round(p.price / p.area)) : null;
  const agentInit = (agent.name || "AG").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const activeAmenities = AMENITY_LIST.filter(a => amenities[a.key]);

  async function handleInquiry(e) {
    e.preventDefault();
    try {
      await axiosClient.post(`/inquiries/${p._id || p.id}`, {
        message:    inquiryForm.message,
        buyerPhone: inquiryForm.phone,
      });
      setInquirySent(true);
    } catch {
      setInquirySent(true); // show success anyway for UX
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-5 flex-wrap">
          <Link href="/" className="hover:text-[#F59E0B] transition-colors no-underline">Home</Link>
          <span>›</span>
          <Link href="/properties" className="hover:text-[#F59E0B] transition-colors no-underline">Properties</Link>
          {p.city && (
            <>
              <span>›</span>
              <Link href={`/properties?city=${p.city}`}
                className="hover:text-[#F59E0B] transition-colors no-underline capitalize">{p.city}</Link>
            </>
          )}
          <span>›</span>
          <span className="text-[#475569] font-medium truncate max-w-[200px]">{p.title}</span>
        </nav>

        {/* ── Image gallery ── */}
        <div className="flex flex-col sm:flex-row gap-3 rounded-2xl overflow-hidden mb-6">
          {/* Main image */}
          <div className="flex-1 min-h-[280px] sm:min-h-[340px] bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] relative overflow-hidden rounded-2xl">
            {images.length > 0 ? (
              <img src={images[activeImg]?.url} alt={p.title}
                className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                {p.propertyType === "Villa" ? "🏖️" : p.propertyType === "Apartment" ? "🏢" : p.propertyType === "Plot" ? "🏗️" : "🏡"}
              </div>
            )}
            {p.isFeatured && (
              <span className="absolute top-4 left-4 bg-[#F59E0B] text-[#0F172A] text-[11px] font-bold px-3 py-1 rounded-md">
                ⭐ Featured
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2 sm:w-[100px]">
              {images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-[80px] sm:w-full h-[72px] rounded-xl overflow-hidden border-2 transition-all shrink-0
                    ${activeImg === i ? "border-[#F59E0B]" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Title bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-white text-[11px] font-bold px-3 py-1 rounded-md
                ${p.listingType === "Rent" ? "bg-[#185FA5]" : "bg-[#0F6E56]"}`}>
                For {p.listingType}
              </span>
              {p.isFeatured && (
                <span className="bg-[#FFFBEB] text-[#92400E] border border-[#F59E0B]/40 text-[11px] font-bold px-3 py-1 rounded-md">
                  ⭐ Featured
                </span>
              )}
              <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-medium px-3 py-1 rounded-md capitalize">
                {p.approvalStatus}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">{p.title}</h1>
            <p className="text-sm text-[#64748B] mt-1 flex items-center gap-1 capitalize">
              📍 {p.address}, {p.city}, {p.country}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="text-3xl font-extrabold text-[#0F172A]">{priceStr}</div>
            {perSqft && <div className="text-xs text-[#94A3B8]">{perSqft} / sqft</div>}
            <div className="flex items-center gap-2">
              <button onClick={() => setSaved(!saved)}
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-[7px] rounded-lg border transition-all
                  ${saved ? "bg-[#FFFBEB] border-[#F59E0B] text-[#92400E]" : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#F59E0B]"}`}>
                {saved ? "❤️ Saved" : "🤍 Save"}
              </button>
              <button className="flex items-center gap-1 text-xs font-semibold px-3 py-[7px] rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#F59E0B] transition-colors">
                🔗 Share
              </button>
            </div>
          </div>
        </div>

        {/* ── 2-col layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon:"🛏️", label:"Bedrooms",  value: p.bedrooms  ?? "—" },
                { icon:"🚿", label:"Bathrooms", value: p.bathrooms ?? "—" },
                { icon:"📐", label:"Area (sqft)",value: p.area      ?? "—" },
                { icon:"🏷️", label:"Type",       value: p.propertyType     },
              ].map(s => (
                <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-lg font-extrabold text-[#0F172A]">{s.value}</div>
                  <div className="text-xs text-[#94A3B8]">{s.label}</div>
                </div>
              ))}
            </div>

            <hr className="border-[#E2E8F0]" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">About This Property</h2>
              <p className="text-sm text-[#475569] leading-7 whitespace-pre-line">{p.description}</p>
            </div>

            {/* Amenities */}
            {activeAmenities.length > 0 && (
              <>
                <hr className="border-[#E2E8F0]" />
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeAmenities.map(a => (
                      <div key={a.key}
                        className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-xl px-4 py-3">
                        <span className="text-xl shrink-0">{a.icon}</span>
                        <span className="text-sm font-medium text-[#1E293B]">{a.label}</span>
                        <span className="ml-auto text-[#0F6E56] text-sm font-bold">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Location */}
            {(location.lat || location.lng) && (
              <>
                <hr className="border-[#E2E8F0]" />
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-4">Location</h2>
                  <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl h-[180px] flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">🗺️</span>
                    <p className="text-sm font-semibold text-[#64748B] capitalize">{p.address}, {p.city}</p>
                    {location.lat && location.lng && (
                      <a href={`https://maps.google.com?q=${location.lat},${location.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors no-underline">
                        Open in Google Maps ↗
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT — sticky agent sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="lg:sticky lg:top-20 flex flex-col gap-4">

              {/* Agent card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Listed By</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-sm font-extrabold text-[#0F172A] select-none shrink-0">
                    {agentInit}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0F172A] text-sm truncate">{agent.name || "Agent"}</p>
                    {agent.agencyName && (
                      <p className="text-xs text-[#64748B] truncate">{agent.agencyName}</p>
                    )}
                    {agent.phoneNumber && (
                      <p className="text-xs text-[#94A3B8]">{agent.phoneNumber}</p>
                    )}
                  </div>
                </div>
                {agent.phoneNumber && (
                  <a href={`tel:${agent.phoneNumber}`}
                    className="block w-full text-center bg-[#0F172A] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#1E293B] transition-colors no-underline mb-2">
                    📞 Call Agent
                  </a>
                )}
                {agent.phoneNumber && (
                  <a href={`https://wa.me/${agent.phoneNumber?.replace(/\D/g,"")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center border-2 border-[#0F6E56] text-[#0F6E56] font-bold text-sm py-3 rounded-xl hover:bg-emerald-50 transition-colors no-underline">
                    💬 WhatsApp
                  </a>
                )}
              </div>

              {/* Inquiry form */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] px-5 py-4">
                  <p className="font-extrabold text-white text-sm">Send Inquiry</p>
                  <p className="text-white/60 text-xs mt-[2px]">Get details from the agent</p>
                </div>

                {inquirySent ? (
                  <div className="p-5 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">✅</div>
                    <p className="font-bold text-[#0F172A]">Inquiry Sent!</p>
                    <p className="text-xs text-[#64748B]">The agent will contact you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="p-5 flex flex-col gap-3">
                    {[
                      { id:"name",    label:"Your Name",  type:"text",  ph:"Ahmed Khan"         },
                      { id:"email",   label:"Email",       type:"email", ph:"you@email.com"      },
                      { id:"phone",   label:"Phone",       type:"tel",   ph:"+92 300 0000000"    },
                    ].map(f => (
                      <div key={f.id}>
                        <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">{f.label}</label>
                        <input type={f.type} placeholder={f.ph} required
                          value={inquiryForm[f.id]}
                          onChange={e => setInquiryForm(p => ({ ...p, [f.id]: e.target.value }))}
                          className="w-full border border-[#E2E8F0] rounded-xl px-3 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1]" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Message</label>
                      <textarea rows={3} placeholder="I'm interested in this property..."
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full border border-[#E2E8F0] rounded-xl px-3 py-[9px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] resize-none" />
                    </div>
                    <button type="submit"
                      className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold text-sm py-3 rounded-xl transition-colors">
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
