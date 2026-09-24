"use client";

import { SponsorCard } from "@/components/overlays/SponsorCard";

export default function StandaloneSponsorPage() {
  return (
    <div className="w-full h-full bg-transparent p-6 flex items-end justify-start overflow-hidden">
      <SponsorCard />
    </div>
  );
}
