"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  { icon: "🏠", text: "Post Properties instantly" },
  { icon: "💬", text: "Manage Inquiries in one place" },
  { icon: "❤️", text: "Save Favourites & compare" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  function handleChange(e) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const userData = await login({ email: form.email, password: form.password });
      if (userData.role === "admin")  router.replace("/admin");
      else if (userData.role === "agent") router.replace("/dashboard");
      else router.replace("/"); // buyer → homepage
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left branding panel ────────────────────────────── */}
      <div
        className="relative lg:w-[48%] flex flex-col justify-between px-10 py-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0F172A 0%, #1E3A5F 60%, #0F6E56 100%)" }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#F59E0B] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-[#0F6E56] opacity-[0.12] blur-3xl" />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12">
            <span className="text-[#F59E0B] text-2xl font-extrabold tracking-tight">
              Prop<span className="text-white">Find</span>
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Welcome <br className="hidden sm:block" />
            <span className="text-[#F59E0B]">Back.</span>
          </h1>

          <p className="text-[#94A3B8] text-[15px] leading-relaxed mb-10 max-w-sm">
            Login to access your dashboard, saved properties and inquiries — all in one place.
          </p>

          {/* Feature bullets */}
          <ul className="flex flex-col gap-4">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-base shrink-0">
                  {f.icon}
                </span>
                <span className="text-sm text-[#CBD5E1] font-medium">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom trust badge */}
        <div className="relative z-10 mt-12 lg:mt-0">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-white text-xs font-bold">Pakistan&apos;s #1 Platform</p>
              <p className="text-[#64748B] text-[10px]">500+ verified listings · 200+ agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">

          {/* Form heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#0F172A] mb-1">
              Login to your account
            </h2>
            <p className="text-sm text-[#64748B]">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-base pointer-events-none">
                  ✉️
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-[6px]">
                <label
                  htmlFor="password"
                  className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-base pointer-events-none">
                  🔒
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-[#E2E8F0] rounded-xl pl-10 pr-11 py-[11px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1]"
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors text-sm font-medium"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[#F59E0B] cursor-pointer"
              />
              <span className="text-sm text-[#475569]">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-150
                ${loading
                  ? "bg-[#FCD34D] text-[#92400E] cursor-not-allowed"
                  : "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706] active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8] font-medium whitespace-nowrap">
              or continue with
            </span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-[#E2E8F0] rounded-xl py-[11px] text-sm font-semibold text-[#1E293B] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-150 active:scale-[0.98]"
          >
            {/* Google SVG icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M44.5 20H24v8.5h11.7C34.2 33.6 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.4 6.5 29.5 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20-8 20-20.5 0-1.4-.1-2.7-.5-5z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15 16.1 19.1 13.5 24 13.5c3 0 5.7 1.1 7.8 2.9l6-6C34.4 6.5 29.5 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z" fill="#FF3D00"/>
              <path d="M24 45.5c5.4 0 10.2-1.9 13.9-5l-6.4-5.4C29.5 37 26.9 38 24 38c-5.5 0-10.2-3.7-11.8-8.8l-7 5.4C8.2 41.3 15.5 45.5 24 45.5z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.7c-.8 2.3-2.3 4.2-4.3 5.6l6.4 5.4C41.5 36.2 44.5 31 44.5 25c0-1.4-.1-2.7-.5-5z" fill="#1976D2"/>
            </svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-[#64748B] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#F59E0B] font-bold hover:text-[#D97706] transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
