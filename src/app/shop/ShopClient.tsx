"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ReviewForm from "@/components/ReviewForm";

const ShopifyBuyButton = dynamic(() => import("@/components/ShopifyBuyButton"), { ssr: false });

const PRODUCT_ID = process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_ID ?? "SHOPIFY_PRODUCT_ID";
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "your-store.myshopify.com";
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "your-storefront-access-token";

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  created_at: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-[#333333]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ShopClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedColor, setSelectedColor] = useState<"black" | "off-white">("black");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?product_id=anastoria-hoodie`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []));
  }, []);

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <p className="text-xs text-[#444444] tracking-widest uppercase">Shop / Anastoria Hoodie</p>
        </nav>

        {/* Product section */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Product image placeholder */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#111111] border border-[#1a1a1a] flex items-center justify-center">
              <div className="text-center p-12">
                <p className="text-7xl font-light text-[#1f1f1f] tracking-[0.2em] uppercase">A</p>
                <p className="text-xs text-[#333333] tracking-[0.3em] uppercase mt-6">Anastoria Hoodie</p>
                <p className="text-xs text-[#2a2a2a] tracking-widest uppercase mt-2">
                  {selectedColor === "black" ? "Midnight Black" : "Off-White"}
                </p>
              </div>
            </div>
            {/* Color thumbnails */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedColor("black")}
                className={`flex-1 py-3 text-xs tracking-widest uppercase border transition-all ${
                  selectedColor === "black" ? "border-white text-white" : "border-[#222222] text-[#555555] hover:border-[#444444]"
                }`}
                aria-pressed={selectedColor === "black"}
              >
                Midnight Black
              </button>
              <button
                onClick={() => setSelectedColor("off-white")}
                className={`flex-1 py-3 text-xs tracking-widest uppercase border transition-all ${
                  selectedColor === "off-white" ? "border-white text-white" : "border-[#222222] text-[#555555] hover:border-[#444444]"
                }`}
                aria-pressed={selectedColor === "off-white"}
              >
                Off-White
              </button>
            </div>
          </div>

          {/* Product info */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-4">Anastoria</p>
            <h1 className="text-3xl md:text-4xl font-light tracking-wider uppercase text-white mb-4">
              The Hoodie
            </h1>

            {avgRating !== null && (
              <div className="flex items-center gap-2 mb-6">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-xs text-[#555555]">{avgRating} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </div>
            )}

            <p className="text-2xl text-white font-light tracking-wider mb-6">$80</p>

            <div className="mb-8">
              <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">Color</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedColor("black")}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === "black" ? "border-white" : "border-[#333333] hover:border-[#555555]"
                  } bg-[#111111]`}
                  aria-label="Midnight Black"
                  aria-pressed={selectedColor === "black"}
                />
                <button
                  onClick={() => setSelectedColor("off-white")}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === "off-white" ? "border-white" : "border-[#333333] hover:border-[#555555]"
                  } bg-[#e8e4dc]`}
                  aria-label="Off-White"
                  aria-pressed={selectedColor === "off-white"}
                />
              </div>
              <p className="text-sm text-[#555555] mt-2">{selectedColor === "black" ? "Midnight Black" : "Off-White"}</p>
            </div>

            <p className="text-sm text-[#666666] leading-relaxed mb-10 font-light">
              Premium heavyweight fleece. Dropped shoulders. Kangaroo pocket.
              Crafted for those who inhabit the space between day and night.
              Available in Midnight Black and Off-White.
            </p>

            {/* Shopify Buy Button */}
            <div className="mb-8">
              <ShopifyBuyButton
                productId={PRODUCT_ID}
                domain={SHOPIFY_DOMAIN}
                storefrontAccessToken={SHOPIFY_TOKEN}
              />
            </div>

            <div className="border-t border-[#1a1a1a] pt-8 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#555555] tracking-widest uppercase">Material</span>
                <span className="text-[#aaaaaa]">Premium Heavyweight Fleece</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#555555] tracking-widest uppercase">Shipping</span>
                <span className="text-[#aaaaaa]">Worldwide</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#555555] tracking-widest uppercase">Checkout</span>
                <span className="text-[#aaaaaa]">Secure via Shopify</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="border-t border-[#111111] pt-16 pb-24" aria-label="Customer reviews">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-light tracking-wider uppercase text-white mb-1">Reviews</h2>
              {avgRating !== null && (
                <p className="text-sm text-[#555555]">{avgRating} / 5 · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
              )}
            </div>
            <button
              onClick={() => setShowReviewForm((v) => !v)}
              className="px-6 py-2.5 border border-[#333333] text-[#aaaaaa] text-xs tracking-[0.3em] uppercase hover:border-white hover:text-white transition-all"
              aria-expanded={showReviewForm}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-12 bg-[#0d0d0d] border border-[#1a1a1a] p-8">
              <h3 className="text-sm tracking-widest uppercase text-white mb-8">Write a Review</h3>
              <ReviewForm productId="anastoria-hoodie" />
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#444444] text-sm tracking-wider">No reviews yet. Be the first.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <article key={review.id} className="border-b border-[#111111] pb-8">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white tracking-wide">{review.name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <time className="text-xs text-[#444444]" dateTime={review.created_at}>
                      {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </time>
                  </div>
                  <p className="text-sm text-[#888888] leading-relaxed font-light">{review.body}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
