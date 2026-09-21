"use client";

import { useSiteContent } from "@/hooks/useSiteContent";

export default function StatsCounter() {
  const { stats } = useSiteContent();

  return (
    <section className="bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-heading text-3xl md:text-4xl font-bold text-white">
              {s.value}+
            </p>
            <p className="text-sm text-white/70 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}