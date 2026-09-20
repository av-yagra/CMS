"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/destinationsStore";

export function useAdminDestinations() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}