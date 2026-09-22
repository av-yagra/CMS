"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package as PackageIcon, ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAdminPackages } from "@/hooks/useAdminPackages";
import {
  addPackage,
  updatePackage,
  deletePackage,
  type AdminPackage,
  type ItineraryDay,
} from "@/lib/packagesStore";

const emptyForm: AdminPackage = {
  id: "",
  title: "",
  destination: "",
  duration: "",
  price: 0,
  badge: null,
  image: "",
  imagePosition: "",
  summary: "",
  description: "",
  highlights: [],
  difficulty: "",
  bestSeason: "",
  startingPoint: "",
  maxAltitude: "",
  itinerary: [],
  includes: [],
  excludes: [],
};

export default function AdminPackagesPage() {
  const packages = useAdminPackages();
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminPackage>(emptyForm);

  const [highlightsText, setHighlightsText] = useState("");
  const [includesText, setIncludesText] = useState("");
  const [excludesText, setExcludesText] = useState("");
  const [itineraryText, setItineraryText] = useState("");

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setHighlightsText("");
    setIncludesText("");
    setExcludesText("");
    setItineraryText("");
    setMode("form");
  }

  function startEdit(pkg: AdminPackage) {
    setEditingId(pkg.id);
    setForm(pkg);
    setHighlightsText(pkg.highlights.join("\n"));
    setIncludesText(pkg.includes.join("\n"));
    setExcludesText(pkg.excludes.join("\n"));
    setItineraryText(
      pkg.itinerary.map((d) => `${d.day} | ${d.title} | ${d.description}`).join("\n")
    );
    setMode("form");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price" ? Number(value) : value });
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function linesToList(text: string) {
    return text.split("\n").map((l) => l.trim()).filter(Boolean);
  }

  function parseItinerary(text: string): ItineraryDay[] {
    return linesToList(text).map((line) => {
      const [day, title, description] = line.split("|").map((s) => s.trim());
      return { day: day ?? "", title: title ?? "", description: description ?? "" };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: Omit<AdminPackage, "id"> = {
      ...form,
      highlights: linesToList(highlightsText),
      includes: linesToList(includesText),
      excludes: linesToList(excludesText),
      itinerary: parseItinerary(itineraryText),
    };

    if (editingId) {
      updatePackage(editingId, payload);
    } else {
      addPackage({ ...payload, id: slugify(form.title) });
    }

    setMode("list");
  }

  function handleDelete(id: string, title: string) {
    if (confirm(`Delete "${title}"? This can't be undone.`)) {
      deletePackage(id);
    }
  }

  function inputClass() {
    return "w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  }

  if (mode === "form") {
    return (
      <div className="max-w-2xl">
        <button
          onClick={() => setMode("list")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 mb-6 cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back to Packages
        </button>

        <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-6">
          {editingId ? "Edit Package" : "Add Package"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-black/5 rounded-2xl p-6">
          <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Title</label>
              <input name="title" required value={form.title} onChange={handleChange} className={inputClass()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Destination / Country</label>
              <input name="destination" required value={form.destination} onChange={handleChange} className={inputClass()} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Duration</label>
              <input name="duration" required placeholder="7 Days" value={form.duration} onChange={handleChange} className={inputClass()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Price (USD)</label>
              <input type="number" name="price" required min={0} value={form.price} onChange={handleChange} className={inputClass()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Badge <span className="text-zinc-400 font-normal">(optional)</span></label>
              <input name="badge" placeholder="Popular, Offer, New..." value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value || null })} className={inputClass()} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Summary <span className="text-zinc-400 font-normal">(shown on cards, one line)</span></label>
            <input name="summary" value={form.summary} onChange={handleChange} className={inputClass()} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Description</label>
            <textarea name="description" required rows={3} value={form.description} onChange={handleChange} className={inputClass() + " resize-none"} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Highlights <span className="text-zinc-400 font-normal">(one per line)</span></label>
            <textarea rows={3} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} className={inputClass() + " resize-none"} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Quick Facts (all optional)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="difficulty" placeholder="Difficulty (e.g. Easy)" value={form.difficulty} onChange={handleChange} className={inputClass()} />
            <input name="bestSeason" placeholder="Best Season" value={form.bestSeason} onChange={handleChange} className={inputClass()} />
            <input name="startingPoint" placeholder="Starting Point" value={form.startingPoint} onChange={handleChange} className={inputClass()} />
            <input name="maxAltitude" placeholder="Max Altitude" value={form.maxAltitude} onChange={handleChange} className={inputClass()} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Itinerary <span className="text-zinc-400 font-normal">(one per line: Day | Title | Description)</span>
            </label>
            <textarea
              rows={4}
              value={itineraryText}
              onChange={(e) => setItineraryText(e.target.value)}
              placeholder={"Day 1 | Arrival | Airport pickup and briefing"}
              className={inputClass() + " resize-none font-mono text-xs"}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Includes <span className="text-zinc-400 font-normal">(one per line)</span></label>
              <textarea rows={4} value={includesText} onChange={(e) => setIncludesText(e.target.value)} className={inputClass() + " resize-none"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Excludes <span className="text-zinc-400 font-normal">(one per line)</span></label>
              <textarea rows={4} value={excludesText} onChange={(e) => setExcludesText(e.target.value)} className={inputClass() + " resize-none"} />
            </div>
          </div>

          <button type="submit" className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer">
            {editingId ? "Save Changes" : "Add Package"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Packages</h1>
          <p className="text-zinc-600 mt-1">{packages.length} packages</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer">
          <Plus size={16} />
          Add Package
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-black/5 bg-white">
          <p className="text-zinc-500">No packages yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((p) => (
            <div key={p.id} className="rounded-2xl border border-black/5 bg-white overflow-hidden">
              <div className="relative h-36 w-full bg-zinc-100">
                {p.image ? (
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <PackageIcon size={28} />
                  </div>
                )}
                {p.badge && (
                  <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-heading font-semibold text-zinc-900">{p.title}</p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3 mt-0.5">
                  <Clock size={12} />
                  {p.duration} · ${p.price}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full py-2 transition-colors cursor-pointer">
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id, p.title)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-full py-2 transition-colors cursor-pointer">
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