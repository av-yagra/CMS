"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAdminDestinations } from "@/hooks/useAdminDestinations";
import {
  addDestination,
  updateDestination,
  deleteDestination,
  type AdminDestination,
} from "@/lib/destinationsStore";

const emptyForm: AdminDestination = {
  id: "",
  name: "",
  country: "",
  image: "",
  imagePosition: "",
  description: "",
  highlights: [],
  bestTimeToVisit: "",
};

export default function AdminDestinationsPage() {
  const destinations = useAdminDestinations();
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminDestination>(emptyForm);
  const [highlightsText, setHighlightsText] = useState("");

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setHighlightsText("");
    setMode("form");
  }

  function startEdit(destination: AdminDestination) {
    setEditingId(destination.id);
    setForm(destination);
    setHighlightsText(destination.highlights.join("\n"));
    setMode("form");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const highlights = highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (editingId) {
      updateDestination(editingId, { ...form, highlights });
    } else {
      addDestination({ ...form, id: slugify(form.name), highlights });
    }

    setMode("list");
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}"? This can't be undone.`)) {
      deleteDestination(id);
    }
  }

  if (mode === "form") {
    return (
      <div className="max-w-2xl">
        <button
          onClick={() => setMode("list")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 mb-6 cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back to Destinations
        </button>

        <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-6">
          {editingId ? "Edit Destination" : "Add Destination"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-black/5 rounded-2xl p-6">
          <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Country</label>
              <input
                name="country"
                required
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Image position <span className="text-zinc-400 font-normal">(optional, e.g. &quot;center 35%&quot;)</span>
            </label>
            <input
              name="imagePosition"
              value={form.imagePosition}
              onChange={handleChange}
              placeholder="center 40%"
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Highlights <span className="text-zinc-400 font-normal">(one per line)</span>
            </label>
            <textarea
              rows={4}
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              placeholder={"Boating on Phewa Lake\nSunrise views from Sarangkot"}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Best Time to Visit</label>
            <input
              name="bestTimeToVisit"
              required
              value={form.bestTimeToVisit}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            {editingId ? "Save Changes" : "Add Destination"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Destinations</h1>
          <p className="text-zinc-600 mt-1">{destinations.length} destinations</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add Destination
        </button>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-black/5 bg-white">
          <p className="text-zinc-500">No destinations yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d) => (
            <div key={d.id} className="rounded-2xl border border-black/5 bg-white overflow-hidden">
              <div className="relative h-36 w-full bg-zinc-100">
                {d.image ? (
                  <Image src={d.image} alt={d.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <MapPin size={28} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-heading font-semibold text-zinc-900">{d.name}</p>
                <p className="text-xs text-zinc-500 mb-3">{d.country}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full py-2 transition-colors cursor-pointer"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id, d.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-full py-2 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}