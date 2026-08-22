import Link from "next/link";
import { ShieldCheck, MapPinned, Wallet, HeadphonesIcon } from "lucide-react";
import DestinationCard from "@/components/shared/DestinationCard";
import PackageCard from "@/components/shared/PackageCard";
import DestinationStrip from "@/components/shared/DestinationStrip";
import StatsCounter from "@/components/shared/StatsCounter";
import Testimonials from "@/components/shared/Testimonials";
import { destinations, packages } from "@/lib/dummy-data";

const whyChooseUs = [
  { icon: ShieldCheck, title: "Trusted Trips", text: "Verified tours and transparent pricing, every time." },
  { icon: MapPinned, title: "Handpicked Destinations", text: "Curated locations, not generic tourist traps." },
  { icon: Wallet, title: "Fair Pricing", text: "No hidden fees — what you see is what you pay." },
  { icon: HeadphonesIcon, title: "Real Support", text: "Reach a real person before, during, and after your trip." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900">
          Discover Your Next Adventure
        </h1>
        <p className="mt-4 text-lg text-zinc-600 max-w-xl mx-auto">
          Handpicked destinations and tour packages, wherever you want to go.
        </p>
        <Link
          href="/packages"
          className="inline-block mt-8 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Explore Packages
        </Link>
      </section>

      <DestinationStrip />
      <StatsCounter />

      {/* Featured Destinations */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900">
            Featured Destinations
          </h2>
          <Link href="/destinations" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <DestinationCard key={d.id} {...d} />
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900">
            Popular Packages
          </h2>
          <Link href="/packages" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {packages.map((p) => (
            <PackageCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 text-center mb-12">
            Why Travel With Paila
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {whyChooseUs.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Icon size={22} />
                </div>
                <p className="font-heading font-semibold text-zinc-900">{title}</p>
                <p className="text-sm text-zinc-600 mt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900">
          Ready to start your journey?
        </h2>
        <p className="text-zinc-600 mt-2">Take the first step today.</p>
        <Link
          href="/contact"
          className="inline-block mt-6 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Get In Touch
        </Link>
      </section>
    </>
  );
}