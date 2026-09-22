"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/categoriesStore";

export function useAdminCategories() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}