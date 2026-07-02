"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  RiMapPinLine, RiBuildingLine, RiCalendarLine, RiMoneyDollarCircleLine,
  RiCheckLine, RiCheckDoubleLine, RiStarFill, RiPhoneLine, RiExternalLinkLine,
  RiInformationLine, RiArrowRightLine, RiLoader4Line, RiHome2Line,
  RiWaterFlashFill, RiRunLine, RiCarLine, RiShieldLine, RiBuildingFill,
  RiGroupLine, RiPlayCircleLine, RiParkingBoxLine, RiCameraLine,
  RiLightbulbLine, RiSunLine, RiBuilding2Line, RiCloseLine,
  RiSchoolLine, RiHospitalLine, RiShoppingBagLine, RiTrainLine, RiRestaurantLine,
  RiBankLine, RiUser3Line,
} from "react-icons/ri";

/* ══════════════════════════════════════════════════════════
   SAMPLE DATA
══════════════════════════════════════════════════════════ */
const sampleProjects = {
  "1": {
    id: "1", name: "Pearl Heights", emoji: "🏢",
    developerName: "Arif Habib Developers", developerVerified: true,
    developerProjects: 12, developerYears: 18,
    description: "Pearl Heights is a landmark luxury high-rise development offering panoramic sea views from the heart of DHA Phase 8, Karachi. Designed by award-winning architects, this 24-storey tower features meticulously crafted apartments with floor-to-ceiling glass facades, premium imported finishes, and smart-home automation. Every unit is designed to maximize natural light and ventilation while delivering unmatched views of the Arabian Sea. Residents enjoy a five-star lifestyle with world-class amenities including a rooftop infinity pool, fully-equipped gymnasium, dedicated children's play zones, and 24/7 concierge services. Pearl Heights represents the pinnacle of urban living in Pakistan's most prestigious real estate address.",
    location: "DHA Phase 8", city: "Karachi",
    totalUnits: 320, floors: 24,
    completionDate: "Dec 2026", launchDate: "Jan 2024",
    priceMin: "PKR 85 Lac", priceMax: "PKR 2.5 Cr",
    projectType: "Residential", status: "Under Construction", isFeatured: true,
    gradientFrom: "#1E3A5F", gradientTo: "#0F6E56",
    amenities: ["Swimming Pool","Gym","Parking","Security","Mosque","Community Center","Kids Play Area","Underground Parking","CCTV","Generator","Solar","Rooftop"],
    floorPlans: [
      { type: "Studio", size: 450, price: "PKR 45 Lac", bedrooms: 0 },
      { type: "1 Bed",  size: 750, price: "PKR 85 Lac", bedrooms: 1 },
      { type: "2 Bed",  size: 1200, price: "PKR 1.5 Cr", bedrooms: 2 },
    ],
    paymentPlan: { downPayment: "20%", installmentMonths: 48, bookingAmount: "PKR 5 Lac" },
    nearbyPlaces: [
      { name: "Karachi Grammar School", distance: "0.8 km", type: "School" },
      { name: "Aga Khan Hospital",       distance: "2.1 km", type: "Hospital" },
      { name: "Ocean Mall",              distance: "1.5 km", type: "Mall" },
      { name: "DHA Metro Station",       distance: "0.5 km", type: "Metro" },
      { name: "BBQ Tonight",             distance: "0.3 km", type: "Restaurant" },
    ],
  },
  "2": {
    id: "2", name: "Green Valley Town", emoji: "🏡",
    developerName: "Bahria Town", developerVerified: true,
    developerProjects: 18, developerYears: 25,
    description: "Green Valley Town is an exclusive gated villa community nestled within the lush greenery of Bahria Town Lahore. Spanning over 200 acres, this premium development features carefully designed 5 and 7 Marla villas with traditional and modern architectural styles. Wide tree-lined boulevards, community parks, and recreational facilities make Green Valley Town the ideal family-friendly neighbourhood. Each villa comes with a dedicated parking space, manicured garden, and direct access to Bahria's world-class infrastructure including hospitals, schools, and shopping centres. With all plots fully developed and possession available, this is a ready-to-move community for discerning buyers.",
    location: "Bahria Town", city: "Lahore",
    totalUnits: 150, floors: 2,
    completionDate: "Ready", launchDate: "Mar 2021",
    priceMin: "PKR 1.8 Cr", priceMax: "PKR 6 Cr",
    projectType: "Residential", status: "Ready to Move", isFeatured: true,
    gradientFrom: "#854F0B", gradientTo: "#F59E0B",
    amenities: ["Swimming Pool","Gym","Parking","Security","Mosque","Community Center","Kids Play Area","CCTV","Generator","Solar","Rooftop"],
    floorPlans: [
      { type: "5 Marla",  size: 1125, price: "PKR 1.8 Cr", bedrooms: 3 },
      { type: "7 Marla",  size: 1575, price: "PKR 2.8 Cr", bedrooms: 4 },
      { type: "10 Marla", size: 2250, price: "PKR 4.5 Cr", bedrooms: 5 },
    ],
    paymentPlan: { downPayment: "30%", installmentMonths: 36, bookingAmount: "PKR 10 Lac" },
    nearbyPlaces: [
      { name: "Bahria Town School",     distance: "0.4 km", type: "School" },
      { name: "Bahria International Hospital", distance: "1.2 km", type: "Hospital" },
      { name: "Bahria Town Mall",       distance: "0.9 km", type: "Mall" },
      { name: "Thokar Niaz Baig Metro", distance: "3.5 km", type: "Metro" },
      { name: "Monal Restaurant",       distance: "2.0 km", type: "Restaurant" },
    ],
  },
  "3": {
    id: "3", name: "Blue Coral Residency", emoji: "🏙️",
    developerName: "Nespak Builders", developerVerified: false,
    developerProjects: 8, developerYears: 10,
    description: "Blue Coral Residency is a contemporary smart apartment complex located in the prestigious F-10 Markaz, Islamabad. This 18-storey development offers spacious 1, 2, and 3 bedroom apartments equipped with integrated home automation systems, energy-efficient double-glazed windows, and premium European kitchen fittings. The building's iconic blue-tinted glass facade pays homage to Islamabad's clear skies while offering stunning views of the Margalla Hills from upper floors. Located within walking distance of major government offices, embassies, and shopping centres, Blue Coral Residency is the smart choice for professionals and families seeking convenience, security, and modern comfort in Pakistan's capital.",
    location: "F-10 Markaz", city: "Islamabad",
    totalUnits: 200, floors: 18,
    completionDate: "Mar 2027", launchDate: "Sep 2024",
    priceMin: "PKR 1.2 Cr", priceMax: "PKR 3.5 Cr",
    projectType: "Residential", status: "Launching Soon", isFeatured: false,
    gradientFrom: "#185FA5", gradientTo: "#0C447C",
    amenities: ["Swimming Pool","Gym","Parking","Security","Mosque","Kids Play Area","Underground Parking","CCTV","Generator","Solar"],
    floorPlans: [
      { type: "1 Bed",  size: 800,  price: "PKR 1.2 Cr", bedrooms: 1 },
      { type: "2 Bed",  size: 1300, price: "PKR 2.1 Cr", bedrooms: 2 },
      { type: "3 Bed",  size: 1900, price: "PKR 3.2 Cr", bedrooms: 3 },
    ],
    paymentPlan: { downPayment: "15%", installmentMonths: 60, bookingAmount: "PKR 7 Lac" },
    nearbyPlaces: [
      { name: "Islamabad Model School", distance: "0.6 km", type: "School" },
      { name: "PIMS Hospital",           distance: "1.8 km", type: "Hospital" },
      { name: "Centaurus Mall",          distance: "2.2 km", type: "Mall" },
      { name: "F-10 Metro Station",      distance: "0.7 km", type: "Metro" },
      { name: "Tuscany Courtyard",       distance: "0.4 km", type: "Restaurant" },
    ],
  },
  "4": {
    id: "4", name: "Silver Palms", emoji: "🏖️",
    developerName: "DHA Developers", developerVerified: true,
    developerProjects: 24, developerYears: 30,
    description: "Silver Palms is an ultra-luxury villa enclave set within DHA Phase 6, Lahore's most prestigious residential corridor. Each of the 80 meticulously designed villas comes with a private swimming pool, landscaped garden, three-car garage, and dedicated servant quarters. The architectural language seamlessly blends contemporary minimalism with classical palatial elements, resulting in homes that are as striking as they are liveable. Security is paramount — residents benefit from a triple-layer gated perimeter with 24/7 CCTV monitoring and dedicated security personnel. Silver Palms is not merely a home, it is a statement of status, designed for Pakistan's most discerning families who refuse to compromise on space, privacy, or prestige.",
    location: "DHA Phase 6", city: "Lahore",
    totalUnits: 80, floors: 3,
    completionDate: "Jun 2026", launchDate: "Feb 2023",
    priceMin: "PKR 3 Cr", priceMax: "PKR 9 Cr",
    projectType: "Residential", status: "Under Construction", isFeatured: true,
    gradientFrom: "#6D28D9", gradientTo: "#4C1D95",
    amenities: ["Swimming Pool","Gym","Parking","Security","Mosque","Community Center","Kids Play Area","Underground Parking","CCTV","Generator","Solar","Rooftop"],
    floorPlans: [
      { type: "5 Marla Villa",  size: 1125, price: "PKR 3 Cr", bedrooms: 4 },
      { type: "10 Marla Villa", size: 2250, price: "PKR 5.5 Cr", bedrooms: 5 },
      { type: "1 Kanal Villa",  size: 4500, price: "PKR 9 Cr", bedrooms: 7 },
    ],
    paymentPlan: { downPayment: "25%", installmentMonths: 36, bookingAmount: "PKR 15 Lac" },
    nearbyPlaces: [
      { name: "LGS DHA Campus",        distance: "0.9 km", type: "School" },
      { name: "DHA Hospital",          distance: "1.5 km", type: "Hospital" },
      { name: "DHA Lahore Commercial", distance: "0.6 km", type: "Mall" },
      { name: "Gaddafi Stadium Metro", distance: "4.1 km", type: "Metro" },
      { name: "Café Aylanto",          distance: "1.2 km", type: "Restaurant" },
    ],
  },
  "5": {
    id: "5", name: "The Commercial Hub", emoji: "🏪",
    developerName: "Metro Realty Group", developerVerified: true,
    developerProjects: 15, developerYears: 20,
    description: "The Commercial Hub is a premium Grade-A commercial development strategically positioned on Main Boulevard Lahore, the city's busiest business artery. Spanning 10 floors of sleek contemporary architecture, the building offers retail units on the lower floors, corporate offices on mid-levels, and premium showrooms at ground level. All units are delivered shell-and-core with 100% backup power, high-speed elevators, and centralised air conditioning. The development benefits from ample basement parking, 24/7 security, and direct road frontage, making it ideal for flagship stores, corporate head offices, and high-footfall businesses. With Lahore's commercial real estate market booming, The Commercial Hub offers exceptional investment yield potential.",
    location: "Main Boulevard", city: "Lahore",
    totalUnits: 120, floors: 10,
    completionDate: "Ready", launchDate: "Jan 2020",
    priceMin: "PKR 2 Cr", priceMax: "PKR 15 Cr",
    projectType: "Commercial", status: "Ready to Move", isFeatured: false,
    gradientFrom: "#BE185D", gradientTo: "#9D174D",
    amenities: ["Parking","Security","Underground Parking","CCTV","Generator","Solar","Community Center"],
    floorPlans: [
      { type: "Retail Unit",     size: 500,  price: "PKR 2 Cr",  bedrooms: 0 },
      { type: "Office Floor",    size: 2000, price: "PKR 7 Cr",  bedrooms: 0 },
      { type: "Showroom Space",  size: 3500, price: "PKR 14 Cr", bedrooms: 0 },
    ],
    paymentPlan: { downPayment: "40%", installmentMonths: 24, bookingAmount: "PKR 20 Lac" },
    nearbyPlaces: [
      { name: "Aitchison College",   distance: "1.0 km", type: "School" },
      { name: "Services Hospital",   distance: "2.4 km", type: "Hospital" },
      { name: "Packages Mall",       distance: "1.8 km", type: "Mall" },
      { name: "Gulberg Metro",       distance: "0.8 km", type: "Metro" },
      { name: "Andaaz Restaurant",   distance: "0.2 km", type: "Restaurant" },
    ],
  },
  "6": {
    id: "6", name: "Skyline Executive Tower", emoji: "🌆",
    developerName: "Arif Habib Developers", developerVerified: true,
    developerProjects: 12, developerYears: 18,
    description: "Skyline Executive Tower is a pioneering mixed-use skyscraper rising 30 floors above Blue Area, Islamabad's central business district. The tower's lower 12 floors house premium grade-A office suites and corporate headquarters, floors 13-22 offer luxury serviced apartments ideal for diplomats and executives, while the top 8 floors are reserved for exclusive penthouses with 360-degree views of the Margalla Hills and twin cities. The building incorporates Pakistan's most advanced smart building management systems, reducing energy consumption by 40% through solar integration and AI-driven HVAC controls. A sky lounge on the 28th floor, rooftop helipad, and five-star concierge services set Skyline apart as Islamabad's most ambitious and prestigious address.",
    location: "Blue Area", city: "Islamabad",
    totalUnits: 250, floors: 30,
    completionDate: "Sep 2027", launchDate: "Jun 2024",
    priceMin: "PKR 1.5 Cr", priceMax: "PKR 8 Cr",
    projectType: "Mixed Use", status: "Under Construction", isFeatured: true,
    gradientFrom: "#0369A1", gradientTo: "#075985",
    amenities: ["Swimming Pool","Gym","Parking","Security","Community Center","Underground Parking","CCTV","Generator","Solar","Rooftop"],
    floorPlans: [
      { type: "Office Suite",  size: 1000, price: "PKR 1.5 Cr", bedrooms: 0 },
      { type: "2 Bed Apt",     size: 1400, price: "PKR 4 Cr",   bedrooms: 2 },
      { type: "Penthouse",     size: 3500, price: "PKR 8 Cr",   bedrooms: 4 },
    ],
    paymentPlan: { downPayment: "20%", installmentMonths: 48, bookingAmount: "PKR 10 Lac" },
    nearbyPlaces: [
      { name: "Islamabad College",   distance: "0.5 km", type: "School" },
      { name: "Shifa International", distance: "1.3 km", type: "Hospital" },
      { name: "Centaurus Mall",      distance: "0.8 km", type: "Mall" },
      { name: "Blue Area Metro",     distance: "0.2 km", type: "Metro" },
      { name: "Monal",               distance: "3.5 km", type: "Restaurant" },
    ],
  },
};

