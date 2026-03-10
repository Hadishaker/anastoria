"use client";
import { useState } from "react";

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [form, setForm] = useState({ name: "", email: "", rating: 5, body: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "rating" ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product_id: productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to submit review.");
      } else {
        setStatus("success");
        setMessage("Review submitted! It will appear after moderation.");
        setForm({ name: "", email: "", rating: 5, body: "" });
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const inputClass = "w-full bg-[#111111] border border-[#222222] text-white placeholder-[#444444] px-4 py-3 text-sm focus:outline-none focus:border-[#444444] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="review-name" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Name *</label>
          <input id="review-name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="review-email" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Email *</label>
          <input id="review-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="review-rating" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Rating *</label>
        <select id="review-rating" name="rating" value={form.rating} onChange={handleChange} required className={`${inputClass} cursor-pointer`}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)} — {n} {n === 1 ? "star" : "stars"}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="review-body" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Review *</label>
        <textarea
          id="review-body"
          name="body"
          value={form.body}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Tell us about your experience..."
          className={`${inputClass} resize-none`}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-8 py-3 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit Review"}
      </button>
      {message && (
        <p role="status" className={`text-xs tracking-wide ${status === "success" ? "text-[#aaaaaa]" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
