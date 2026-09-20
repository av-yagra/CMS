"use client";

import { destinations as seedDestinations } from "@/lib/dummy-data";

export type AdminDestination = {
  id: string;
  name: string;
  country: string;
  image: string;
  imagePosition?: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
};

const STORAGE_KEY = "paila-admin-destinations";

let currentValue: AdminDestination[] = seedDestinations as AdminDestination[];
let listeners: (() => void)[] = [];
let hasLoadedFromStorage = false;

function loadFromStorage(): AdminDestination[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : (seedDestinations as AdminDestination[]);
  } catch {
    return seedDestinations as AdminDestination[];
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
    // e.g. private browsing mode — safe to ignore
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

export function getSnapshot(): AdminDestination[] {
  ensureLoaded();
  return currentValue;
}

export function getServerSnapshot(): AdminDestination[] {
  return seedDestinations as AdminDestination[];
}

export function addDestination(destination: AdminDestination) {
  currentValue = [...currentValue, destination];
  persist();
  emitChange();
}

export function updateDestination(id: string, updates: Partial<AdminDestination>) {
  currentValue = currentValue.map((d) => (d.id === id ? { ...d, ...updates } : d));
  persist();
  emitChange();
}

export function deleteDestination(id: string) {
  currentValue = currentValue.filter((d) => d.id !== id);
  persist();
  emitChange();
}