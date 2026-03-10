import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the Anastoria hoodie — available in Midnight Black and Off-White for $80.",
};

export default function ShopPage() {
  return <ShopClient />;
}
