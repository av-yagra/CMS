import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

type Props = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  badge?: string | null;
};

export default function PackageCard({ id, title, destination, duration, price, image, badge }: Props) {
  return (
    <Link
      href={`/packages/${id}`}
      className="group block rounded-xl overflow-hidden border border-black/5 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {destination}
        </span>
        {badge && (
          <span className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-heading font-semibold text-lg text-zinc-900">{title}</p>
        <div className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
        <p className="mt-3 font-semibold text-primary">
          ${price} <span className="text-sm text-zinc-500 font-normal">/ person</span>
        </p>
      </div>
    </Link>
  );
}