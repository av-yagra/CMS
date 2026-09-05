import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const quickLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const supportLinks = [
  { href: "/contact", label: "Booking Support" },
   { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Terms & Conditions" },
  { href: "/contact", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
  <div className="flex items-center gap-2">
    <p className="font-heading font-bold text-xl">Paila</p>
  </div>
  <p className="text-sm text-white/70 mt-3 leading-relaxed">
    Paila means &quot;the first step&quot; — every great journey begins
    with one. Handpicked destinations and tour packages, curated for
    unforgettable adventures.
  </p>

  <div className="flex gap-4 mt-4">
    <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-colors">
      <FaFacebook size={18} />
    </a>
    <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
      <FaInstagram size={18} />
    </a>
    <a href="#" aria-label="Twitter" className="text-white/70 hover:text-white transition-colors">
      <FaTwitter size={18} />
    </a>
  </div>
</div>

        {/* Quick Links */}
        <div>
          <p className="font-heading font-semibold text-sm uppercase tracking-wide text-white/90">
            Explore
          </p>

          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="font-heading font-semibold text-sm uppercase tracking-wide text-white/90">
            Support
          </p>

          <ul className="mt-4 space-y-2">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-heading font-semibold text-sm uppercase tracking-wide text-white/90">
            Contact
          </p>

          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-2 text-sm text-white/70">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>Kathmandu, Nepal</span>
            </li>

            <li className="flex items-center gap-2 text-sm text-white/70">
              <Phone size={16} className="shrink-0" />
              <span>+977 98XXXXXXXX</span>
            </li>

            <li className="flex items-center gap-2 text-sm text-white/70">
              <Mail size={16} className="shrink-0" />
              <span>hello@paila.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 text-sm text-white/60 text-center">
          © {new Date().getFullYear()} Paila. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
