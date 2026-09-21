"use client";

import FaqAccordion from "@/components/shared/FaqAccordion";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function FaqPage() {
  const content = useSiteContent();

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
          Support
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-600 mt-2">
          Can&apos;t find what you&apos;re looking for?{" "}
          <a href="/contact" className="text-primary font-medium hover:underline">
            Contact us
          </a>
          .
        </p>
      </div>

      <div className="space-y-10">
        {content.faq.map((category) => (
          <div key={category.title}>
            <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">
              {category.title}
            </h2>
            <FaqAccordion items={category.items} />
          </div>
        ))}
      </div>
    </section>
  );
}