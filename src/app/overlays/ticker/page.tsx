"use client";

import { EventTicker } from "@/components/overlays/EventTicker";

export default function StandaloneTickerPage() {
  return (
    <div className="w-full h-full bg-transparent p-4 flex items-center justify-center overflow-hidden">
      <EventTicker />
    </div>
  );
}
