"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Heart, LogOut } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const { wishlist } = useWishlist();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur border-b transition-shadow ${
        scrolled ? "border-black/5 shadow-sm" : "border-transparent"
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
          {/* Auth-aware section, desktop only */}
          <div className="hidden sm:flex items-center gap-3">
            {status === "authenticated" ? (
              <>
                <span className="text-sm text-zinc-600">
                  Hi, {session.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded-full transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <Link
            href="/packages"
            className="hidden sm:inline-block bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Book Now
          </Link>

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

          <div className="border-t border-black/5 pt-4 flex flex-col gap-3">
            {status === "authenticated" ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700"
              >
                <LogOut size={15} />
                Log out ({session.user?.name?.split(" ")[0]})
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-zinc-700"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-primary"
                >
                  Sign up
                </Link>
              </>
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