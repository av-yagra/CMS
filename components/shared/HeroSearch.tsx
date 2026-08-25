"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Clock } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/destinations?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl shadow-black/20 p-2 flex flex-col sm:flex-row gap-2"
    >
      <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl">
        <MapPin size={18} className="text-primary shrink-0" />
        <div className="text-left w-full">
          <label htmlFor="hero-destination" className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            Destination
          </label>
          <input
            id="hero-destination"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where are you going?"
            className="w-full text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="hidden sm:block w-px bg-black/10 my-2" />

      <div
        className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl opacity-50"
        title="Coming soon — destinations don't have durations yet"
      >
        <Clock size={18} className="text-primary shrink-0" />
        <div className="text-left w-full">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            Duration
          </label>
          <select disabled className="w-full text-sm text-zinc-500 bg-transparent focus:outline-none">
            <option>Any duration</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <Search size={16} />
        Search
      </button>
    </form>
  );
}