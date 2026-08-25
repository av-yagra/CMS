import { Star } from "lucide-react";
import { testimonials } from "@/lib/dummy-data";

export default function Testimonials() {
  const avgRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section className="bg-surface-dark text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
              Testimonials
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              What Our Travelers Say
            </h2>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 w-fit">
            <span className="font-heading text-3xl font-bold">{avgRating.toFixed(1)}</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(avgRating) ? "fill-accent text-accent" : "text-white/20"}
                  />
                ))}
              </div>
              <p className="text-xs text-white/50 mt-1">
                Based on {testimonials.length}+ reviews
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="snap-start shrink-0 w-[300px] rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? "fill-accent text-accent" : "text-white/20"}
                  />
                ))}
              </div>
              <p className="text-sm text-white/80 leading-relaxed">&quot;{t.quote}&quot;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-heading font-semibold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-white/50">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}