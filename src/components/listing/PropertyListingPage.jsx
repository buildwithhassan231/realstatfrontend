"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import FilterSidebar from "@/components/listing/FilterSidebar";
import ListingTopBar from "@/components/listing/ListingTopBar";
import Pagination from "@/components/listing/Pagination";
import axiosClient from "@/lib/axiosClient";

const ITEMS_PER_PAGE = 10;

/* ── API response → PropertyCard shape ──────────────────── */
const TYPE_EMOJI     = { House:"🏡", Apartment:"🏢", Villa:"🏖️", Plot:"🏗️", Commercial:"🏪" };
const TYPE_GRADIENT  = {
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
  return { price: label, priceUnit: listingType === "Rent" ? "/month" : "/total" };
}

function mapProperty(item) {
  const { price, priceUnit } = formatPrice(item.price, item.listingType);
  return {
    id:       item._id || item.id,
    gradient: TYPE_GRADIENT[item.propertyType] || "linear-gradient(135deg,#0F172A,#1E3A5F)",
    emoji:    TYPE_EMOJI[item.propertyType]    || "🏠",
    image:    item.images?.[0]?.url            || null,
    purpose:  item.listingType === "Rent" ? "rent" : "sale",
    featured: item.isFeatured,
    liked:    false,
    price, priceUnit,
    title:    item.title,
    location: `${item.address}, ${item.city}`,
    beds:     item.bedrooms  ?? 0,
    baths:    item.bathrooms ?? 0,
    area:     item.area      ?? 0,
  };
}

/* ── Skeleton cards ──────────────────────────────────────── */
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

/* ── Main export with Suspense ───────────────────────────── */
export default function PropertyListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]"><Navbar /></div>}>
      <PropertyListingContent />
    </Suspense>
  );
}

