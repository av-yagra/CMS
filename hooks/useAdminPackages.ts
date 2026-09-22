"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/packagesStore";

export function useAdminPackages() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}