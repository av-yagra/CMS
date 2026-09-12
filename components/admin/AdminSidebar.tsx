"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CalendarCheck, MapPin, Package, LogOut } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/packages", label: "Packages", icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-black/5 min-h-full p-6">
      <Link href="/admin/dashboard" className="font-heading font-bold text-xl text-primary mb-10">
        Paila Admin
      </Link>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-zinc-600 hover:bg-black/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <LogOut size={18} />
        Log Out
      </button>
    </aside>
  );
}