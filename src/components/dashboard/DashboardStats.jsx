export default function DashboardStats({ stats }) {
  const dynamicStats = [
    {
      icon: "🏠",
      label: "Total Listings",
      value: stats?.stats?.totalProperties?.toString() || "0",
      change: "All time",
      positive: null,
      accent: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      icon: "👁️",
      label: "Total Views",
      value: stats?.stats?.totalViews?.toLocaleString() || "0",
      change: "All time",
      positive: null,
      accent: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      icon: "💬",
      label: "New Inquiries",
      value: stats?.stats?.totalInquiries?.toString() || "0",
      change: "All time",
      positive: null,
      accent: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      icon: "✅",
      label: "Properties Sold",
      value: stats?.statusBreakdown?.sold?.toString() || "0",
      change: "All time",
      positive: null,
      accent: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {dynamicStats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-start gap-4"
        >
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-xl shrink-0`}>
            {s.icon}
          </div>

          {/* Text */}
          <div className="min-w-0">
            <p className="text-xs text-[#94A3B8] font-semibold mb-1 truncate">{s.label}</p>
            <p className="text-2xl font-extrabold text-[#0F172A] leading-none mb-1">{s.value}</p>
            <p className={`text-[11px] font-semibold ${
              s.positive === true  ? "text-[#0F6E56]" :
              s.positive === false ? "text-red-500"   : "text-amber-500"
            }`}>
              {s.positive === true && "↑ "}{s.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