/* ── Inner content ───────────────────────────────────────── */
function PropertyListingContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const urlType      = searchParams.get("type"); // "sale" | "rent" | null

  /* ── UI state ── */
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sort,             setSort]             = useState("newest");
  const [currentPage,      setCurrentPage]      = useState(1);

  /* ── Data state ── */
  const [properties,  setProperties]  = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [apiError,    setApiError]    = useState("");

  /* ── Active filters (set when user hits Apply) ── */
  const [activeFilters, setActiveFilters] = useState({
    city:         "",
    listingType:  urlType === "rent" ? "Rent" : urlType === "sale" ? "Sale" : "",
    propertyType: "",
    minPrice:     "",
    maxPrice:     "",
    bedrooms:     "",
  });

  /* ── Sync listing type from URL ── */
  useEffect(() => {
    setActiveFilters(prev => ({
      ...prev,
      listingType: urlType === "rent" ? "Rent" : urlType === "sale" ? "Sale" : "",
    }));
    setCurrentPage(1);
  }, [urlType]);

  /* ── Fetch whenever filters, sort, or page changes ── */
  const fetchProperties = useCallback(async (filters, page, sortVal) => {
    setIsLoading(true);
    setApiError("");
    try {
      // Build params — only include non-empty values
      const params = { page, limit: ITEMS_PER_PAGE };
      if (filters.city         && filters.city !== "All Cities") params.city         = filters.city;
      if (filters.listingType)  params.listingType  = filters.listingType;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice)     params.minPrice     = filters.minPrice;
      if (filters.maxPrice)     params.maxPrice     = filters.maxPrice;
      if (filters.bedrooms)     params.bedrooms     = filters.bedrooms;

      // Sort mapping
      if (sortVal === "price_asc")   params.sort = "price_asc";
      if (sortVal === "price_desc")  params.sort = "price_desc";
      if (sortVal === "most_viewed") params.sort = "views_desc";

      const res  = await axiosClient.get("/properties", { params });
      const data = res.data?.data || res.data || [];
      setProperties(Array.isArray(data) ? data.map(mapProperty) : []);
      setTotalCount(res.data?.total ?? (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to load properties.");
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* Trigger fetch when deps change */
  useEffect(() => {
    fetchProperties(activeFilters, currentPage, sort);
  }, [activeFilters, currentPage, sort, fetchProperties]);

  /* ── Handlers ── */
  function handleApplyFilters(sidebarFilters) {
    // Map sidebar state to API params
    const propertyType = sidebarFilters.selectedTypes?.length === 1
      ? sidebarFilters.selectedTypes[0]
      : "";
    const listingType =
      sidebarFilters.listingType === "sale" ? "Sale" :
      sidebarFilters.listingType === "rent" ? "Rent" : "";
    const city = sidebarFilters.city !== "All Cities" ? sidebarFilters.city : "";

    setActiveFilters({
      city,
      listingType,
      propertyType,
      minPrice: sidebarFilters.minPrice || "",
      maxPrice: sidebarFilters.maxPrice || "",
      bedrooms: sidebarFilters.beds    || "",
    });
    setCurrentPage(1);
  }

  function handleSortChange(val) {
    setSort(val);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleResetFilters() {
    setActiveFilters({ city:"", listingType:"", propertyType:"", minPrice:"", maxPrice:"", bedrooms:"" });
    setCurrentPage(1);
    router.push("/properties");
  }

  /* ── Page heading ── */
  const heading    = urlType === "sale" ? "Properties For Sale"
                   : urlType === "rent" ? "Properties For Rent"
                   : "All Properties";
  const subheading = urlType === "sale" ? "Find your dream property to buy"
                   : urlType === "rent" ? "Find the perfect rental property"
                   : "Browse verified listings across Pakistan";

  /* ── Active filter chips for display ── */
  const hasActiveFilters = Object.values(activeFilters).some(v => !!v);
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="bg-[#0F172A] px-6 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
            <a href="/" className="hover:text-[#F59E0B] transition-colors">Home</a>
            <span>›</span>
            <span className="text-[#94A3B8]">Properties</span>
            {urlType && (
              <>
                <span>›</span>
                <span className="text-[#94A3B8] capitalize">
                  {urlType === "sale" ? "For Sale" : "For Rent"}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{heading}</h1>
          <p className="text-[#94A3B8] text-sm">{subheading}</p>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* Filter sidebar */}
          <FilterSidebar
            initialListingType={urlType === "rent" ? "rent" : urlType === "sale" ? "sale" : "all"}
            onApply={handleApplyFilters}
            onListingTypeChange={type => {
              if (type === "all")       router.push("/properties");
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
              total={isLoading ? "..." : totalCount}
              sort={sort}
              onSortChange={handleSortChange}
              onFilterOpen={() => setMobileFilterOpen(true)}
            />

            {/* API error */}
            {apiError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                <span>⚠️</span> {apiError}
                <button onClick={() => fetchProperties(activeFilters, currentPage, sort)}
                  className="ml-auto text-xs font-semibold underline">Retry</button>
              </div>
            )}

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5 items-center">
                {activeFilters.listingType && (
                  <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                    For {activeFilters.listingType}
                  </span>
                )}
                {activeFilters.propertyType && (
                  <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                    {activeFilters.propertyType}
                  </span>
                )}
                {activeFilters.city && (
                  <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                    📍 {activeFilters.city}
                  </span>
                )}
                {activeFilters.bedrooms && (
                  <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                    🛏 {activeFilters.bedrooms} Beds
                  </span>
                )}
                {activeFilters.minPrice && (
                  <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                    Min PKR {Number(activeFilters.minPrice).toLocaleString()}
                  </span>
                )}
                {activeFilters.maxPrice && (
                  <span className="bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full">
                    Max PKR {Number(activeFilters.maxPrice).toLocaleString()}
                  </span>
                )}
                <button onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#64748B] hover:text-red-500 transition-colors ml-1">
                  ✕ Clear all
                </button>
              </div>
            )}

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Property grid */}
            {!isLoading && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && properties.length === 0 && !apiError && (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#E2E8F0]">
                <span className="text-6xl mb-4">🔍</span>
                <p className="text-lg font-bold text-[#0F172A] mb-2">No properties found</p>
                <p className="text-sm text-[#64748B] mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results."
                    : "No properties available at the moment."}
                </p>
                {hasActiveFilters && (
                  <button onClick={handleResetFilters}
                    className="text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
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
