"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "paila-wishlist";

// --- The external store itself: plain variables + a list of listeners.
// This lives OUTSIDE the React component, at module level, because it's
// meant to represent state that exists independently of any one component.
let currentValue: string[] = [];
let listeners: (() => void)[] = [];

const EMPTY: string[] = [];

function loadFromStorage(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function emitChange() {
  for (const listener of listeners) listener();
}

function setWishlistValue(updater: (prev: string[]) => string[]) {
  currentValue = updater(currentValue);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentValue));
  } catch {
    // e.g. private browsing mode blocking storage — safe to ignore
  }
  emitChange();
}

// --- The three functions useSyncExternalStore needs:
function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): string[] {
  return currentValue;
}

function getServerSnapshot(): string[] {
  return EMPTY; // same reference every time — never a "new" empty array
}

// Populate the real value once, as soon as this module loads in the browser
// (this line never runs on the server, since `window` won't exist there).
if (typeof window !== "undefined") {
  currentValue = loadFromStorage();
}

// --- React Context wrapper, same public API as before
type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const wishlist = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleWishlist(id: string) {
    setWishlistValue((prev) =>
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