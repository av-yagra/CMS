"use client";

import Link from "next/link";
import { Users, ShieldCheck, Sparkles, Fingerprint, MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const paila = [
  { letter: "P", icon: Sparkles, word: "Personalized", text: "Itineraries built around you, not pulled from a template.", tint: "primary" },
  { letter: "A", icon: Fingerprint, word: "Authentic", text: "Real culture and real guides — never a manufactured experience.", tint: "accent" },
  { letter: "I", icon: Users, word: "Immersive", text: "Small groups and real time in a place, not a rushed checklist.", tint: "primary" },
  { letter: "L", icon: MapPin, word: "Local", text: "Guides who've actually walked the trail, not read about it.", tint: "accent" },
  { letter: "A", icon: ShieldCheck, word: "Accountable", text: "Transparent pricing and real support, before, during, and after.", tint: "primary" },
];

export default function AboutPage() {
  const content = useSiteContent();

  return (
    <>
      {/* Intro */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
          {content.about.eyebrow}
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900">
          {content.about.heading}
        </h1>
        <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
          {content.about.intro}
        </p>
      </section>

      {/* Values — P-A-I-L-A stays fixed, brand-specific, not admin-editable */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 text-center mb-2">
            What Paila Stands For
          </h2>
          <p className="text-zinc-600 text-center mb-12">Five letters, one promise.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {paila.map(({ letter, icon: Icon, word, text, tint }, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-black/5 p-6 text-center hover:border-black/10 hover:-translate-y-1 transition-all duration-200"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 -right-2 font-heading text-8xl font-bold select-none ${
                    tint === "primary" ? "text-primary/[0.06]" : "text-accent/[0.06]"
                  }`}
                >
                  {letter}
                </span>
                <div
                  className={`relative mx-auto w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${
                    tint === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  }`}
                >
                  <Icon size={22} />
                </div>
                <p className="relative font-heading font-semibold text-zinc-900">{word}</p>
                <p className="relative text-sm text-zinc-600 mt-1.5">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900">
          {content.about.ctaHeading}
        </h2>
        <p className="text-zinc-600 mt-2">{content.about.ctaText}</p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            href="/packages"
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explore Packages
          </Link>
          <Link
            href="/contact"
            className="border border-black/10 hover:border-black/20 text-zinc-900 font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}