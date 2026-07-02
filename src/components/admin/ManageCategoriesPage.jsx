"use client";

import { useState, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

/* ── Default categories (matches Categories.jsx) ─────────── */
const INITIAL = [
  { id: 1, icon: "🏡", name: "House",      slug: "house",      count: 142, active: true  },
  { id: 2, icon: "🏢", name: "Apartment",  slug: "apartment",  count: 89,  active: true  },
  { id: 3, icon: "🏖️", name: "Villa",      slug: "villa",      count: 34,  active: true  },
  { id: 4, icon: "🏗️", name: "Plot",       slug: "plot",       count: 211, active: true  },
  { id: 5, icon: "🏪", name: "Commercial", slug: "commercial", count: 67,  active: true  },
];

/* ── Popular emoji picks for the picker ─────────────────── */
const EMOJI_OPTIONS = [
  "🏡","🏢","🏖️","🏗️","🏪","🏘️","🏚️","🏠","🏛️","🏬",
  "🏭","🏰","🏯","🏟️","⛺","🛖","🏕️","🏙️","🌆","🌇",
  "🏦","🏥","🏨","🏫","🏩","💒","🏤","🏣","🏧","🏺",
];

/* ── Slug generator ──────────────────────────────────────── */
function toSlug(str) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ── Confirm modal ───────────────────────────────────────── */
function ConfirmModal({ title, message, confirmLabel, confirmStyle, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="text-center mb-5">
          <span className="text-4xl">⚠️</span>
          <h3 className="font-extrabold text-[#0F172A] mt-3 mb-1">{title}</h3>
          <p className="text-sm text-[#64748B]">{message}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel}
            className="py-[10px] rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`py-[10px] rounded-xl text-sm font-bold text-white transition-colors ${confirmStyle}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Add / Edit Modal ────────────────────────────────────── */
function CategoryModal({ mode, initial, onSave, onClose }) {
  const [name,    setName]    = useState(initial?.name ?? "");
  const [icon,    setIcon]    = useState(initial?.icon ?? "🏡");
  const [picking, setPicking] = useState(false);
  const [err,     setErr]     = useState("");

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) { setErr("Category name is required."); return; }
    if (trimmed.length < 2) { setErr("Name must be at least 2 characters."); return; }
    onSave({ name: trimmed, icon, slug: toSlug(trimmed) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <div>
            <h3 className="font-extrabold text-[#0F172A] text-base">
              {mode === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-[2px]">
              {mode === "add" ? "Create a new property type" : "Update category details"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Category Icon
            </label>
            <button
              onClick={() => setPicking(!picking)}
              className="flex items-center gap-3 border border-[#E2E8F0] rounded-xl px-4 py-3 w-full hover:border-[#F59E0B] transition-colors group">
              <span className="text-3xl">{icon}</span>
              <span className="text-sm text-[#64748B] group-hover:text-[#0F172A] transition-colors">
                {picking ? "Close picker ↑" : "Pick an emoji ↓"}
              </span>
            </button>

            {picking && (
              <div className="mt-2 p-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
                <div className="grid grid-cols-10 gap-1">
                  {EMOJI_OPTIONS.map(e => (
                    <button
                      key={e}
                      onClick={() => { setIcon(e); setPicking(false); }}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all hover:scale-110
                        ${icon === e ? "bg-[#F59E0B]/20 ring-2 ring-[#F59E0B]" : "hover:bg-white"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Name input */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              placeholder="e.g. Penthouse, Farm House..."
              maxLength={30}
              className={`w-full border rounded-xl px-4 py-3 text-sm text-[#1E293B] outline-none transition-all
                placeholder:text-[#CBD5E1]
                ${err
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"}`}
            />
            {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
            <p className="text-[11px] text-[#94A3B8] mt-1">Slug: /{toSlug(name || "...")}</p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Preview
            </label>
            <div className="border border-[#E2E8F0] rounded-xl p-5 px-3 text-center bg-white w-[100px]">
              <div className="text-[28px] mb-2">{icon}</div>
              <div className="text-sm font-semibold text-[#1E293B] truncate">{name || "Name"}</div>
              <div className="text-[11px] text-[#94A3B8] mt-[2px]">0 listings</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
          <button onClick={onClose}
            className="flex-1 py-[10px] rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-[10px] rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold transition-colors">
            {mode === "add" ? "Add Category" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Draggable Row ───────────────────────────────────────── */
function CategoryRow({ cat, index, total, onMoveUp, onMoveDown, onEdit, onDelete, onToggle }) {
  return (
    <tr className="group hover:bg-[#F8FAFC] transition-colors">

      {/* Drag handle + order */}
      <td className="px-5 py-4 w-14">
        <div className="flex items-center gap-2">
          <span className="text-[#CBD5E1] group-hover:text-[#94A3B8] transition-colors cursor-grab text-base select-none">
            ⠿
          </span>
          <span className="text-xs font-bold text-[#94A3B8]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </td>

      {/* Icon */}
      <td className="px-4 py-4 w-16">
        <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-2xl select-none">
          {cat.icon}
        </div>
      </td>

      {/* Name + slug */}
      <td className="px-4 py-4">
        <p className="font-bold text-[#1E293B] text-sm">{cat.name}</p>
        <p className="text-[11px] text-[#94A3B8] mt-[1px]">/{cat.slug}</p>
      </td>

      {/* Listings count */}
      <td className="px-4 py-4">
        <span className="bg-[#F1F5F9] text-[#475569] text-xs font-semibold px-3 py-1 rounded-full">
          {cat.count} listings
        </span>
      </td>

      {/* Active toggle */}
      <td className="px-4 py-4">
        <button
          onClick={() => onToggle(cat.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
            ${cat.active ? "bg-[#0F6E56]" : "bg-[#CBD5E1]"}`}
          title={cat.active ? "Deactivate" : "Activate"}>
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
              ${cat.active ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <p className="text-[10px] text-[#94A3B8] mt-[3px] text-center">
          {cat.active ? "Active" : "Hidden"}
        </p>
      </td>

      {/* Reorder buttons */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            title="Move up"
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold">
            ↑
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            title="Move down"
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold">
            ↓
          </button>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 pr-5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(cat)}
            title="Edit"
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-amber-50 hover:text-amber-600 text-[#64748B] flex items-center justify-center transition-colors text-sm">
            ✏️
          </button>
          <button
            onClick={() => onDelete(cat)}
            title="Delete"
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-red-50 hover:text-red-500 text-[#64748B] flex items-center justify-center transition-colors text-sm">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function ManageCategoriesPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [categories,    setCategories]    = useState(INITIAL);
  const [modal,         setModal]         = useState(null);
    // modal types: "add" | { type:"edit", cat } | { type:"delete", cat }
  const nextId = useRef(INITIAL.length + 1);

  /* ── Helpers ── */
  function moveUp(index) {
    if (index === 0) return;
    setCategories(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }

  function moveDown(index) {
    setCategories(prev => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }

  function toggleActive(id) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  }

  function handleAdd({ name, icon, slug }) {
    const newCat = { id: nextId.current++, icon, name, slug, count: 0, active: true };
    setCategories(prev => [...prev, newCat]);
    setModal(null);
  }

  function handleEdit({ name, icon, slug }) {
    setCategories(prev => prev.map(c =>
      c.id === modal.cat.id ? { ...c, name, icon, slug } : c
    ));
    setModal(null);
  }

  function handleDelete() {
    setCategories(prev => prev.filter(c => c.id !== modal.cat.id));
    setModal(null);
  }

  const activeCount   = categories.filter(c => c.active).length;
  const totalListings = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
      <div className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-transform duration-300
        ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569]">☰</button>
            <div>
              <h1 className="text-lg font-extrabold text-[#0F172A]">Manage Categories</h1>
              <p className="text-xs text-[#94A3B8]">{categories.length} categories · {activeCount} active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              <span className="text-base">＋</span>
              <span className="hidden sm:inline">Add Category</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-xs font-extrabold text-[#0F172A] select-none">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-6">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🏷️", label: "Total Categories", value: categories.length,  bg: "bg-blue-50",     text: "text-blue-700"     },
              { icon: "✅", label: "Active",            value: activeCount,        bg: "bg-emerald-50",  text: "text-emerald-700"  },
              { icon: "🚫", label: "Hidden",            value: categories.length - activeCount, bg: "bg-[#F1F5F9]", text: "text-[#475569]" },
              { icon: "🏠", label: "Total Listings",    value: totalListings,      bg: "bg-amber-50",    text: "text-amber-700"    },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3`}>
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className={`text-2xl font-extrabold leading-none ${s.text}`}>{s.value}</p>
                  <p className="text-xs text-[#94A3B8] font-semibold mt-[2px]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Hint bar ── */}
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-xs text-blue-700 font-medium">
              Use <strong>↑ ↓</strong> buttons to reorder categories. Order here controls the display order on the homepage and property filters.
              Toggle the switch to show/hide a category from public pages.
            </p>
          </div>

          {/* ── Categories table ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">Property Categories</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Drag or use arrow buttons to reorder</p>
              </div>
              <button
                onClick={() => setModal("add")}
                className="text-xs font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors">
                + Add new
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    {["#","Icon","Name / Slug","Listings","Visibility","Reorder","Actions"].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-4 py-3 whitespace-nowrap first:px-5 last:pr-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {categories.map((cat, i) => (
                    <CategoryRow
                      key={cat.id}
                      cat={cat}
                      index={i}
                      total={categories.length}
                      onMoveUp={moveUp}
                      onMoveDown={moveDown}
                      onEdit={c => setModal({ type: "edit", cat: c })}
                      onDelete={c => setModal({ type: "delete", cat: c })}
                      onToggle={toggleActive}
                    />
                  ))}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <span className="text-5xl mb-3">🏷️</span>
                  <p className="font-bold text-[#0F172A]">No categories yet</p>
                  <p className="text-sm text-[#64748B] mt-1">Add your first property category</p>
                  <button
                    onClick={() => setModal("add")}
                    className="mt-4 bg-[#F59E0B] text-[#0F172A] text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#D97706] transition-colors">
                    + Add Category
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Live preview ── */}
          {categories.some(c => c.active) && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A]">Homepage Preview</h2>
                  <p className="text-xs text-[#94A3B8] mt-[2px]">How active categories appear on the public site</p>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  Live preview
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.filter(c => c.active).map(cat => (
                  <div key={cat.id}
                    className="border border-[#E2E8F0] rounded-xl p-5 px-4 text-center bg-[#F8FAFC] w-[100px] hover:border-[#F59E0B] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] transition-all duration-200 cursor-default">
                    <div className="text-[28px] mb-2">{cat.icon}</div>
                    <div className="text-xs font-semibold text-[#1E293B] truncate">{cat.name}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-[2px]">{cat.count} listings</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Add Modal ── */}
      {modal === "add" && (
        <CategoryModal mode="add" onSave={handleAdd} onClose={() => setModal(null)} />
      )}

      {/* ── Edit Modal ── */}
      {modal?.type === "edit" && (
        <CategoryModal mode="edit" initial={modal.cat} onSave={handleEdit} onClose={() => setModal(null)} />
      )}

      {/* ── Delete Confirm ── */}
      {modal?.type === "delete" && (
        <ConfirmModal
          title={`Delete "${modal.cat.name}"?`}
          message={`This will remove the category from the platform. ${modal.cat.count > 0 ? `${modal.cat.count} listings will become uncategorized.` : ""}`}
          confirmLabel="Yes, Delete"
          confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
