"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      } else {
        setStatus("success");
        setMessage("You're on the list. Check your inbox.");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading" || status === "success"}
        className="flex-1 bg-[#111111] border border-[#222222] text-white placeholder-[#444444] px-4 py-3 text-sm focus:outline-none focus:border-[#444444] transition-colors disabled:opacity-50"
        aria-describedby={message ? "newsletter-msg" : undefined}
      />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-6 py-3 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {message && (
        <p
          id="newsletter-msg"
          role="status"
          className={`w-full text-xs mt-1 tracking-wide ${status === "success" ? "text-[#aaaaaa]" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
