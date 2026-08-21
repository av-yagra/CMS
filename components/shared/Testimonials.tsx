import { Star } from "lucide-react";
import { testimonials } from "@/lib/dummy-data";

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-900 text-center mb-12">
        What Our Travelers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-black/5 bg-white p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < t.rating ? "fill-accent text-accent" : "text-zinc-300"}
                />
              ))}
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">&quot;{t.quote}&quot;</p>
            <div className="mt-4">
              <p className="font-heading font-semibold text-sm text-zinc-900">{t.name}</p>
              <p className="text-xs text-zinc-500">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}