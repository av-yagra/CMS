import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { destinations, packages } from "@/lib/dummy-data";
import PackageCard from "@/components/shared/PackageCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DestinationDetailPage({ params }: Props) {
  const { id } = await params;
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    notFound();
  }

  const relatedPackages = packages.filter(
    (p) => p.destination.toLowerCase() === destination.country.toLowerCase(),
  );

  return (
    <>
      {/* Hero image */}
      <div className="relative h-105 md:h-150 w-full overflow-hidden">
  <Image
  src={destination.image}
  alt={destination.name}
  fill
  priority
  className="object-cover"
  style={{
    objectPosition: destination.imagePosition || "center",
  }}
/>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
<div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center text-white px-6">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            {destination.name}
          </h1>
          <p className="flex items-center gap-1.5 mt-2 text-white/90">
            <MapPin size={16} />
            {destination.country}
          </p>
        </div>
      </div>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-lg text-zinc-600 leading-relaxed">
          {destination.description}
        </p>
      </section>

      {/* Related packages */}
      {relatedPackages.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 mb-8">
            Tour Packages in {destination.country}
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
        <Link
          href="/destinations"
          className="text-primary font-medium hover:underline"
        >
          ← Back to all destinations
        </Link>
      </div>
    </>
  );
}
