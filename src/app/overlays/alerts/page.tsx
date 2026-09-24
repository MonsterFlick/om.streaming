"use client";

import { AlertBox } from "@/components/overlays/AlertBox";

export default function StandaloneAlertsPage() {
  return (
    <div className="w-full h-full bg-transparent relative overflow-hidden">
      <AlertBox />
    </div>
  );
}
