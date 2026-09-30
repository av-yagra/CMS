"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { destinations } from "@/lib/dummy-data";
import DestinationCard from "@/components/shared/DestinationCard";
import PackageCard from "@/components/shared/PackageCard";
import { AdminPackage } from "@/types/package";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [packages, setPackages] = useState<AdminPackage[]>([]);

  useEffect(() => {
    fetch("/api/packages").then(res => res.json()).then(data => setPackages(data.packages ?? []));
  }, []);

  const savedDestinations = destinations.filter((d) => wishlist.includes(d.id));
  const savedPackages = packages.filter((p) => wishlist.includes(p.id));
  const isEmpty = savedDestinations.length === 0 && savedPackages.length === 0;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Your Wishlist
        </h1>
        <p className="text-zinc-600 mt-2">
          Destinations and packages you&apos;ve saved for later.
        </p>
      </div>

      {isEmpty ? (
        <div className="text-center py-16">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
            <Heart size={24} />
          </div>
          <p className="text-zinc-600">Nothing saved yet.</p>
          <p className="text-sm text-zinc-500 mt-1">
            Tap the heart icon on any destination or package to save it here.
          </p>
          <Link
            href="/destinations"
            className="inline-block mt-6 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Browse Destinations
          </Link>
        </div>
      ) : (
        <>
          {savedDestinations.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-xl font-bold text-zinc-900 mb-6">
                Destinations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedDestinations.map((d) => (
                  <DestinationCard key={d.id} {...d} />
                ))}
              </div>
            </div>
          )}

          {savedPackages.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-bold text-zinc-900 mb-6">
                Packages
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedPackages.map((p) => (
                  <PackageCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}