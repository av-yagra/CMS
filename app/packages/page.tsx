"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import PackageCard from "@/components/shared/PackageCard";
import { AdminPackage } from "@/types/package";

function PackagesContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load packages");
        return res.json();
      })
      .then((data) => setPackages(data.packages))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = packages.filter((p) =>
    `${p.title} ${p.destination}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Tour Packages
        </h1>
        <p className="text-zinc-600 mt-2">
          Complete trips, planned and priced — pick one and go.
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-12">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by package or destination..."
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

      {isLoading ? (
        <div className="text-center py-12 text-zinc-500">Loading packages...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">Error: {error}</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PackageCard key={p.id} {...p} showViewDetail />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500">
          No packages match &quot;{query}&quot;. Try a different search.
        </p>
      )}
    </section>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={null}>
      <PackagesContent />
    </Suspense>
  );
}