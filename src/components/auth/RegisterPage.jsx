"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ── Constants ─────────────────────────────────────────── */
const FEATURES = [
  { icon: "🏠", text: "Post Properties instantly" },
  { icon: "💬", text: "Manage Inquiries in one place" },
  { icon: "❤️", text: "Save Favourites & compare" },
];

const CITIES = [
  "Select City",
  "Karachi", "Lahore", "Islamabad", "Rawalpindi",
  "Faisalabad", "Multan", "Peshawar", "Quetta",
  "Hyderabad", "Sialkot",
];

const inputCls =
  "w-full border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1]";

const errInputCls =
  "w-full border border-red-300 rounded-xl pl-10 pr-4 py-[11px] text-sm text-[#1E293B] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-[#CBD5E1]";

/* ── Password strength helper ──────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = [
    { label: "Too short", color: "bg-red-400" },
    { label: "Weak",      color: "bg-red-400" },
    { label: "Fair",      color: "bg-amber-400" },
    { label: "Good",      color: "bg-yellow-400" },
    { label: "Strong",    color: "bg-[#0F6E56]" },
  ];
  return { score, ...map[score] };
}

/* ── Reusable labelled field wrapper ───────────────────── */
function Field({ label, id, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-[6px]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-500 mt-[5px] flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ── Main component ────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole]     = useState("buyer");
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "",     phone: "",
    password: "",  confirmPassword: "",
    agencyName: "", city: "Select City",
  });

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim())               e.firstName = "Required";
    if (!form.lastName.trim())                e.lastName  = "Required";
    if (!form.email.includes("@"))            e.email     = "Valid email required";
    if (form.phone.length < 10)               e.phone     = "Valid number required";
    if (form.password.length < 8)             e.password  = "Min. 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (role === "agent") {
      if (!form.agencyName.trim())            e.agencyName = "Required";
      if (form.city === "Select City")        e.city       = "Select a city";
    }
    if (!agreed) e.terms = "Please agree to continue";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email,
        password: form.password,
        phoneNumber: form.phone.replace(/\s+/g, "").replace("+", ""),
        role,
        ...(role === "agent" && { agencyName: form.agencyName, city: form.city }),
      };
      const userData = await register(payload);
      if (userData.role === "admin")       router.replace("/admin");
      else if (userData.role === "agent")  router.replace("/dashboard");
      else router.replace("/"); // buyer → homepage
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ══ LEFT — branding panel (identical to Login) ══════ */}
      <div
        className="relative lg:w-[48%] flex flex-col justify-between px-10 py-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0F172A 0%, #1E3A5F 60%, #0F6E56 100%)" }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Blobs */}
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
            Join <br className="hidden sm:block" />
            <span className="text-[#F59E0B]">PropFind.</span>
          </h1>

          <p className="text-[#94A3B8] text-[15px] leading-relaxed mb-10 max-w-sm">
            Create your free account and start exploring Pakistan&apos;s most trusted property platform.
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

        {/* Trust badge */}
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

      {/* ══ RIGHT — form panel ══════════════════════════════ */}
      <div className="flex-1 flex items-start justify-center bg-white px-6 py-12 sm:px-10 overflow-y-auto">
        <div className="w-full max-w-[520px]">

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-[#0F172A] mb-1">
              Create your account
            </h2>
            <p className="text-sm text-[#64748B]">
              Join Pakistan&apos;s #1 property platform — it&apos;s free
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-7 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            {[
              { value: "buyer", emoji: "🏠", label: "I'm a Buyer" },
              { value: "agent", emoji: "🤝", label: "I'm an Agent" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setRole(opt.value); setErrors({}); }}
                className={`flex items-center justify-center gap-2 py-[10px] rounded-lg text-sm font-bold transition-all duration-150
                  ${role === opt.value
                    ? "bg-white border-2 border-[#F59E0B] text-[#0F172A] shadow-sm"
                    : "border-2 border-transparent text-[#94A3B8] hover:text-[#475569]"
                  }`}
              >
                <span>{opt.emoji}</span> {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* API error banner */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span>⚠️</span> {apiError}
              </div>
            )}

            {/* ── Row 1: First Name + Last Name ─────────── */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" id="firstName" error={errors.firstName}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">👤</span>
                  <input
                    id="firstName" name="firstName" type="text"
                    value={form.firstName} onChange={handleChange}
                    placeholder="Hassan"
                    autoComplete="given-name"
                    className={errors.firstName ? errInputCls : inputCls}
                  />
                </div>
              </Field>

              <Field label="Last Name" id="lastName" error={errors.lastName}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">👤</span>
                  <input
                    id="lastName" name="lastName" type="text"
                    value={form.lastName} onChange={handleChange}
                    placeholder="Ali"
                    autoComplete="family-name"
                    className={errors.lastName ? errInputCls : inputCls}
                  />
                </div>
              </Field>
            </div>

            {/* ── Row 2: Email + Phone ───────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email Address" id="email" error={errors.email}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">✉️</span>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={errors.email ? errInputCls : inputCls}
                  />
                </div>
              </Field>

              <Field label="Phone Number" id="phone" error={errors.phone}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">📞</span>
                  <input
                    id="phone" name="phone" type="tel"
                    value={form.phone} onChange={handleChange}
                    placeholder="+92 300 0000000"
                    autoComplete="tel"
                    className={errors.phone ? errInputCls : inputCls}
                  />
                </div>
              </Field>
            </div>

            {/* ── Agent-only Row: Agency + City ─────────── */}
            {role === "agent" && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Agency Name" id="agencyName" error={errors.agencyName}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">🏢</span>
                    <input
                      id="agencyName" name="agencyName" type="text"
                      value={form.agencyName} onChange={handleChange}
                      placeholder="DHA Properties"
                      className={errors.agencyName ? errInputCls : inputCls}
                    />
                  </div>
                </Field>

                <Field label="City" id="city" error={errors.city}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">📍</span>
                    <select
                      id="city" name="city"
                      value={form.city} onChange={handleChange}
                      className={`${errors.city ? errInputCls : inputCls} appearance-none cursor-pointer pr-8`}
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c} disabled={c === "Select City"}>{c}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-xs">▾</span>
                  </div>
                </Field>
              </div>
            )}

            {/* ── Row 3: Password + Confirm Password ────── */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Password" id="password" error={errors.password}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">🔒</span>
                  <input
                    id="password" name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 8 chars"
                    autoComplete="new-password"
                    className={`${errors.password ? errInputCls : inputCls} pr-11`}
                  />
                  <button
                    type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                    aria-label={showPw ? "Hide" : "Show"}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-[6px]">
                    <div className="flex gap-1 mb-[3px]">
                      {[0,1,2,3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength.score ? strength.color : "bg-[#E2E8F0]"}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-semibold ${
                      strength.score <= 1 ? "text-red-400" :
                      strength.score === 2 ? "text-amber-500" :
                      strength.score === 3 ? "text-yellow-500" : "text-[#0F6E56]"
                    }`}>{strength.label}</p>
                  </div>
                )}
              </Field>

              <Field label="Confirm Password" id="confirmPassword" error={errors.confirmPassword}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">🔐</span>
                  <input
                    id="confirmPassword" name="confirmPassword"
                    type={showCpw ? "text" : "password"}
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={`${errors.confirmPassword ? errInputCls : inputCls} pr-16`}
                  />
                  {/* Match tick */}
                  {form.confirmPassword && (
                    <span className="absolute right-9 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                      {form.password === form.confirmPassword ? "✅" : "❌"}
                    </span>
                  )}
                  <button
                    type="button" onClick={() => setShowCpw(!showCpw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                    aria-label={showCpw ? "Hide" : "Show"}
                  >
                    {showCpw ? "🙈" : "👁️"}
                  </button>
                </div>
              </Field>
            </div>

            {/* ── Terms ─────────────────────────────────── */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox" checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, terms: "" })); }}
                  className="w-4 h-4 mt-[2px] rounded accent-[#F59E0B] shrink-0 cursor-pointer"
                />
                <span className="text-sm text-[#475569] leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-[#F59E0B] font-semibold hover:text-[#D97706] transition-colors">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#F59E0B] font-semibold hover:text-[#D97706] transition-colors">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-[11px] text-red-500 mt-1 ml-7 flex items-center gap-1">
                  <span>⚠</span> {errors.terms}
                </p>
              )}
            </div>

            {/* ── Submit ────────────────────────────────── */}
            <button
              type="submit" disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-150
                ${loading
                  ? "bg-[#FCD34D] text-[#92400E] cursor-not-allowed"
                  : "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706] active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                `Create ${role === "agent" ? "Agent " : ""}Account →`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8] font-medium whitespace-nowrap">or continue with</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-[#E2E8F0] rounded-xl py-[11px] text-sm font-semibold text-[#1E293B] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-150 active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M44.5 20H24v8.5h11.7C34.2 33.6 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.4 6.5 29.5 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20-8 20-20.5 0-1.4-.1-2.7-.5-5z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15 16.1 19.1 13.5 24 13.5c3 0 5.7 1.1 7.8 2.9l6-6C34.4 6.5 29.5 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z" fill="#FF3D00"/>
              <path d="M24 45.5c5.4 0 10.2-1.9 13.9-5l-6.4-5.4C29.5 37 26.9 38 24 38c-5.5 0-10.2-3.7-11.8-8.8l-7 5.4C8.2 41.3 15.5 45.5 24 45.5z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.7c-.8 2.3-2.3 4.2-4.3 5.6l6.4 5.4C41.5 36.2 44.5 31 44.5 25c0-1.4-.1-2.7-.5-5z" fill="#1976D2"/>
            </svg>
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F59E0B] font-bold hover:text-[#D97706] transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
