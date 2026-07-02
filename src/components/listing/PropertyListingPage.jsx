"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import FilterSidebar from "@/components/listing/FilterSidebar";
import ListingTopBar from "@/components/listing/ListingTopBar";
import Pagination from "@/components/listing/Pagination";

/* ─── Mock Data ─────────────────────────────────────────── */
const ALL_PROPERTIES = [
  {
    id: 1,
    gradient: "linear-gradient(135deg, #1D9E75, #0F6E56)",
    emoji: "🏡",
    purpose: "sale",
    featured: true,
    liked: false,
    price: "PKR 2.5 Cr",
    priceUnit: "/total",
    title: "Modern 5-Bed House in DHA",
    location: "DHA Phase 6, Karachi",
    beds: 5,
    baths: 4,
    area: 500,
  },
  {
    id: 2,
    gradient: "linear-gradient(135deg, #185FA5, #0C447C)",
    emoji: "🏢",
    purpose: "rent",
    featured: true,
    liked: true,
    price: "PKR 85k",
    priceUnit: "/month",
    title: "Luxury 3-Bed Apartment Clifton",
    location: "Clifton Block 4, Karachi",
    beds: 3,
    baths: 2,
    area: 2100,
  },
  {
    id: 3,
    gradient: "linear-gradient(135deg, #854F0B, #F59E0B)",
    emoji: "🏖️",
    purpose: "sale",
    featured: true,
    liked: false,
    price: "PKR 8.2 Cr",
    priceUnit: "/total",
    title: "Premium Villa with Pool",
    location: "Bahria Town, Lahore",
    beds: 6,
    baths: 5,
    area: 1200,
  },
  {
    id: 4,
    gradient: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    emoji: "🏘️",
    purpose: "sale",
    featured: false,
    liked: false,
    price: "PKR 1.8 Cr",
    priceUnit: "/total",
    title: "4-Bed House in Gulshan-e-Iqbal",
    location: "Gulshan Block 13, Karachi",
    beds: 4,
    baths: 3,
    area: 400,
  },
  {
    id: 5,
    gradient: "linear-gradient(135deg, #0F6E56, #064E3B)",
    emoji: "🏗️",
    purpose: "sale",
    featured: false,
    liked: false,
    price: "PKR 45 Lac",
    priceUnit: "/total",
    title: "Residential Plot — 10 Marla",
    location: "Bahria Enclave, Islamabad",
    beds: 0,
    baths: 0,
    area: 2250,
  },
  {
    id: 6,
    gradient: "linear-gradient(135deg, #BE185D, #9D174D)",
    emoji: "🏪",
    purpose: "rent",
    featured: false,
    liked: false,
    price: "PKR 1.2 Lac",
    priceUnit: "/month",
    title: "Ground Floor Commercial Shop",
    location: "Main Boulevard, Lahore",
    beds: 0,
    baths: 1,
    area: 800,
  },
  {
    id: 7,
    gradient: "linear-gradient(135deg, #0369A1, #075985)",
    emoji: "🏢",
    purpose: "rent",
    featured: false,
    liked: true,
    price: "PKR 55k",
    priceUnit: "/month",
    title: "2-Bed Apartment — F-10 Islamabad",
    location: "F-10 Markaz, Islamabad",
    beds: 2,
    baths: 2,
    area: 1200,
  },
  {
    id: 8,
    gradient: "linear-gradient(135deg, #92400E, #78350F)",
    emoji: "🏡",
    purpose: "sale",
    featured: false,
    liked: false,
    price: "PKR 3.9 Cr",
    priceUnit: "/total",
    title: "Corner House — 1 Kanal, Johar Town",
    location: "Johar Town, Lahore",
    beds: 5,
    baths: 5,
    area: 4500,
  },
  {
    id: 9,
    gradient: "linear-gradient(135deg, #065F46, #047857)",
    emoji: "🏖️",
    purpose: "sale",
    featured: true,
    liked: false,
    price: "PKR 12 Cr",
    priceUnit: "/total",
    title: "Beachfront Villa — Phase 8 DHA",
    location: "DHA Phase 8, Karachi",
    beds: 7,
    baths: 6,
    area: 2000,
  },
];

const ITEMS_PER_PAGE = 9;
const TOTAL_PAGES = Math.ceil(ALL_PROPERTIES.length / ITEMS_PER_PAGE);

/* ─── Main Component ────────────────────────────────────── */
export default function PropertyListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]"><Navbar /></div>}>
      <PropertyListingContent />
    </Suspense>
  );
}

