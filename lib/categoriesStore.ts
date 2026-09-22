"use client";

export type AdminCategory = {
  id: string;
  name: string;
  description: string;
};

const seedCategories: AdminCategory[] = [
  { id: "trekking", name: "Trekking", description: "Multi-day treks through mountains and highlands." },
  { id: "cultural-tours", name: "Cultural Tours", description: "Heritage sites, temples, and local traditions." },
  { id: "day-tours", name: "Day Tours", description: "Single-day sightseeing trips." },
  { id: "beach-island", name: "Beach & Island", description: "Coastal and island getaways." },
  { id: "pilgrimage", name: "Pilgrimage", description: "Religious and spiritual destination trips." },
];

const STORAGE_KEY = "paila-admin-categories";

let currentValue: AdminCategory[] = seedCategories;
let listeners: (() => void)[] = [];
let hasLoadedFromStorage = false;

function loadFromStorage(): AdminCategory[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedCategories;
  } catch {
    return seedCategories;
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

export function getSnapshot(): AdminCategory[] {
  ensureLoaded();
  return currentValue;
}

export function getServerSnapshot(): AdminCategory[] {
  return seedCategories;
}

export function addCategory(category: AdminCategory) {
  currentValue = [...currentValue, category];
  persist();
  emitChange();
}

export function updateCategory(id: string, updates: Partial<AdminCategory>) {
  currentValue = currentValue.map((c) => (c.id === id ? { ...c, ...updates } : c));
  persist();
  emitChange();
}

export function deleteCategory(id: string) {
  currentValue = currentValue.filter((c) => c.id !== id);
  persist();
  emitChange();
}