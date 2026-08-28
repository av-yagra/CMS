"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

type Props = {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
};

export default function DestinationCard({ id, name, country, image, description }: Props) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(id);

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault(); // stop the click from also triggering the parent <Link> navigation
    e.stopPropagation();
    toggleWishlist(id);
  }

  return (
    <Link
      href={`/destinations/${id}`}
      className="group block rounded-xl overflow-hidden border border-black/5 bg-white hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleHeartClick}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors cursor-pointer"
        >
          <Heart
            size={16}
            className={saved ? "fill-accent text-accent" : "text-zinc-500"}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="font-heading font-semibold text-lg text-zinc-900">{name}</p>
        <p className="text-sm text-zinc-500">{country}</p>
        <p className="text-sm text-zinc-600 mt-2">{description}</p>
      </div>
    </Link>
  );
}