import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Anastoria",
    template: "%s | Anastoria",
  },
  description: "Premium hoodies crafted for those who carry the night.",
  keywords: ["anastoria", "hoodie", "streetwear", "premium"],
  metadataBase: new URL("https://anastoria.com"),
  openGraph: {
    siteName: "Anastoria",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#080808] text-[#f0f0f0]">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
