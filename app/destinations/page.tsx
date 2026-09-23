"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import DestinationCard from "@/components/shared/DestinationCard";

type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  imagePosition?: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
};

function DestinationsContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/destinations");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message ?? "Failed to load destinations.");
          return;
        }
        const data = await res.json();
        setDestinations(data.destinations ?? []);
      } catch {
        setError("Unable to reach the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

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

      <div className="relative max-w-md mx-auto mb-12">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by destination or country..."
          className="w-full pl-11 pr-11 py-3 rounded-full border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-zinc-400 py-16">Loading destinations…</p>
      ) : error ? (
        <p className="text-center text-red-500 py-16">{error}</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DestinationCard key={d.id} {...d} />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <p className="text-center text-zinc-500">No destinations are available yet.</p>
      ) : (
        <p className="text-center text-zinc-500">
          No destinations match &quot;{query}&quot;. Try a different search.
        </p>
      )}
    </section>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={null}>
      <DestinationsContent />
    </Suspense>
  );
}