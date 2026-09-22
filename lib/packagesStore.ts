"use client";

import { packages as seedPackages } from "@/lib/dummy-data";

export type ItineraryDay = { day: string; title: string; description: string };

export type AdminPackage = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  badge: string | null;
  image: string;
  imagePosition?: string;
  summary?: string;
  description: string;
  highlights: string[];
  difficulty?: string;
  bestSeason?: string;
  startingPoint?: string;
  maxAltitude?: string;
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
};

const STORAGE_KEY = "paila-admin-packages";

let currentValue: AdminPackage[] = seedPackages as AdminPackage[];
let listeners: (() => void)[] = [];
let hasLoadedFromStorage = false;

function loadFromStorage(): AdminPackage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : (seedPackages as AdminPackage[]);
  } catch {
    return seedPackages as AdminPackage[];
  }
}

function ensureLoaded() {
  if (typeof window !== "undefined" && !hasLoadedFromStorage) {
    currentValue = loadFromStorage();
    hasLoadedFromStorage = true;
  }
}
ensureLoaded();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentValue));
  } catch {
    // e.g. private browsing — safe to ignore
  }
}

function emitChange() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getSnapshot(): AdminPackage[] {
  ensureLoaded();
  return currentValue;
}

export function getServerSnapshot(): AdminPackage[] {
  return seedPackages as AdminPackage[];
}

export function addPackage(pkg: AdminPackage) {
  currentValue = [...currentValue, pkg];
  persist();
  emitChange();
}

export function updatePackage(id: string, updates: Partial<AdminPackage>) {
  currentValue = currentValue.map((p) => (p.id === id ? { ...p, ...updates } : p));
  persist();
  emitChange();
}

export function deletePackage(id: string) {
  currentValue = currentValue.filter((p) => p.id !== id);
  persist();
  emitChange();
}