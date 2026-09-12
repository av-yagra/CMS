"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, Bell, MessageSquare, ChevronDown, LogOut } from "lucide-react";

export default function AdminTopbar() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 shrink-0 bg-white border-b border-black/10 shadow-sm flex items-center gap-4 px-6">
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          disabled
          placeholder="Search bookings, destinations, packages..."
          title="Search coming soon"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-black/10 bg-zinc-50 text-sm text-zinc-500 placeholder:text-zinc-400 cursor-not-allowed"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          title="Messages (coming soon)"
          className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 hover:bg-black/5 transition-colors cursor-not-allowed"
        >
          <MessageSquare size={18} />
        </button>
        <button
          title="Notifications (coming soon)"
          className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 hover:bg-black/5 transition-colors cursor-not-allowed"
        >
          <Bell size={18} />
        </button>

        <div className="relative ml-2" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-semibold text-sm">
              {session?.user?.name?.charAt(0).toUpperCase() ?? "A"}
            </span>
            <span className="hidden sm:block text-left">
              <span className="block text-sm font-medium text-zinc-900 leading-tight">
                {session?.user?.name}
              </span>
              <span className="block text-xs text-zinc-400 leading-tight uppercase tracking-wide">
                Admin
              </span>
            </span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-black/5 bg-white shadow-lg p-2 z-50">
              <div className="px-3 py-2 border-b border-black/5 mb-1">
                <p className="text-sm font-semibold text-zinc-900 truncate">{session?.user?.name}</p>
                <p className="text-xs text-zinc-500 break-all">{session?.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}