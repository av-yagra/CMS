import Link from "next/link";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-2xl text-primary">
          Paila
        </Link>

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

        <Link
          href="/packages"
          className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}