"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosClient from "@/lib/axiosClient";
import PropertyCard from "./PropertyCard";

/* ── Property type → emoji ───────────────────────────────── */
const TYPE_EMOJI = {
  House: "🏡", Apartment: "🏢", Villa: "🏖️",
  Plot: "🏗️", Commercial: "🏪",
};

/* ── Price formatter ─────────────────────────────────────── */
function formatPrice(price, listingType) {
  const n = Number(price);
  let label;
  if (n >= 10000000)    label = `PKR ${(n / 10000000).toFixed(1)} Cr`;
  else if (n >= 100000) label = `PKR ${(n / 100000).toFixed(0)} Lac`;
  else if (n >= 1000)   label = `PKR ${(n / 1000).toFixed(0)}k`;
  else                  label = `PKR ${n.toLocaleString()}`;
  return { price: label, priceUnit: listingType === "Rent" ? "/month" : "/total" };
}

/* ── Gradient by property type ───────────────────────────── */
const TYPE_GRADIENT = {
  House:      "linear-gradient(135deg, #1D9E75, #0F6E56)",
  Apartment:  "linear-gradient(135deg, #185FA5, #0C447C)",
  Villa:      "linear-gradient(135deg, #854F0B, #F59E0B)",
  Plot:       "linear-gradient(135deg, #4F46E5, #7C3AED)",
  Commercial: "linear-gradient(135deg, #BE185D, #9D174D)",
};

/* ── Map API response → PropertyCard props ───────────────── */
function mapProperty(item) {
  const { price, priceUnit } = formatPrice(item.price, item.listingType);
  return {
    id:        item._id || item.id,
    gradient:  TYPE_GRADIENT[item.propertyType] || "linear-gradient(135deg, #0F172A, #1E3A5F)",
    emoji:     TYPE_EMOJI[item.propertyType] || "�",
    // If Cloudinary image exists, pass it so PropertyCard can use it
    image:     item.images?.[0]?.url || null,
    purpose:   item.listingType === "Rent" ? "rent" : "sale",
    featured:  item.isFeatured,
    liked:     false,
    price,
    priceUnit,
    title:     item.title,
    location:  `${item.address}, ${item.city}`,
    beds:      item.bedrooms  ?? 0,
    baths:     item.bathrooms ?? 0,
    area:      item.area      ?? 0,
  };
}

/* ── Skeleton card ───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden animate-pulse">
      <div className="h-[180px] bg-[#F1F5F9]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 bg-[#F1F5F9] rounded w-3/4" />
        <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
        <div className="h-3 bg-[#F1F5F9] rounded w-2/3" />
        <div className="flex gap-3 pt-3 border-t border-[#F1F5F9]">
          <div className="h-3 bg-[#F1F5F9] rounded w-16" />
          <div className="h-3 bg-[#F1F5F9] rounded w-16" />
          <div className="h-3 bg-[#F1F5F9] rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res  = await axiosClient.get("/properties/featured");
        const data = res.data?.data || res.data || [];
        setProperties(Array.isArray(data) ? data.map(mapProperty) : []);
      } catch {
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  /* Don't render section at all if no data and not loading */
  if (!isLoading && properties.length === 0) return null;

  return (
    <section className="px-8 pt-4 pb-12 max-w-[900px] mx-auto">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-xs font-bold text-[#F59E0B] tracking-[1.5px] uppercase mb-2">
            Hand-picked Listings
          </div>
          <div className="text-[26px] font-extrabold text-[#0F172A]">
            Featured Properties
          </div>
        </div>
        <Link href="/properties"
          className="text-sm text-[#F59E0B] font-semibold no-underline hover:text-[#D97706] transition-colors">
          View all →
        </Link>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-3 gap-[18px]">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Real data */}
      {!isLoading && (
        <div className="grid grid-cols-3 gap-[18px]">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
