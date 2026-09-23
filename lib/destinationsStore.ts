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

// Initial state uses seed destinations strictly for SSR matching or layout rendering.
// It acts as a fallback representation until the MongoDB data replaces it entirely.
let currentValue: AdminDestination[] = seedDestinations as AdminDestination[];
let listeners: (() => void)[] = [];
let hasLoadedFromServer = false;

async function loadFromServer() {
  try {
    const res = await fetch("/api/admin/destinations");
    if (!res.ok) {
      console.error("Failed to load destinations", await res.text());
      return;
    }
    const data = await res.json();
    if (data && Array.isArray(data.destinations)) {
      currentValue = data.destinations;
      emitChange();
    }
  } catch (error) {
    console.error("Network error loading destinations:", error);
  }
}

function ensureLoaded() {
  if (typeof window !== "undefined" && !hasLoadedFromServer) {
    hasLoadedFromServer = true; // Prevents recursive / multiple fetching attempts on re-renders
    loadFromServer();
  }
}
ensureLoaded(); // Automatically instantiate client-side check gracefully outside the component

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

export async function addDestination(destination: AdminDestination) {
  try {
    const res = await fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(destination)
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Error adding destination:", err.message);
      return;
    }

    // Strictly update in-memory state ONLY sequentially after verified database insertion
    currentValue = [...currentValue, destination];
    emitChange();

    // Asynchronously call the API immediately downstream in the background afterwards to guarantee database synchronicity
    loadFromServer();
  } catch (err) {
    console.error("Network error adding destination:", err);
  }
}

export async function updateDestination(id: string, updates: Partial<AdminDestination>) {
  try {
    const res = await fetch(`/api/admin/destinations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Error updating destination:", err.message);
      return;
    }

    // Update locally once Database verification guarantees successes 
    currentValue = currentValue.map((d) => (d.id === id ? { ...d, ...updates } as AdminDestination : d));
    emitChange();

    // Refetch the unified list immediately downstream to capture backend-only schema updates (i.e. slug transformations)
    loadFromServer();
  } catch (err) {
    console.error("Network error updating destination:", err);
  }
}

export async function deleteDestination(id: string) {
  try {
    const res = await fetch(`/api/admin/destinations/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Error deleting destination:", err.message);
      return;
    }

    // Only commit deletion locally upon DB success 
    currentValue = currentValue.filter((d) => d.id !== id);
    emitChange();
  } catch (err) {
    console.error("Network error deleting destination:", err);
  }
}