/* ── Configs ─────────────────────────────────────────────── */
const STATUS_CFG = {
  "Under Construction": { cls: "bg-orange-500 text-white",          dot: "bg-orange-500" },
  "Ready to Move":      { cls: "bg-[#0F6E56] text-white",           dot: "bg-[#0F6E56]"  },
  "Launching Soon":     { cls: "bg-[#185FA5] text-white",           dot: "bg-[#185FA5]"  },
};

const AMENITY_CFG = {
  "Swimming Pool":      { icon: RiWaterFlashFill,    color: "bg-blue-100   text-blue-600"    },
  "Gym":                { icon: RiRunLine,          color: "bg-orange-100 text-orange-600"  },
  "Parking":            { icon: RiCarLine,          color: "bg-gray-100   text-gray-600"    },
  "Security":           { icon: RiShieldLine,       color: "bg-green-100  text-green-600"   },
  "Mosque":             { icon: RiBuildingFill,     color: "bg-teal-100   text-teal-600"    },
  "Community Center":   { icon: RiGroupLine,        color: "bg-indigo-100 text-indigo-600"  },
  "Kids Play Area":     { icon: RiPlayCircleLine,   color: "bg-pink-100   text-pink-600"    },
  "Underground Parking":{ icon: RiParkingBoxLine,   color: "bg-slate-100  text-slate-600"   },
  "CCTV":               { icon: RiCameraLine,       color: "bg-purple-100 text-purple-600"  },
  "Generator":          { icon: RiLightbulbLine,    color: "bg-yellow-100 text-yellow-600"  },
  "Solar":              { icon: RiSunLine,          color: "bg-lime-100   text-lime-600"    },
  "Rooftop":            { icon: RiBuilding2Line,    color: "bg-sky-100    text-sky-600"     },
};

