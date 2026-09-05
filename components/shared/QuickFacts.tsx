import { Gauge, Calendar, MapPin, Mountain, type LucideIcon } from "lucide-react";

type Fact = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type Props = {
  difficulty?: string;
  bestSeason?: string;
  startingPoint?: string;
  maxAltitude?: string;
};

export default function QuickFacts({ difficulty, bestSeason, startingPoint, maxAltitude }: Props) {
  const facts: Fact[] = [
    difficulty && { icon: Gauge, label: "Difficulty", value: difficulty },
    bestSeason && { icon: Calendar, label: "Best Season", value: bestSeason },
    startingPoint && { icon: MapPin, label: "Starting Point", value: startingPoint },
    maxAltitude && { icon: Mountain, label: "Max Altitude", value: maxAltitude },
  ].filter(Boolean) as Fact[];

  if (facts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-black/5 bg-white p-5">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-2.5">
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Icon size={15} />
          </span>
          <div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-zinc-900 mt-0.5">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}