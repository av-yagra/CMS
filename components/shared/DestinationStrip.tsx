import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/lib/dummy-data";

export default function DestinationStrip() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4">
        {destinations.map((d) => (
          <Link
            key={d.id}
            href={`/destinations/${d.id}`}
            className="group relative shrink-0 w-40 md:w-auto h-28 rounded-xl overflow-hidden"
          >
            <Image
              src={d.image}
              alt={d.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <span className="absolute bottom-2 left-3 text-white font-heading font-semibold text-sm">
              {d.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}