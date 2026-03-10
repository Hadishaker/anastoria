import type { Metadata } from "next";
import SkyClient from "./SkyClient";

export const metadata: Metadata = {
  title: "Sky",
  description: "Claim your star in the Anastoria sky.",
};

export default function SkyPage() {
  return <SkyClient />;
}
