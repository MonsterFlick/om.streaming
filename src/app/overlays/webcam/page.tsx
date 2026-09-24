"use client";

import { WebcamFrame } from "@/components/overlays/WebcamFrame";

export default function StandaloneWebcamOverlayPage() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent p-2 select-none overflow-hidden">
      <WebcamFrame standalone className="w-full h-full" />
    </div>
  );
}
