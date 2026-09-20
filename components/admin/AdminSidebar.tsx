"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, MapPin, Package, Tags, FileText } from "lucide-react";

const groups = [
  {
    label: "Main",
    links: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/site-content", label: "Site Content", icon: FileText },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/destinations", label: "Destinations", icon: MapPin },
      { href: "/admin/packages", label: "Packages", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tags },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-black/5 h-screen sticky top-0 p-6">
      <Link href="/" className="font-heading font-bold text-xl text-primary mb-8">
        Paila 
      </Link>

      <nav className="flex-1 space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-4 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.links.map(({ href, label, icon: Icon }) => {
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
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}