const NEARBY_CFG = {
  School:     { icon: RiSchoolLine,      color: "bg-blue-100   text-blue-600",   dot: "bg-blue-500"   },
  Hospital:   { icon: RiHospitalLine,    color: "bg-red-100    text-red-600",    dot: "bg-red-500"    },
  Mall:       { icon: RiShoppingBagLine, color: "bg-purple-100 text-purple-600", dot: "bg-purple-500" },
  Metro:      { icon: RiTrainLine,       color: "bg-green-100  text-green-600",  dot: "bg-green-500"  },
  Restaurant: { icon: RiRestaurantLine,  color: "bg-orange-100 text-orange-600", dot: "bg-orange-500" },
};

const PAYMENT_ROWS = [
  { milestone: "Booking",               pct: "10%", amount: "PKR 5 Lac"  },
  { milestone: "On Foundation",         pct: "10%", amount: "PKR 5 Lac"  },
  { milestone: "During Construction",   pct: "40%", amount: "PKR 20 Lac" },
  { milestone: "On Handover",           pct: "40%", amount: "PKR 20 Lac" },
];

const TABS = [
  { id: "overview",     label: "Overview"      },
  { id: "floorplans",   label: "Floor Plans"   },
  { id: "amenities",    label: "Amenities"     },
  { id: "location",     label: "Location"      },
  { id: "paymentplan",  label: "Payment Plan"  },
];

