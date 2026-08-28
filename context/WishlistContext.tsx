"use client";

import { createContext, useContext, useEffect, useState } from "react";

type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "paila-wishlist";

function getInitialWishlist(): string[] {
  if (typeof window === "undefined") return []; // no localStorage during server rendering
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer: this function runs once, right before the first render,
  // instead of an effect running after render and calling setState.
  const [wishlist, setWishlist] = useState<string[]>(getInitialWishlist);

  // This effect is fine as-is: it's reacting to wishlist CHANGES and pushing them
  // out to localStorage (an external system) — that's exactly what effects are for.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // localStorage can fail in private browsing on some browsers — safe to ignore
    }
  }, [wishlist]);

  function toggleWishlist(id: string) {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function isWishlisted(id: string) {
    return wishlist.includes(id);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside a WishlistProvider");
  }
  return context;
}