"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

/* ── Emoji fallback by category name ────────────────────── */
const EMOJI_MAP = {
  house:       "🏡", villa: "🏖️", apartment: "🏢",
  plot:        "🏗️", commercial: "🏪", LuxuryVilla: "🏙️",
  farmhouse:   "🏡", studio: "🏢", office: "🏬",
  "luxury villa": "�️",
};

function getCategoryEmoji(name = "") {
  return EMOJI_MAP[name.toLowerCase()] ?? "🏠";
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [active,     setActive]     = useState(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axiosClient.get("/categories");
        // Response: { success: true, total: n, data: [...] }
        const data = res.data?.data || res.data || [];
        setCategories(Array.isArray(data) ? data.filter(c => c.isActive !== false) : []);
      } catch {
        // Silently fail — categories are non-critical for homepage
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  function handleClick(index, name) {
    setActive(index);
    router.push(`/properties?category=${encodeURIComponent(name)}`);
  }

  return (
    <section className="px-8 pt-12 pb-8 max-w-[900px] mx-auto">
      <div className="text-xs font-bold text-[#F59E0B] tracking-[1.5px] uppercase mb-2">
        Browse By Type
      </div>
      <div className="text-[26px] font-extrabold text-[#0F172A] mb-7">
        What are you looking for?
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i}
              className="border border-[#E2E8F0] rounded-xl p-5 px-3 text-center animate-pulse bg-[#F1F5F9] h-[96px]" />
          ))}
        </div>
      )}

      {/* Categories grid */}
      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {categories.map((cat, index) => (
            <div
              key={cat._id || cat.id}
              onClick={() => handleClick(index, cat.name)}
              className={`border-[1.5px] rounded-xl p-5 px-3 text-center cursor-pointer transition-all duration-200
                ${active === index
                  ? "border-[#F59E0B] bg-[#FFFBEB]"
                  : "border-[#E2E8F0] bg-white hover:border-[#F59E0B] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(245,158,11,0.15)]"
                }`}
            >
              <div className="text-[28px] mb-2">{getCategoryEmoji(cat.name)}</div>
              <div className="text-sm font-semibold text-[#1E293B]">{cat.name}</div>
              {cat.description && (
                <div className="text-[11px] text-[#94A3B8] mt-[2px] truncate">{cat.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty — backend offline ya categories nahi */}
      {!isLoading && categories.length === 0 && null}
    </section>
  );
}
