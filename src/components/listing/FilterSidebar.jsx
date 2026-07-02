"use client";

import { useState, useEffect } from "react";

const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Plot", "Commercial"];
const CITIES = [
  "All Cities",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
];

export default function FilterSidebar({ onApply, onListingTypeChange, initialListingType = "all", mobileOpen, onMobileClose }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [listingType,   setListingType]   = useState(initialListingType);
  const [minPrice,      setMinPrice]      = useState("");
  const [maxPrice,      setMaxPrice]      = useState("");
  const [beds,          setBeds]          = useState(null);
  const [baths,         setBaths]         = useState(null);
  const [city,          setCity]          = useState("All Cities");

  /* Sync listingType when URL changes (prop changes) */
  useEffect(() => {
    setListingType(initialListingType);
  }, [initialListingType]);

  function toggleType(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function handleReset() {
    setSelectedTypes([]);
    setListingType("all");
    setMinPrice("");
    setMaxPrice("");
    setBeds(null);
    setBaths(null);
    setCity("All Cities");
  }

  function handleApply() {
    onApply?.({ selectedTypes, listingType, minPrice, maxPrice, beds, baths, city });
    onMobileClose?.();
  }

  const sidebarContent = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0F172A]">Filters</h2>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors"
        >
          Reset All
        </button>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* Property Type */}
      <div>
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
          Property Type
        </p>
        <div className="flex flex-col gap-[10px]">
          {PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="w-4 h-4 rounded border-[#CBD5E1] accent-[#F59E0B] cursor-pointer"
              />
              <span className="text-sm text-[#1E293B] group-hover:text-[#0F172A] transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* Listing Type */}
      <div>
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
          Listing Type
        </p>
        <div className="flex flex-col gap-[10px]">
          {[
            { value: "all",  label: "Buy or Rent" },
            { value: "sale", label: "For Sale"    },
            { value: "rent", label: "For Rent"    },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="listingType"
                value={opt.value}
                checked={listingType === opt.value}
                onChange={() => {
                  setListingType(opt.value);
                  onListingTypeChange?.(opt.value);
                }}
                className="w-4 h-4 accent-[#F59E0B] cursor-pointer"
              />
              <span className="text-sm text-[#1E293B] group-hover:text-[#0F172A] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* Price Range */}
      <div>
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
          Price Range (PKR)
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-[#94A3B8] font-semibold uppercase block mb-1">
              Min
            </label>
            <input
              type="number"
              placeholder="e.g. 50,000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] transition-colors placeholder:text-[#CBD5E1]"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-[#94A3B8] font-semibold uppercase block mb-1">
              Max
            </label>
            <input
              type="number"
              placeholder="e.g. 5,00,000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] transition-colors placeholder:text-[#CBD5E1]"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* Bedrooms */}
      <div>
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
          Bedrooms
        </p>
        <div className="flex gap-2 flex-wrap">
          {["1", "2", "3", "4", "5+"].map((n) => (
            <button
              key={n}
              onClick={() => setBeds(beds === n ? null : n)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-all duration-150
                ${
                  beds === n
                    ? "bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#F59E0B] hover:text-[#0F172A]"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* Bathrooms */}
      <div>
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
          Bathrooms
        </p>
        <div className="flex gap-2 flex-wrap">
          {["1", "2", "3", "4+"].map((n) => (
            <button
              key={n}
              onClick={() => setBaths(baths === n ? null : n)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-all duration-150
                ${
                  baths === n
                    ? "bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#F59E0B] hover:text-[#0F172A]"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* City */}
      <div>
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">City</p>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] transition-colors bg-white cursor-pointer"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm py-3 rounded-xl hover:bg-[#D97706] transition-colors duration-150 mt-2"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sticky top-20">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#0F172A]">Filters</span>
              <button
                onClick={onMobileClose}
                className="text-[#64748B] hover:text-[#0F172A] text-xl font-bold"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
