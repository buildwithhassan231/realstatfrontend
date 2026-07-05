"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axiosClient from "@/lib/axiosClient";
import { useFavorites } from "@/context/FavoritesContext";

/* ── Helpers ─────────────────────────────────────────────── */
const TYPE_EMOJI    = { House:"🏡", Apartment:"🏢", Villa:"🏖️", Plot:"🏗️", Commercial:"🏪" };
const TYPE_GRADIENT = {
  House:      "linear-gradient(135deg,#1D9E75,#0F6E56)",
  Apartment:  "linear-gradient(135deg,#185FA5,#0C447C)",
  Villa:      "linear-gradient(135deg,#854F0B,#F59E0B)",
  Plot:       "linear-gradient(135deg,#4F46E5,#7C3AED)",
  Commercial: "linear-gradient(135deg,#BE185D,#9D174D)",
};

function formatPrice(price, listingType) {
  const n = Number(price);
  let label;
  if (n >= 10000000)    label = `PKR ${(n/10000000).toFixed(1)} Cr`;
  else if (n >= 100000) label = `PKR ${(n/100000).toFixed(0)} Lac`;
  else if (n >= 1000)   label = `PKR ${(n/1000).toFixed(0)}k`;
  else                  label = `PKR ${n.toLocaleString()}`;
  return listingType === "Rent" ? `${label}/mo` : label;
}

/* ── Skeleton ────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden animate-pulse">
      <div className="h-[180px] bg-[#F1F5F9]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 bg-[#F1F5F9] rounded w-3/4" />
        <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
        <div className="h-3 bg-[#F1F5F9] rounded w-2/3" />
        <div className="flex gap-3 pt-3 border-t border-[#F1F5F9]">
          {[1,2,3].map(i => <div key={i} className="h-3 bg-[#F1F5F9] rounded w-14" />)}
        </div>
      </div>
    </div>
  );
}

/* ── Property card for favorites ────────────────────────── */
function FavoriteCard({ property, onRemove }) {
  const img      = property.images?.[0]?.url;
  const emoji    = TYPE_EMOJI[property.propertyType]    || "🏠";
  const gradient = TYPE_GRADIENT[property.propertyType] || "linear-gradient(135deg,#0F172A,#1E3A5F)";
  const price    = formatPrice(property.price, property.listingType);
  const id       = property._id || property.id;

  return (
    <div className="bg-white rounded-[14px] overflow-hidden border border-[#E2E8F0] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] flex flex-col">

      {/* Image */}
      <Link href={`/properties/${id}`} className="block relative">
        <div className="h-[180px] relative overflow-hidden flex items-center justify-center"
          style={{ background: gradient }}>
          {img
            ? <img src={img} alt={property.title} className="w-full h-full object-cover absolute inset-0" />
            : <span className="text-5xl select-none">{emoji}</span>}

          {/* Purpose badge */}
          <span className={`absolute top-3 left-3 px-[10px] py-1 rounded-md text-[11px] font-bold text-white
            ${property.listingType === "Rent" ? "bg-[#185FA5]" : "bg-[#0F6E56]"}`}>
            For {property.listingType}
          </span>

          {/* Featured badge */}
          {property.isFeatured && (
            <span className="absolute top-3 right-3 bg-[#F59E0B] text-[#0F172A] px-[10px] py-1 rounded-md text-[11px] font-bold">
              ⭐ Featured
            </span>
          )}

          {/* Remove from favorites */}
          <button
            onClick={e => { e.preventDefault(); onRemove(id); }}
            className="absolute bottom-3 right-3 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center shadow text-base hover:bg-red-50 transition-colors"
            title="Remove from favorites">
            ❤️
          </button>
        </div>
      </Link>

      {/* Body */}
      <Link href={`/properties/${id}`} className="block p-4 hover:no-underline flex-1 flex flex-col">
        <div className="text-xl font-extrabold text-[#0F172A] mb-1">{price}</div>
        <div className="text-sm font-semibold text-[#1E293B] mb-[6px] truncate">{property.title}</div>
        <div className="text-xs text-[#64748B] mb-[14px] flex items-center gap-1 capitalize">
          📍 {property.address}, {property.city}
        </div>
        <div className="flex gap-[14px] pt-3 border-t border-[#F1F5F9] mt-auto">
          {property.bedrooms  > 0 && <span className="text-xs text-[#64748B] flex items-center gap-1">🛏️ <strong className="text-[#1E293B]">{property.bedrooms}</strong> Beds</span>}
          {property.bathrooms > 0 && <span className="text-xs text-[#64748B] flex items-center gap-1">🚿 <strong className="text-[#1E293B]">{property.bathrooms}</strong> Baths</span>}
          {property.area      > 0 && <span className="text-xs text-[#64748B] flex items-center gap-1">📐 <strong className="text-[#1E293B]">{property.area}</strong> sqft</span>}
        </div>
      </Link>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function FavoritesPage() {
  const { fetchFavorites } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [apiError,   setApiError]   = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setIsLoading(true);
    setApiError("");
    try {
      const res  = await axiosClient.get("/favorites");
      const data = res.data?.data || res.data || [];
      // Response may be array of property objects or array of { property: {...} }
      const props = Array.isArray(data)
        ? data.map(item => item.property || item).filter(Boolean)
        : [];
      setProperties(props);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to load favorites.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(propertyId) {
    // Optimistic remove
    setProperties(prev => prev.filter(p => (p._id || p.id) !== propertyId));
    try {
      await axiosClient.post(`/favorites/${propertyId}`); // toggle
      fetchFavorites(); // sync context count
    } catch {
      loadFavorites(); // revert on error
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-[#0F172A] px-6 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
            <Link href="/" className="hover:text-[#F59E0B] transition-colors no-underline">Home</Link>
            <span>›</span>
            <span className="text-[#94A3B8]">Saved Properties</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            ❤️ Saved Properties
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {isLoading ? "Loading..." : `${properties.length} saved propert${properties.length !== 1 ? "ies" : "y"}`}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex-1 w-full">

        {/* Error */}
        {apiError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            <span>⚠️</span> {apiError}
            <button onClick={loadFavorites} className="ml-auto text-xs font-semibold underline">Retry</button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Grid */}
        {!isLoading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties.map(p => (
              <FavoriteCard
                key={p._id || p.id}
                property={p}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && properties.length === 0 && !apiError && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-7xl mb-5">🤍</span>
            <h2 className="text-xl font-extrabold text-[#0F172A] mb-2">No saved properties yet</h2>
            <p className="text-sm text-[#64748B] mb-6 max-w-sm">
              Browse properties and tap the heart icon to save your favourites here.
            </p>
            <Link href="/properties"
              className="bg-[#F59E0B] text-[#0F172A] font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#D97706] transition-colors no-underline">
              Browse Properties
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