/* ── Section heading ─────────────────────────────────────── */
function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1 h-6 rounded-full bg-[#F59E0B] shrink-0" />
      {Icon && <Icon className="text-[#F59E0B] text-xl shrink-0" />}
      <h2 className="text-lg font-extrabold text-[#0F172A]">{title}</h2>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();

  const [projectData,       setProjectData]       = useState(null);
  const [isLoading,         setIsLoading]         = useState(true);
  const [activeTab,         setActiveTab]         = useState("overview");
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [formSubmitted,     setFormSubmitted]     = useState(false);
  const [interestForm,      setInterestForm]      = useState({ name:"", email:"", phone:"", message:"" });

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = sampleProjects[String(id)];
      if (!data) { router.push("/projects"); return; }
      setProjectData(data);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, router]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <RiLoader4Line className="text-5xl text-[#F59E0B] animate-spin" />
          <p className="text-sm text-[#94A3B8] font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  const p = projectData;
  const statusCfg = STATUS_CFG[p.status] || STATUS_CFG["Under Construction"];
  const devInitials = p.developerName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  function handleFormSubmit(e) {
    e.preventDefault();
    setFormSubmitted(true);
    setShowInterestModal(true);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      {/* ══ BREADCRUMB ══════════════════════════════════════ */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-xs text-[#94A3B8] flex-wrap">
          <Link href="/" className="hover:text-[#F59E0B] transition-colors flex items-center gap-1">
            <RiHome2Line /> Home
          </Link>
          <span>›</span>
          <Link href="/projects" className="hover:text-[#F59E0B] transition-colors">Projects</Link>
          <span>›</span>
          <span className="font-bold text-[#0F172A] truncate max-w-[200px]">{p.name}</span>
        </div>
      </div>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="relative min-h-[420px] flex flex-col justify-between overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${p.gradientFrom} 0%, ${p.gradientTo} 100%)` }}>
        {/* grid overlay */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

        {/* content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-6 gap-4">
          {/* badges row */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className={`text-xs font-bold px-4 py-1 rounded-full ${statusCfg.cls}`}>{p.status}</span>
            {p.isFeatured && (
              <span className="flex items-center gap-1 bg-[#F59E0B] text-[#0F172A] text-xs font-bold px-4 py-1 rounded-full">
                <RiStarFill className="text-sm" /> Featured Project
              </span>
            )}
          </div>
          {/* emoji */}
          <div className="text-7xl select-none">{p.emoji}</div>
          {/* name */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">{p.name}</h1>
          {/* developer */}
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
            <RiBuildingLine />
            <span>{p.developerName}</span>
            {p.developerVerified && (
              <span className="flex items-center gap-1 bg-[#0F6E56] text-white text-[10px] font-bold px-2 py-[2px] rounded-full">
                <RiCheckLine /> Verified
              </span>
            )}
          </div>
        </div>

        {/* stats bar */}
        <div className="relative z-10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Units",  value: p.totalUnits },
              { label: "Floors",       value: p.floors },
              { label: "Completion",   value: p.completionDate },
              { label: "City",         value: p.city },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-white font-extrabold text-lg leading-none">{s.value}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUICK INFO CARDS ════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-3 relative z-10">
          {/* Card 1 — Price */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-md p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center shrink-0">
              <RiMoneyDollarCircleLine className="text-[#F59E0B] text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Starting From</p>
              <p className="text-sm font-extrabold text-[#0F172A] leading-tight mt-[2px]">{p.priceMin}</p>
              <p className="text-[11px] text-[#64748B]">to {p.priceMax}</p>
            </div>
          </div>
          {/* Card 2 — Type */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-md p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <RiBuildingLine className="text-blue-600 text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Project Type</p>
              <p className="text-sm font-extrabold text-[#0F172A] mt-[2px]">{p.projectType}</p>
            </div>
          </div>
          {/* Card 3 — Completion */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-md p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <RiCalendarLine className="text-emerald-600 text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Completion Date</p>
              <p className="text-sm font-extrabold text-[#0F172A] mt-[2px]">{p.completionDate}</p>
            </div>
          </div>
          {/* Card 4 — Status */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-md p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0">
              <span className={`w-4 h-4 rounded-full ${statusCfg.dot}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Current Status</p>
              <p className="text-sm font-extrabold text-[#0F172A] mt-[2px]">{p.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TABS BAR ════════════════════════════════════════ */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-[68px] z-30 mt-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 px-5 py-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap
                    ${active ? "text-[#F59E0B]" : "text-[#64748B] hover:text-[#0F172A]"}`}>
                  {tab.label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F59E0B] rounded-t-full" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ TAB CONTENT ═════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 w-full flex-1">

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT — 60% */}
            <div className="flex-1 min-w-0 flex flex-col gap-8">
              {/* About */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
                <SectionHeading icon={RiInformationLine} title="About This Project" />
                <p className="text-sm text-[#475569] leading-relaxed">{p.description}</p>
              </div>

              {/* Highlights */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
                <SectionHeading icon={RiStarFill} title="Project Highlights" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Units",        value: p.totalUnits,      bg: "bg-[#FFFBEB] border-[#F59E0B]/30" },
                    { label: "Floors",       value: p.floors,          bg: "bg-blue-50   border-blue-200"      },
                    { label: "Launch Date",  value: p.launchDate,      bg: "bg-purple-50 border-purple-200"    },
                    { label: "Possession",   value: p.completionDate,  bg: "bg-emerald-50 border-emerald-200"  },
                  ].map(h => (
                    <div key={h.label} className={`rounded-xl border p-4 text-center ${h.bg}`}>
                      <p className="text-2xl font-extrabold text-[#0F172A] leading-none">{h.value}</p>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">{h.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
                <SectionHeading icon={RiMapPinLine} title="What's Nearby" />
                <div className="flex flex-col gap-3">
                  {p.nearbyPlaces.map((place, i) => {
                    const cfg = NEARBY_CFG[place.type] || NEARBY_CFG.School;
                    const Icon = cfg.icon;
                    return (
                      <div key={i} className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
                        <div className={`w-10 h-10 rounded-full ${cfg.color} flex items-center justify-center shrink-0`}>
                          <Icon className="text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1E293B] truncate">{place.name}</p>
                          <p className="text-[11px] text-[#94A3B8]">{place.type}</p>
                        </div>
                        <span className="text-xs font-bold text-[#64748B] whitespace-nowrap">{place.distance}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT — 40% sticky */}
            <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-5">
              <div className="lg:sticky lg:top-[130px] flex flex-col gap-5">

                {/* Interest form */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-md overflow-hidden">
                  <div className="px-5 py-4" style={{ background:`linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }}>
                    <p className="font-extrabold text-white text-base">Register Your Interest</p>
                    <p className="text-white/70 text-xs mt-[2px]">Get early access and updates</p>
                  </div>
                  {formSubmitted ? (
                    <div className="p-6 flex flex-col items-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                        <RiCheckDoubleLine className="text-2xl text-emerald-600" />
                      </div>
                      <p className="font-extrabold text-[#0F172A] text-base">Interest Registered!</p>
                      <p className="text-sm text-[#64748B]">Our team will contact you soon</p>
                      <Link href="/projects"
                        className="mt-2 w-full text-center border-2 border-[#F59E0B] text-[#F59E0B] text-sm font-bold py-[10px] rounded-xl hover:bg-[#FFFBEB] transition-colors no-underline">
                        Browse More Projects
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="p-5 flex flex-col gap-4">
                      {[
                        { id:"name",  label:"Full Name",   type:"text",  ph:"e.g. Ahmed Khan"    },
                        { id:"email", label:"Email",        type:"email", ph:"your@email.com"     },
                        { id:"phone", label:"Phone",        type:"tel",   ph:"+92 300 0000000"    },
                      ].map(f => (
                        <div key={f.id}>
                          <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">{f.label}</label>
                          <input type={f.type} required placeholder={f.ph}
                            value={interestForm[f.id]}
                            onChange={e => setInterestForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-[10px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1]" />
                        </div>
                      ))}
                      <div>
                        <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Message</label>
                        <textarea rows={3} placeholder="Tell us what you're looking for..."
                          value={interestForm.message}
                          onChange={e => setInterestForm(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full border border-[#E2E8F0] rounded-xl px-4 py-[10px] text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] resize-none" />
                      </div>
                      <button type="submit"
                        className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold text-sm py-3 rounded-xl transition-colors">
                        Register Interest
                      </button>
                    </form>
                  )}
                </div>

                {/* Developer card */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-lg font-extrabold text-[#0F172A] select-none shrink-0">
                      {devInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#0F172A] text-sm truncate">{p.developerName}</p>
                      {p.developerVerified && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-[2px] rounded-full mt-1">
                          <RiCheckLine className="text-xs" /> Verified Developer
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: "Projects", value: p.developerProjects },
                      { label: "Yrs Exp",  value: `${p.developerYears}+` },
                    ].map(s => (
                      <div key={s.label} className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-[#E2E8F0]">
                        <p className="text-xl font-extrabold text-[#0F172A]">{s.value}</p>
                        <p className="text-[11px] text-[#94A3B8]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/projects"
                    className="flex items-center gap-1 text-sm font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors no-underline">
                    View All Projects <RiArrowRightLine />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: FLOOR PLANS ── */}
        {activeTab === "floorplans" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Available Floor Plans</h2>
              <p className="text-sm text-[#64748B] mt-1">Choose the perfect size for your needs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {p.floorPlans.map((plan, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="px-5 py-6 text-center" style={{ background:`linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }}>
                    <p className="text-xl font-extrabold text-white">{plan.type}</p>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <p className="text-2xl font-extrabold text-[#0F172A]">{plan.price}</p>
                    <div className="flex flex-col gap-2">
                      {plan.bedrooms > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#64748B] flex items-center gap-2"><RiHome2Line className="text-[#F59E0B]" /> Bedrooms</span>
                          <span className="font-semibold text-[#1E293B]">{plan.bedrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B] flex items-center gap-2"><RiBuildingLine className="text-[#F59E0B]" /> Size</span>
                        <span className="font-semibold text-[#1E293B]">{plan.size} sqft</span>
                      </div>
                    </div>
                    <button onClick={() => setShowInterestModal(true)}
                      className="w-full border-2 border-[#F59E0B] text-[#F59E0B] font-bold text-sm py-[10px] rounded-xl hover:bg-[#FFFBEB] transition-colors mt-auto">
                      Request Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 bg-[#FFFBEB] border-l-4 border-[#F59E0B] rounded-xl px-5 py-4">
              <RiInformationLine className="text-[#F59E0B] text-lg shrink-0 mt-[1px]" />
              <p className="text-xs text-[#92400E] leading-relaxed">
                Prices are indicative and subject to change. Contact developer for latest pricing.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 3: AMENITIES ── */}
        {activeTab === "amenities" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">World Class Amenities</h2>
              <p className="text-sm text-[#64748B] mt-1">Everything you need in one place</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {p.amenities.map((amenity, i) => {
                const cfg = AMENITY_CFG[amenity];
                const Icon = cfg?.icon || RiBuildingLine;
                return (
                  <div key={i}
                    className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-[#F59E0B] hover:shadow-[0_4px_20px_rgba(245,158,11,0.12)] transition-all duration-200 cursor-default">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${cfg?.color || "bg-gray-100 text-gray-600"}`}>
                      <Icon />
                    </div>
                    <p className="text-xs font-bold text-[#1E293B] leading-tight">{amenity}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: LOCATION ── */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map placeholder */}
            <div className="bg-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] rounded-2xl min-h-[350px] flex flex-col items-center justify-center gap-3 p-6">
              <RiMapPinLine className="text-7xl text-[#CBD5E1]" />
              <p className="text-base font-bold text-[#94A3B8]">Interactive Map</p>
              <p className="text-sm text-[#94A3B8] text-center">
                Location: {p.location}, {p.city}
              </p>
            </div>

            {/* Location details */}
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
                <SectionHeading icon={RiMapPinLine} title="Location Details" />
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <RiMapPinLine className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B] text-sm">{p.location}</p>
                    <p className="text-xs text-[#64748B]">{p.city}, Pakistan</p>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Nearby Highlights</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.nearbyPlaces.map((place, i) => {
                    const cfg = NEARBY_CFG[place.type] || NEARBY_CFG.School;
                    return (
                      <span key={i} className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-3 py-[5px] text-xs font-medium text-[#475569]">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        {place.name}
                        <span className="text-[#94A3B8]">{place.distance}</span>
                      </span>
                    );
                  })}
                </div>

                <a href={`https://maps.google.com?q=${encodeURIComponent(p.location + " " + p.city)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold text-sm py-3 rounded-xl transition-colors no-underline">
                  Get Directions <RiExternalLinkLine />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: PAYMENT PLAN ── */}
        {activeTab === "paymentplan" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Flexible Payment Options</h2>
            </div>

            {/* 3 highlight boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F59E0B] rounded-2xl p-6 text-center">
                <p className="text-2xl font-extrabold text-[#0F172A]">{p.paymentPlan.bookingAmount}</p>
                <p className="text-[#0F172A]/70 text-xs font-semibold uppercase tracking-wider mt-1">Book Now</p>
              </div>
              <div className="bg-[#0F172A] rounded-2xl p-6 text-center">
                <p className="text-2xl font-extrabold text-white">{p.paymentPlan.downPayment}</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mt-1">Down Payment</p>
              </div>
              <div className="bg-[#0F6E56] rounded-2xl p-6 text-center">
                <p className="text-2xl font-extrabold text-white">{p.paymentPlan.installmentMonths} Months</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mt-1">Easy Installments</p>
              </div>
            </div>

            {/* Payment breakdown table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A]">Payment Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                      {["Milestone","Percentage","Amount"].map(h => (
                        <th key={h} className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {PAYMENT_ROWS.map((row, i) => (
                      <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-3 font-semibold text-[#1E293B]">{row.milestone}</td>
                        <td className="px-5 py-3">
                          <span className="bg-[#FFFBEB] text-[#92400E] text-xs font-bold px-3 py-1 rounded-full border border-[#F59E0B]/30">{row.pct}</span>
                        </td>
                        <td className="px-5 py-3 font-bold text-[#0F172A]">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-[#F1F5F9]">
                <p className="text-xs text-[#94A3B8] italic">Payment plan may vary. Please contact our sales team for the latest information.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ BOTTOM CTA ══════════════════════════════════════ */}
      <section className="bg-[#0F172A] py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#F59E0B] opacity-[0.06] blur-3xl" />
        <div className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Interested in {p.name}?
          </h2>
          <p className="text-white/70 text-sm mt-2 leading-relaxed">
            Don't miss out — register your interest today and be among the first to know about updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button onClick={() => setShowInterestModal(true)}
              className="w-full sm:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold text-sm px-8 py-3 rounded-xl transition-colors">
              Register Interest
            </button>
            <a href="tel:+922112345678"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/30 text-white font-medium text-sm px-8 py-3 rounded-xl hover:bg-white/10 transition-colors no-underline">
              <RiPhoneLine /> Call Developer
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* ══ INTEREST MODAL ══════════════════════════════════ */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[450px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 text-center relative" style={{ background:`linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }}>
              <button onClick={() => setShowInterestModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <RiCloseLine />
              </button>
              <p className="text-xl font-extrabold text-white">You're Almost There! 🎉</p>
              <p className="text-white/70 text-sm mt-1">Our team will reach out within 24 hours</p>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <RiCheckDoubleLine className="text-3xl text-emerald-600" />
              </div>
              <p className="text-xl font-extrabold text-[#0F172A]">Interest Registered!</p>
              <p className="text-sm text-[#64748B]">
                Thank you for your interest in{" "}
                <span className="font-bold text-[#F59E0B]">{p.name}</span>
              </p>
              <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                Our sales team will contact you within 24 hours to discuss your requirements and provide more details.
              </p>

              <hr className="w-full border-[#F1F5F9] my-2" />

              {/* Next steps */}
              <div className="w-full flex flex-col gap-2">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider text-left mb-1">What happens next</p>
                {[
                  "Sales call within 24 hours",
                  "Site visit arrangement",
                  "Booking assistance",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl px-4 py-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <RiCheckLine className="text-emerald-600 text-xs" />
                    </div>
                    <span className="text-sm text-[#475569]">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <button onClick={() => setShowInterestModal(false)}
                className="py-[10px] rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                Close
              </button>
              <Link href="/projects"
                className="py-[10px] rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold text-center transition-colors no-underline">
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
