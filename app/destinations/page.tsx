"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import DestinationCard from "@/components/shared/DestinationCard";
import { destinations } from "@/lib/dummy-data";

export default function DestinationsPage() {
  const [query, setQuery] = useState("");

  const filtered = destinations.filter((d) =>
    `${d.name} ${d.country}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Explore Destinations
        </h1>
        <p className="text-zinc-600 mt-2">
          Find your next adventure from our handpicked locations.
        </p>
      </div>

      {/* Search box */}
      <div className="relative max-w-md mx-auto mb-12">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by destination or country..."
          className="w-full pl-11 pr-4 py-3 rounded-full border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DestinationCard key={d.id} {...d} />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500">
          No destinations match &quot;{query}&quot;. Try a different search.
        </p>
      )}
    </section>
  );
}