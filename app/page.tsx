import Link from "next/link";
import { ShieldCheck, MapPinned, Wallet, HeadphonesIcon } from "lucide-react";
import DestinationCard from "@/components/shared/DestinationCard";
import PackageCard from "@/components/shared/PackageCard";
import DestinationStrip from "@/components/shared/DestinationStrip";
import StatsCounter from "@/components/shared/StatsCounter";
import Testimonials from "@/components/shared/Testimonials";
import { destinations, packages } from "@/lib/dummy-data";

import HeroSlideshow from "@/components/shared/HeroSlideshow";
import HeroSearch from "@/components/shared/HeroSearch";

const heroImages = [
  { id: "pokhara", image: destinations[0].image, imagePosition: destinations[0].imagePosition, name: destinations[0].name },
  { id: "everest-base-camp", image: packages[0].image, name: packages[0].title },
  { id: "santorini", image: destinations[2].image, imagePosition: destinations[2].imagePosition, name: destinations[2].name },
  { id: "bali-getaway", image: packages[1].image, name: packages[1].title },
  { id: "dubai", image: destinations[5].image, imagePosition: destinations[5].imagePosition, name: destinations[5].name },
];

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Trusted Trips",
    text: "Verified tours and transparent pricing, every time.",
    tint: "primary",
  },
  {
    icon: MapPinned,
    title: "Handpicked Destinations",
    text: "Curated locations, not generic tourist traps.",
    tint: "accent",
  },
  {
    icon: Wallet,
    title: "Fair Pricing",
    text: "No hidden fees — what you see is what you pay.",
    tint: "primary",
  },
  {
    icon: HeadphonesIcon,
    title: "Real Support",
    text: "Reach a real person before, during, and after your trip.",
    tint: "accent",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
        {/* subtle background texture, sits behind everything in this section */}
        <svg
          className="absolute -top-10 left-0 w-105 text-primary/10 pointer-events-none"
          viewBox="0 0 400 300"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10,150 C60,80 120,220 180,140 C230,75 260,180 340,120"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
          <path
            d="M0,220 C70,260 140,180 220,240 C280,285 320,230 400,260"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              Nepal &amp; Beyond
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-900 leading-[1.05]">
              Discover Your Next Adventure
            </h1>
            <p className="mt-5 text-lg text-zinc-600 max-w-md mx-auto md:mx-0">
              Handpicked destinations and tour packages, wherever you want to go.
            </p>

            <div className="mt-6 relative z-20 md:w-[135%]">
              <HeroSearch />
            </div>
          </div>

          <div className="relative h-105 md:h-140 md:-mr-10">
            <HeroSlideshow images={heroImages} />
          </div>
        </div>
      </section>

      <DestinationStrip />
      <StatsCounter />

      {/* Featured Destinations */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900">
            Featured Destinations
          </h2>
          <Link
            href="/destinations"
            className="text-sm font-medium text-primary hover:underline"
          >
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
          <Link
            href="/packages"
            className="text-sm font-medium text-primary hover:underline"
          >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {whyChooseUs.map(({ icon: Icon, title, text, tint }) => (
              <div
                key={title}
                className="text-center p-6 rounded-2xl border border-black/5 hover:border-black/10 hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`mx-auto w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${
                    tint === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <Icon size={22} />
                </div>
                <p className="font-heading font-semibold text-zinc-900">
                  {title}
                </p>
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