import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#222222] bg-[#080808] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="text-xl font-light tracking-[0.3em] uppercase text-white mb-2">Anastoria</p>
            <p className="text-sm text-[#666666]">Premium hoodies crafted for those who carry the night.</p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About" },
                { href: "/sky", label: "Sky" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#666666] hover:text-white transition-colors tracking-wider uppercase">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#444444]">© {new Date().getFullYear()} Anastoria. All rights reserved.</p>
          <p className="text-xs text-[#444444]">anastoria.com</p>
        </div>
      </div>
    </footer>
  );
}
