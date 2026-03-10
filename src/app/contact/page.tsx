import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Anastoria.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto py-16">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-6">Contact</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-wider uppercase text-white mb-6 leading-tight">
            Get in Touch
          </h1>
          <p className="text-[#555555] font-light leading-relaxed">
            Questions about your order, sizing, or anything else — we&apos;re here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <ContactForm />
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-3">Email</p>
              <a href="mailto:hello@anastoria.com" className="text-[#888888] hover:text-white transition-colors font-light">
                hello@anastoria.com
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-3">Response Time</p>
              <p className="text-[#888888] font-light">Usually within 24 hours.</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-[#444444] mb-3">Orders</p>
              <p className="text-[#888888] font-light">Order issues are handled through Shopify. Check your confirmation email for order details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
