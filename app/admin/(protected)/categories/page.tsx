"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  type AdminCategory,
} from "@/lib/categoriesStore";

const emptyForm: AdminCategory = { id: "", name: "", description: "" };

export default function AdminCategoriesPage() {
  const categories = useAdminCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCategory>(emptyForm);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id);
    setForm(category);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateCategory(editingId, form);
    } else {
      addCategory({ ...form, id: slugify(form.name) });
    }
    setShowForm(false);
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}"? This can't be undone.`)) {
      deleteCategory(id);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-zinc-50 z-10 py-2 -mt-2">
        <div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Categories</h1>
          <p className="text-zinc-600 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-black/5 rounded-2xl p-6 mb-6 space-y-4"
        >
          <h2 className="font-heading font-semibold text-zinc-900">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2 rounded-full transition-colors cursor-pointer"
            >
              {editingId ? "Save Changes" : "Add Category"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-700 px-5 py-2 cursor-pointer"
            >
              Discard
            </button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-black/5 bg-white">
          <p className="text-zinc-500">No categories yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/5 bg-white overflow-hidden divide-y divide-black/5">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Tags size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900">{c.name}</p>
                <p className="text-sm text-zinc-500 truncate">{c.description}</p>
              </div>
              <button
                onClick={() => startEdit(c)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}