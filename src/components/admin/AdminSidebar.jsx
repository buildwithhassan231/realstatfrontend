"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { icon: "📊", label: "Overview",           href: "/admin"             },
  { icon: "👥", label: "Manage Users",        href: "/admin/users"       },
  { icon: "🏠", label: "Manage Properties",   href: "/admin/properties"  },
  { icon: "💬", label: "Manage Inquiries",    href: "/admin/inquiries"   },
  { icon: "🏷️", label: "Categories",          href: "/admin/categories"  },
  { icon: "⚙️", label: "Settings",            href: "/admin/settings"    },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="w-[240px] shrink-0 min-h-screen bg-[#0F172A] flex flex-col sticky top-0 z-40">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <Link href="/">
          <span className="text-[#F59E0B] text-xl font-extrabold tracking-tight">
            Prop<span className="text-white">Find</span>
          </span>
        </Link>
      </div>

      {/* Admin profile */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-sm font-extrabold text-[#0F172A] shrink-0 select-none">
          AD
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-bold truncate">Super Admin</p>
          <span className="inline-block bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold px-2 py-[1px] rounded-full mt-[2px]">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-[10px] rounded-xl text-sm font-medium transition-all duration-150
                ${active
                  ? "bg-[#F59E0B] text-[#0F172A] font-bold"
                  : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-white"}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-[10px] rounded-xl text-sm font-medium text-[#64748B] hover:bg-white/[0.05] hover:text-red-400 transition-all duration-150">
          <span className="text-base w-5 text-center">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
