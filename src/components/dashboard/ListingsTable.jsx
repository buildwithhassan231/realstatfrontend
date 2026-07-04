"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/dashboard/StatusBadge";

/* ── Helpers ─────────────────────────────────────────────── */
function typeEmoji(type) {
  return { House:"🏡", Apartment:"🏢", Villa:"🏖️", Plot:"🏗️", Commercial:"🏪" }[type] || "🏠";
}

function formatPrice(price, listingType) {
  if (!price) return "—";
  const n = Number(price);
  let label;
  if (n >= 10000000)    label = `PKR ${(n / 10000000).toFixed(1)} Cr`;
  else if (n >= 100000) label = `PKR ${(n / 100000).toFixed(0)} Lac`;
  else                  label = `PKR ${n.toLocaleString()}`;
  return listingType === "Rent" ? `${label}/mo` : label;
}

const APPROVAL_CFG = {
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

/* ── Component ───────────────────────────────────────────── */
export default function ListingsTable({ listings = [], isLoading = false, error = "" }) {
  const router = useRouter();

  // Show only the 5 most recent on the dashboard
  const recent = [...listings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">My Listings</h2>
          <p className="text-xs text-[#94A3B8] mt-[2px]">
            {isLoading ? "Loading..." : `${listings.length} propert${listings.length !== 1 ? "ies" : "y"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/add"
            className="flex items-center gap-1 bg-[#F59E0B] text-[#0F172A] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#D97706] transition-colors no-underline">
            ➕ Add New
          </Link>
          <Link href="/dashboard/listings"
            className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors no-underline whitespace-nowrap">
            View all →
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <div className="w-6 h-6 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#94A3B8]">Loading listings...</span>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex items-center gap-2 mx-6 my-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && recent.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                {["Property", "Price", "Type", "Status", "Approval", "Views", "Actions"].map(h => (
                  <th key={h}
                    className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {recent.map(l => {
                const id    = l._id || l.id;
                const img   = l.images?.[0]?.url;
                const emoji = typeEmoji(l.propertyType);
                const price = formatPrice(l.price, l.listingType);
                return (
                  <tr key={id} className="hover:bg-[#F8FAFC] transition-colors group">

                    {/* Property */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] flex items-center justify-center">
                          {img
                            ? <img src={img} alt={l.title} className="w-full h-full object-cover" />
                            : <span className="text-lg">{emoji}</span>}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-[#1E293B] max-w-[160px] truncate block">
                            {l.title}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">{l.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3 font-bold text-[#0F172A] whitespace-nowrap">{price}</td>

                    {/* Type */}
                    <td className="px-5 py-3">
                      <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold px-2 py-[3px] rounded-md whitespace-nowrap">
                        {l.propertyType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <StatusBadge status={l.status} />
                    </td>

                    {/* Approval */}
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-bold px-[10px] py-1 rounded-full border capitalize whitespace-nowrap
                        ${APPROVAL_CFG[l.approvalStatus] || APPROVAL_CFG.pending}`}>
                        {l.approvalStatus === "pending"  ? "⏳ Pending"  :
                         l.approvalStatus === "approved" ? "✅ Approved" : "❌ Rejected"}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-5 py-3 text-[#64748B] whitespace-nowrap">
                      👁️ {l.views ?? 0}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          title="Edit"
                          onClick={() => router.push(`/dashboard/edit-property/${id}`)}
                          className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-amber-50 hover:text-amber-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
                          ✏️
                        </button>
                        <Link href={`/properties/${id}`}
                          title="View"
                          className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-blue-50 hover:text-blue-600 text-[#64748B] flex items-center justify-center transition-colors text-sm no-underline">
                          👁️
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && recent.length === 0 && (
        <div className="flex flex-col items-center py-14 text-center">
          <span className="text-5xl mb-3">🏠</span>
          <p className="font-bold text-[#0F172A]">No listings yet</p>
          <p className="text-sm text-[#64748B] mt-1 mb-4">Add your first property to get started.</p>
          <Link href="/dashboard/add"
            className="bg-[#F59E0B] text-[#0F172A] text-xs font-bold px-5 py-2 rounded-xl hover:bg-[#D97706] transition-colors no-underline">
            + Add Property
          </Link>
        </div>
      )}
    </div>
  );
}