function PropertyListingContent() {
  const searchParams        = useSearchParams();
  const router              = useRouter();
  const urlType             = searchParams.get("type"); // "sale" | "rent" | null

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sort,             setSort]             = useState("newest");
  const [currentPage,      setCurrentPage]      = useState(1);
  const [activeFilters,    setActiveFilters]    = useState(null);

  /* Sync listingType filter from URL on mount / URL change */
  useEffect(() => {
    setActiveFilters(prev => ({
      selectedTypes: prev?.selectedTypes ?? [],
      listingType:   urlType === "rent" ? "rent" : urlType === "sale" ? "sale" : "all",
      minPrice:      prev?.minPrice ?? "",
      maxPrice:      prev?.maxPrice ?? "",
      beds:          prev?.beds ?? null,
      baths:         prev?.baths ?? null,
      city:          prev?.city ?? "All Cities",
    }));
    setCurrentPage(1);
  }, [urlType]);

  /* Page heading based on URL type */
  const heading = urlType === "sale"
    ? "Properties For Sale"
    : urlType === "rent"
    ? "Properties For Rent"
    : "All Properties";

  const subheading = urlType === "sale"
    ? "Find your dream property to buy"
    : urlType === "rent"
    ? "Find the perfect rental property"
    : "Browse verified listings across Pakistan";

  /* Sort logic */
  function getSortedProperties() {
    const list = [...ALL_PROPERTIES];
    if (sort === "price_asc") {
      return list.sort((a, b) => extractNum(a.price) - extractNum(b.price));
    }
    if (sort === "price_desc") {
      return list.sort((a, b) => extractNum(b.price) - extractNum(a.price));
    }
    if (sort === "most_viewed") {
      return list.sort((a, b) => b.id - a.id);
    }
    // newest — default order
    return list;
  }

  function extractNum(priceStr) {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    if (priceStr.includes("Cr")) return num * 10000000;
    if (priceStr.includes("Lac")) return num * 100000;
    if (priceStr.includes("k")) return num * 1000;
    return num;
  }

  const sorted = getSortedProperties();
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handlePageChange(page) {
    if (page < 1 || page > TOTAL_PAGES) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(val) {
    setSort(val);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* ── Page Header ─────────────────────────── */}
      <div className="bg-[#0F172A] px-6 py-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
            <a href="/" className="hover:text-[#F59E0B] transition-colors">Home</a>
            <span>›</span>
            <span className="text-[#94A3B8]">Properties</span>
            {urlType && (
              <>
                <span>›</span>
                <span className="text-[#94A3B8] capitalize">{urlType === "sale" ? "For Sale" : "For Rent"}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {heading}
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {subheading}
          </p>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* Sidebar */}
          <FilterSidebar
            initialListingType={urlType === "rent" ? "rent" : urlType === "sale" ? "sale" : "all"}
            onApply={setActiveFilters}
            onListingTypeChange={type => {
              if (type === "all")  router.push("/properties");
              else if (type === "sale") router.push("/properties?type=sale");
              else if (type === "rent") router.push("/properties?type=rent");
            }}
            mobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <ListingTopBar
              total={ALL_PROPERTIES.length}
              sort={sort}
              onSortChange={handleSortChange}
              onFilterOpen={() => setMobileFilterOpen(true)}
            />

            {/* Active filter chips */}
            {activeFilters &&
              (activeFilters.selectedTypes.length > 0 ||
                activeFilters.listingType !== "all" ||
                activeFilters.beds ||
                activeFilters.baths ||
                activeFilters.city !== "All Cities") && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {activeFilters.selectedTypes.map((t) => (
                    <span
                      key={t}
                      className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                  {activeFilters.listingType !== "all" && (
                    <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                      {activeFilters.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                  )}
                  {activeFilters.beds && (
                    <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                      {activeFilters.beds} Beds
                    </span>
                  )}
                  {activeFilters.baths && (
                    <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                      {activeFilters.baths} Baths
                    </span>
                  )}
                  {activeFilters.city !== "All Cities" && (
                    <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                      📍 {activeFilters.city}
                    </span>
                  )}
                </div>
              )}

            {/* Property Grid */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-4">🔍</span>
                <p className="text-lg font-bold text-[#0F172A] mb-2">No properties found</p>
                <p className="text-sm text-[#64748B]">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}

            {/* Pagination */}
            {TOTAL_PAGES > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={TOTAL_PAGES}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
