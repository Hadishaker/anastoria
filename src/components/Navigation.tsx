"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/sky", label: "Sky" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#222222] bg-[#080808]/90 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="text-xl font-light tracking-[0.3em] uppercase text-white hover:opacity-70 transition-opacity">
          Anastoria
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm tracking-widest uppercase transition-all ${
                  pathname === href
                    ? "text-white border-b border-white pb-0.5"
                    : "text-[#aaaaaa] hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#aaaaaa] hover:text-white transition-colors p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="block w-5 h-px bg-current mb-1.5 transition-all" style={{ transform: open ? "rotate(45deg) translate(2px, 2px)" : "none" }} />
          <span className="block w-5 h-px bg-current mb-1.5 transition-all" style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-5 h-px bg-current transition-all" style={{ transform: open ? "rotate(-45deg) translate(2px, -2px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#080808] border-t border-[#222222]">
          <ul className="flex flex-col py-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-6 py-3 text-sm tracking-widest uppercase transition-all ${
                    pathname === href ? "text-white" : "text-[#aaaaaa] hover:text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
