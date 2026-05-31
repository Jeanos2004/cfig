"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, Phone, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Formations", href: "/formations" },
  { name: "Témoignages", href: "/temoignages" },
  { name: "Galerie", href: "/galerie" },
  { name: "Actualités", href: "/actualites" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full z-50 sticky top-0 shadow-md">

      {/* === TOP BAR — Schule style === */}
      <div className="hidden lg:block bg-[var(--color-primary)] text-white text-xs py-2.5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

          {/* Left: contact info */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:cfigguinee@gmail.com"
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--color-light)]" />
              cfigguinee@gmail.com
            </a>
            <a
              href="tel:+224622886773"
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--color-light)]" />
              +224 622 88 67 73 / 626 62 51 62
            </a>
          </div>

          {/* Right: social icons */}
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs">Suivez-nous</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[var(--color-light)] transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[var(--color-light)] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* === MAIN NAV === */}
      <nav className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-[var(--color-primary)] flex items-center justify-center">
                <GraduationCap className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <span className="block text-[18px] font-heading font-extrabold text-[var(--color-primary)] leading-tight tracking-tight">
                  CFIG Guinée
                </span>
                <span className="block text-[9px] font-sans font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Cabinet de Formation
                </span>
              </div>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-[13px] font-sans font-semibold uppercase tracking-wide transition-colors relative",
                      isActive
                        ? "text-[var(--color-accent)]"
                        : "text-gray-600 hover:text-[var(--color-primary)]"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-accent)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA button */}
            <div className="hidden md:block">
              <Link
                href="/inscription"
                className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors"
              >
                S'inscrire
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[var(--color-primary)] border border-gray-200 hover:border-[var(--color-accent)] transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-sm font-bold uppercase tracking-wider border-l-4 transition-all",
                      isActive
                        ? "border-[var(--color-accent)] text-[var(--color-primary)] bg-blue-50"
                        : "border-transparent text-gray-600 hover:border-[var(--color-light)] hover:text-[var(--color-primary)] hover:bg-gray-50"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-gray-100">
                <Link
                  href="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  S'inscrire en ligne
                </Link>
                <div className="mt-3 text-center text-xs text-gray-400 space-y-1">
                  <div>+224 622 88 67 73</div>
                  <div>cfigguinee@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
