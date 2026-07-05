"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function PropertyCard({ property }) {
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const router = useRouter();

  const id      = property.id?.toString();
  const liked   = isFavorited(id);

  async function handleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    await toggleFavorite(id);
  }

  return (
    <div className="bg-white rounded-[14px] overflow-hidden border border-[#E2E8F0] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[3px]">

      {/* ── Image Area ─────────────────────── */}
      <Link href={`/properties/${id}`} className="block">
        <div
          className="h-[180px] relative overflow-hidden flex items-center justify-center"
          style={{ background: property.gradient }}
        >
          {/* Cloudinary image if available */}
          {property.image ? (
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <span className="text-5xl select-none">{property.emoji}</span>
          )}

          {/* For Sale / For Rent Badge */}
          <span
            className={`absolute top-3 left-3 px-[10px] py-1 rounded-md text-[11px] font-bold text-white
              ${property.purpose === "sale" ? "bg-[#0F6E56]" : "bg-[#185FA5]"}`}
          >
            {property.purpose === "sale" ? "For Sale" : "For Rent"}
          </span>

          {/* Featured Badge */}
          {property.featured && (
            <span className="absolute top-3 right-3 bg-[#F59E0B] text-[#0F172A] px-[10px] py-1 rounded-md text-[11px] font-bold">
              ⭐ Featured
            </span>
          )}

          {/* Heart / Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute bottom-3 right-3 bg-[rgba(255,255,255,0.9)] w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-transform duration-150 hover:scale-110 active:scale-95"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <span className="text-base leading-none">{liked ? "❤️" : "🤍"}</span>
          </button>
        </div>
      </Link>

      {/* ── Card Body ──────────────────────── */}
      <Link href={`/properties/${id}`} className="block p-4 hover:no-underline">
        <div className="text-xl font-extrabold text-[#0F172A] mb-1">
          {property.price}{" "}
          <span className="text-sm font-normal text-[#94A3B8]">{property.priceUnit}</span>
        </div>

        <div className="text-sm font-semibold text-[#1E293B] mb-[6px] whitespace-nowrap overflow-hidden text-ellipsis">
          {property.title}
        </div>

        <div className="text-xs text-[#64748B] mb-[14px] flex items-center gap-1">
          📍 {property.location}
        </div>

        <div className="flex gap-[14px] pt-3 border-t border-[#F1F5F9]">
          {property.beds > 0 && (
            <div className="text-xs text-[#64748B] flex items-center gap-1">
              🛏️ <strong className="text-[#1E293B] font-semibold">{property.beds}</strong> Beds
            </div>
          )}
          {property.baths > 0 && (
            <div className="text-xs text-[#64748B] flex items-center gap-1">
              🚿 <strong className="text-[#1E293B] font-semibold">{property.baths}</strong> Baths
            </div>
          )}
          {property.area > 0 && (
            <div className="text-xs text-[#64748B] flex items-center gap-1">
              📐 <strong className="text-[#1E293B] font-semibold">{property.area}</strong> sqft
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
