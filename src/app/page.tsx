import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Home",
  description: "Anastoria — premium hoodies crafted for those who carry the night.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0d0d0d] to-[#080808] pointer-events-none" aria-hidden="true" />
        {/* Subtle glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-[#555555] mb-6">Limited Edition</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.15em] uppercase text-white mb-6 leading-none">
            Anastoria
          </h1>
          <p className="text-base md:text-lg text-[#666666] tracking-widest uppercase mb-4 font-light">
            Carry the night.
          </p>
          <p className="text-sm text-[#444444] max-w-md mx-auto mb-12 leading-relaxed font-light">
            One hoodie. Two colors. Endless nights. Crafted for those who move between worlds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block px-10 py-3.5 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#e0e0e0] transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/sky"
              className="inline-block px-10 py-3.5 border border-[#333333] text-[#aaaaaa] text-xs tracking-[0.3em] uppercase hover:border-white hover:text-white transition-all"
            >
              Claim a Star
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#333333] animate-bounce" aria-hidden="true">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M8 4v16M2 14l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* Product teaser */}
      <section className="py-24 px-6 border-t border-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-4">The Collection</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-wider uppercase text-white mb-6">
                One Hoodie.<br />Two Worlds.
              </h2>
              <p className="text-[#666666] leading-relaxed mb-8 font-light">
                Available in Midnight Black and Off-White. Each piece is crafted from premium heavyweight fleece,
                designed for those who inhabit the space between day and night.
              </p>
              <div className="flex gap-3 mb-10">
                <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#555]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#e8e4dc]" />
                </div>
              </div>
              <p className="text-2xl text-white font-light tracking-wider mb-8">$80</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 border border-[#333333] text-[#aaaaaa] text-xs tracking-[0.3em] uppercase hover:border-white hover:text-white transition-all"
              >
                View Product
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-[#111111] border border-[#1a1a1a] flex items-center justify-center">
                <div className="text-center p-12">
                  <p className="text-6xl font-light text-[#1f1f1f] tracking-[0.2em] uppercase">A</p>
                  <p className="text-xs text-[#333333] tracking-[0.3em] uppercase mt-4">Anastoria Hoodie</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#1a1a1a]" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 border-t border-[#111111] bg-[#0a0a0a]">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-4">Stay in the loop</p>
          <h2 className="text-3xl font-light tracking-wider uppercase text-white mb-4">Join the List</h2>
          <p className="text-[#555555] mb-10 font-light text-sm leading-relaxed">
            Be the first to know about drops, restocks, and the story behind Anastoria.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Sky teaser */}
      <section className="py-24 px-6 border-t border-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-4">An Experience</p>
          <h2 className="text-3xl font-light tracking-wider uppercase text-white mb-6">The Sky</h2>
          <p className="text-[#555555] mb-10 font-light text-sm leading-relaxed max-w-md mx-auto">
            Every star in our sky is claimed by someone. Find yours. Leave your mark in the cosmos.
          </p>
          <Link
            href="/sky"
            className="inline-block px-10 py-3.5 border border-[#333333] text-[#aaaaaa] text-xs tracking-[0.3em] uppercase hover:border-white hover:text-white transition-all"
          >
            Explore the Sky
          </Link>
        </div>
      </section>
    </>
  );
}
