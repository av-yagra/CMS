"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Heart, LogOut } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { wishlist } = useWishlist();

  // Nav shadow on scroll
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the profile dropdown when clicking anywhere outside it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-black/10 shadow-sm transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-bold text-xl text-primary">
            Paila
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            <Heart size={18} className="text-zinc-700" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-semibold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {status === "authenticated" && session.user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              aria-label="Admin Dashboard"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-semibold text-sm hover:bg-primary/20 transition-colors"
            >
              {session.user?.name?.charAt(0).toUpperCase() ?? "A"}
            </Link>
          )}

          {status === "authenticated" && session.user?.role !== "admin" && (
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Account menu"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-semibold text-sm hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-black/5 bg-white shadow-lg p-4 z-50">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 break-all mt-0.5">
                    {session.user?.email}
                  </p>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-500 border border-red-100 hover:bg-red-50 rounded-full py-2 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-700"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <nav className="md:hidden border-t border-black/5 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/wishlist"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-zinc-700"
          >
            <Heart size={16} />
            Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </Link>

          <div className="border-t border-black/5 pt-4">
            {status === "authenticated" && session.user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-primary"
              >
                Admin Dashboard
              </Link>
            )}

            {status === "authenticated" && session.user?.role !== "admin" && (
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {session.user?.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {session.user?.email}
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-red-500"
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </div>
            )}
          </div>

          <Link
            href="/packages"
            onClick={() => setIsOpen(false)}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-full text-center transition-colors"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
