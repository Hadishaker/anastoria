"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // For now, just simulate sending — integrate with Resend or a form service
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setMsg("Message sent. We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  const inputClass = "w-full bg-[#111111] border border-[#222222] text-white placeholder-[#444444] px-4 py-3 text-sm focus:outline-none focus:border-[#444444] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Name *</label>
        <input id="contact-name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Email *</label>
        <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className={inputClass} />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-xs tracking-widest uppercase text-[#666666] mb-2">Message *</label>
        <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Your message..." className={`${inputClass} resize-none`} />
      </div>
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-8 py-3 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {msg && (
        <p role="status" className={`text-xs tracking-wide ${status === "success" ? "text-[#aaaaaa]" : "text-red-400"}`}>
          {msg}
        </p>
      )}
    </form>
  );
}
