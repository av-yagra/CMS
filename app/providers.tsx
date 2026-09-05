"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "@/context/WishlistContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </SessionProvider>
  );
}