"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

type Props = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  summary?: string;
  badge?: string | null;
  showViewDetail?: boolean;
};

export default function PackageCard({
  id,
  title,
  destination,
  duration,
  price,
  image,
  summary,
  badge,
  showViewDetail = false,
}: Props) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(id);

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  }

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
          <span className="absolute top-3 right-12 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
        <button
          onClick={handleHeartClick}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors cursor-pointer"
        >
          <Heart size={16} className={saved ? "fill-accent text-accent" : "text-zinc-500"} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-heading font-semibold text-lg text-zinc-900 flex-1">
            {title}
          </p>
          <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0 pt-1">
            <Clock size={13} />
            <span>{duration}</span>
          </div>
        </div>

        {summary && (
          <p className="text-sm text-zinc-500 mt-1.5 line-clamp-1">{summary}</p>
        )}

        <p className="mt-3 font-semibold text-primary">
          ${price} <span className="text-sm text-zinc-500 font-normal">/ person</span>
        </p>

        {showViewDetail && (
          <span className="mt-3 block text-center text-sm font-semibold text-white bg-primary group-hover:bg-primary-dark rounded-full py-2 transition-colors">
            View Detail
          </span>
        )}
      </div>
    </Link>
  );
}