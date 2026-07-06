"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  fetchAdminCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "@/lib/adminApi";

const INITIAL = [];

function getCategoryEmoji(name = "") {
  const n = name.toLowerCase();
  if (n.includes("house")) return "🏡";
  if (n.includes("apartment") || n.includes("flat")) return "🏢";
  if (n.includes("villa")) return "🏖️";
  if (n.includes("plot") || n.includes("land")) return "🏗️";
  if (n.includes("commercial") || n.includes("shop") || n.includes("office")) return "🏪";
  return "🏷️";
}



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
  const [name,        setName]        = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [err,         setErr]         = useState("");

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) { setErr("Category name is required."); return; }
    if (trimmedName.length < 2) { setErr("Name must be at least 2 characters."); return; }
    onSave({
      name: trimmedName,
      description: description.trim(),
      isActive: initial ? initial.isActive : true
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden border border-[#E2E8F0]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <div>
            <h3 className="font-extrabold text-[#0F172A] text-base">
              {mode === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-[2px]">
              {mode === "add" ? "Create a new property category" : "Update category details"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

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
              placeholder="e.g. Luxury Villa, Studio Apartment..."
              maxLength={30}
              className={`w-full border rounded-xl px-4 py-3 text-sm text-[#1E293B] outline-none transition-all
                placeholder:text-[#CBD5E1]
                ${err
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"}`}
            />
            {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
          </div>

          {/* Description input */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Modern apartments and flats..."
              rows={3}
              maxLength={200}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#1E293B] outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all placeholder:text-[#CBD5E1] bg-white resize-none"
            />
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
function CategoryRow({ cat, index, onEdit, onDelete, onToggle }) {
  return (
    <tr className="group hover:bg-[#F8FAFC] transition-colors">

      {/* Index */}
      <td className="px-5 py-4 w-14 text-xs font-bold text-[#94A3B8]">
        {String(index + 1).padStart(2, "0")}
      </td>

      {/* Icon */}
      <td className="px-4 py-4 w-16">
        <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-2xl select-none">
          {getCategoryEmoji(cat.name)}
        </div>
      </td>

      {/* Name + slug */}
      <td className="px-4 py-4 min-w-[150px]">
        <p className="font-bold text-[#1E293B] text-sm">{cat.name}</p>
        <p className="text-[11px] text-[#94A3B8] mt-[1px]">/{toSlug(cat.name)}</p>
      </td>

      {/* Description */}
      <td className="px-4 py-4 text-xs text-[#64748B] max-w-[250px]">
        <p className="truncate" title={cat.description}>{cat.description || "—"}</p>
      </td>

      {/* Active toggle */}
      <td className="px-4 py-4">
        <button
          onClick={() => onToggle(cat._id, !cat.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
            ${cat.isActive ? "bg-[#0F6E56]" : "bg-[#CBD5E1]"}`}
          title={cat.isActive ? "Deactivate" : "Activate"}>
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
              ${cat.isActive ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <p className="text-[10px] text-[#94A3B8] mt-[3px]">
          {cat.isActive ? "Active" : "Hidden"}
        </p>
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
  const [categories,    setCategories]    = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState("");
  const [modal,         setModal]         = useState(null);

  /* ── Actions ── */
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchAdminCategories();
      setCategories(response.data || response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function handleAdd({ name, description, isActive }) {
    try {
      await apiCreateCategory({ name, description, isActive });
      loadCategories();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category.");
    }
  }

  async function handleEdit({ name, description, isActive }) {
    try {
      await apiUpdateCategory(modal.cat._id, { name, description, isActive });
      loadCategories();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category.");
    }
  }

  async function handleDelete() {
    try {
      await apiDeleteCategory(modal.cat._id);
      loadCategories();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category.");
    }
  }

  async function toggleActive(id, newStatus) {
    try {
      const cat = categories.find(c => c._id === id);
      await apiUpdateCategory(id, {
        name: cat.name,
        description: cat.description,
        isActive: newStatus,
      });
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category status.");
    }
  }

  const activeCount = categories.filter(c => c.isActive).length;

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
              <p className="text-xs text-[#94A3B8]">{isLoading ? "..." : categories.length} categories · {isLoading ? "..." : activeCount} active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              <span className="text-base">＋</span>
              <span className="hidden sm:inline">Add Category</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 flex flex-col gap-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🏷️", label: "Total Categories", value: isLoading ? "..." : categories.length,  bg: "bg-blue-50",     text: "text-blue-700"     },
              { icon: "✅", label: "Active",            value: isLoading ? "..." : activeCount,        bg: "bg-emerald-50",  text: "text-emerald-700"  },
              { icon: "🚫", label: "Hidden",            value: isLoading ? "..." : (categories.length - activeCount), bg: "bg-[#F1F5F9]", text: "text-[#475569]" },
              { icon: "🏠", label: "Platform Types",    value: "PropFind",         bg: "bg-amber-50",    text: "text-amber-700"    },
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
              Toggle the visibility switch to instantly show or hide a category from the public pages and user filters.
            </p>
          </div>

          {/* ── Categories table ── */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">Property Categories</h2>
                <p className="text-xs text-[#94A3B8] mt-[2px]">Review and configure property listing categories</p>
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
                    {["#","Icon","Name / Slug","Description","Visibility","Actions"].map(h => (
                      <th key={h}
                        className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-4 py-3 whitespace-nowrap first:px-5 last:pr-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-5 py-4"><div className="w-4 h-4 bg-slate-200 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-11 h-11 rounded-xl bg-slate-200" /></td>
                        <td className="px-4 py-4">
                          <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-16" />
                        </td>
                        <td className="px-4 py-4"><div className="h-4 bg-slate-200 rounded w-48" /></td>
                        <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded-full w-11" /></td>
                        <td className="px-4 py-4"><div className="h-8 bg-slate-200 rounded-lg w-20" /></td>
                      </tr>
                    ))
                  ) : (
                    categories.map((cat, i) => (
                      <CategoryRow
                        key={cat._id}
                        cat={cat}
                        index={i}
                        onEdit={c => setModal({ type: "edit", cat: c })}
                        onDelete={c => setModal({ type: "delete", cat: c })}
                        onToggle={toggleActive}
                      />
                    ))
                  )}
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
          {!isLoading && categories.some(c => c.isActive) && (
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
                {categories.filter(c => c.isActive).map(cat => (
                  <div key={cat._id}
                    className="border border-[#E2E8F0] rounded-xl p-5 px-4 text-center bg-[#F8FAFC] w-[100px] hover:border-[#F59E0B] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] transition-all duration-200 cursor-default">
                    <div className="text-[28px] mb-2">{getCategoryEmoji(cat.name)}</div>
                    <div className="text-xs font-semibold text-[#1E293B] truncate">{cat.name}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-[2px]">Category</div>
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
          message="This will remove the category from the platform. Listings using this category may become uncategorized."
          confirmLabel="Yes, Delete"
          confirmStyle="bg-red-500 hover:bg-red-600"
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
