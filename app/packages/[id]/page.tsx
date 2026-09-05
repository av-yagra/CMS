import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Check, X } from "lucide-react";
import { packages } from "@/lib/dummy-data";
import PackageCard from "@/components/shared/PackageCard";
import QuickFacts from "@/components/shared/QuickFacts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PackageDetailPage({ params }: Props) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    notFound();
  }

  const relatedPackages = packages.filter(
    (p) => p.destination.toLowerCase() === pkg.destination.toLowerCase() && p.id !== pkg.id,
  );

  return (
    <>
      {/* Hero image */}
      <div className="relative h-105 md:h-150 w-full overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center text-white px-6">
          {pkg.badge && (
            <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {pkg.badge}
            </span>
          )}
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            {pkg.title}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2 text-white/90 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              {pkg.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {pkg.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Description + price/CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <p className="text-lg text-zinc-600 leading-relaxed max-w-xl">
            {pkg.description}
          </p>
          <div className="shrink-0 text-center md:text-right">
            <p className="text-3xl font-heading font-bold text-primary">
              ${pkg.price}
              <span className="text-sm text-zinc-500 font-normal"> / person</span>
            </p>
            <Link
              href={`/book?package=${pkg.id}`}
              className="inline-block mt-3 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Book This Package
            </Link>
          </div>
        </div>

        <QuickFacts
  difficulty={pkg.difficulty}
  bestSeason={pkg.bestSeason}
  startingPoint={pkg.startingPoint}
  maxAltitude={pkg.maxAltitude}
/>

{pkg.highlights && pkg.highlights.length > 0 && (
  <section className="mt-10 mb-2">
    <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-4">
      Trip Highlights
    </h2>
    <ul className="grid sm:grid-cols-2 gap-3">
      {pkg.highlights.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </section>
)}

        {/* Itinerary */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">
            Itinerary
          </h2>
          <div className="space-y-6">
            {pkg.itinerary.map((stop, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-24 text-sm font-semibold text-primary pt-0.5">
                  {stop.day}
                </div>
                <div className="flex-1 pb-6 border-b border-black/5 last:border-0">
                  <p className="font-heading font-semibold text-zinc-900">{stop.title}</p>
                  <p className="text-sm text-zinc-600 mt-1">{stop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Includes / Excludes */}
        <section className="grid sm:grid-cols-2 gap-8 mb-4">
          <div>
            <h3 className="font-heading font-semibold text-zinc-900 mb-3">Included</h3>
            <ul className="space-y-2">
              {pkg.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-zinc-900 mb-3">Not Included</h3>
            <ul className="space-y-2">
              {pkg.excludes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                  <X size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Related packages */}
      {relatedPackages.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 mb-8">
            More Packages in {pkg.destination}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedPackages.map((p) => (
              <PackageCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pb-16 text-center">
        <Link href="/packages" className="text-primary font-medium hover:underline">
          ← Back to all packages
        </Link>
      </div>
    </>
  );
}