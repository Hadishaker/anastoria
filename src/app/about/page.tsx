import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Anastoria.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto py-16">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-6">About</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-wider uppercase text-white mb-16 leading-tight">
            The Story
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <p className="text-[#666666] leading-relaxed font-light mb-6">
              Anastoria was born from the space between. Between night and morning, between stillness and movement,
              between what is seen and what is felt.
            </p>
            <p className="text-[#555555] leading-relaxed font-light mb-6">
              We make one thing. One hoodie, done right. Available in two colors — Midnight Black and Off-White —
              because some choices don&apos;t need more than two options.
            </p>
            <p className="text-[#444444] leading-relaxed font-light">
              The name Anastoria comes from a place that doesn&apos;t exist on any map but exists in everyone who has
              ever stayed up past the point when the world goes quiet.
            </p>
          </div>
          <div className="space-y-8">
            <div className="border-l border-[#222222] pl-6">
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-2">Philosophy</p>
              <p className="text-[#888888] font-light leading-relaxed">
                Less is more. One product. Done perfectly.
              </p>
            </div>
            <div className="border-l border-[#222222] pl-6">
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-2">Material</p>
              <p className="text-[#888888] font-light leading-relaxed">
                Premium heavyweight fleece. Built to last.
              </p>
            </div>
            <div className="border-l border-[#222222] pl-6">
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-2">The Sky</p>
              <p className="text-[#888888] font-light leading-relaxed">
                Every buyer becomes part of something larger — a sky full of people who claimed their star.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#111111] pt-16">
          <blockquote className="text-2xl md:text-3xl font-light text-[#333333] tracking-wide leading-relaxed italic">
            &ldquo;Some nights are made to be worn.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
