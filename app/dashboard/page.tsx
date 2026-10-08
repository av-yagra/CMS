"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  Settings,
  LogOut,
  RefreshCw,
  MapPin,
  Clock,
  Mail,
  Phone,
  Bell,
  Lock,
  Globe,
} from "lucide-react";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "My Bookings", icon: CalendarCheck },
  { key: "profile", label: "Profile", icon: User },
  { key: "settings", label: "Settings", icon: Settings },
];

const mockBookings = [
  {
    id: 1,
    title: "Everest Base Camp Helicopter Tour",
    date: "Dec 12, 2026",
    travelers: 2,
    status: "Confirmed",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80",
  },
  {
    id: 2,
    title: "Bali Island Getaway",
    date: "Jan 20, 2027",
    travelers: 4,
    status: "Pending",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
  },
  {
    id: 3,
    title: "Santorini Sunset Escape",
    date: "Oct 2, 2026",
    travelers: 2,
    status: "Completed",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
  },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  const displayName = session?.user?.name ?? "Guest Traveler";
  const displayEmail = session?.user?.email ?? "guest@example.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-black/5 p-6">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-semibold">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">{displayName}</p>
            <p className="text-xs text-zinc-500 truncate">{displayEmail}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === key
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-600 hover:bg-black/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="space-y-1 pt-4 border-t border-black/5">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-black/5 transition-colors cursor-pointer"
            title="Switch between multiple accounts (coming soon)"
          >
            <RefreshCw size={18} />
            Switch Account
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8">
        {/* Mobile tab bar */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-6 px-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                activeTab === key
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-white text-zinc-600 border-black/10"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-1">
              Welcome back, {displayName.split(" ")[0]}
            </h1>
            <p className="text-zinc-600 mb-8">Here&apos;s a snapshot of your travels with Paila.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Total Bookings</p>
                <p className="text-3xl font-heading font-bold text-zinc-900 mt-2">{mockBookings.length}</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Upcoming Trips</p>
                <p className="text-3xl font-heading font-bold text-zinc-900 mt-2">2</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Wishlist Saved</p>
                <p className="text-3xl font-heading font-bold text-zinc-900 mt-2">3</p>
              </div>
            </div>

            <h2 className="font-heading text-lg font-semibold text-zinc-900 mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {mockBookings.slice(0, 2).map((b) => (
                <div key={b.id} className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl p-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={b.image} alt={b.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{b.title}</p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {b.date}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-1">My Bookings</h1>
            <p className="text-zinc-600 mb-8">All your trips with Paila, past and upcoming.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockBookings.map((b) => (
                <div key={b.id} className="rounded-2xl border border-black/5 bg-white overflow-hidden">
                  <div className="relative h-36 w-full">
                    <Image src={b.image} alt={b.title} fill className="object-cover" />
                    <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-1 rounded-full border ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-semibold text-zinc-900">{b.title}</p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1.5">
                      <Clock size={12} /> {b.date}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                      <User size={12} /> {b.travelers} travelers
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-1">Profile</h1>
            <p className="text-zinc-600 mb-8">Your personal information.</p>

            <div className="max-w-lg bg-white border border-black/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-black/5">
                <span className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-2xl">
                  {initial}
                </span>
                <div>
                  <p className="font-heading font-semibold text-zinc-900">{displayName}</p>
                  <p className="text-sm text-zinc-500">{displayEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm text-zinc-900">{displayName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-zinc-900">{displayEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-zinc-900">Not added</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-1">Settings</h1>
            <p className="text-zinc-600 mb-8">Manage how Paila works for you.</p>

            <div className="max-w-lg space-y-3">
              <div className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl p-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Bell size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">Notifications</p>
                  <p className="text-xs text-zinc-500">Booking updates and trip reminders</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl p-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Lock size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">Password &amp; Security</p>
                  <p className="text-xs text-zinc-500">Update your password</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl p-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Globe size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">Language &amp; Currency</p>
                  <p className="text-xs text-zinc-500">English, USD</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}