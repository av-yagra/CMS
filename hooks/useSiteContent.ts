"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "@/lib/siteContentStore";

export function useSiteContent() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}