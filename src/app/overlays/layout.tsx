"use client";

import { useEffect, useState, useRef } from "react";
import { AlertBox } from "@/components/overlays/AlertBox";

export default function OverlaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      const parentWidth = parent ? parent.clientWidth : window.innerWidth;
      const parentHeight = parent ? parent.clientHeight : window.innerHeight;

      if (parentWidth > 0 && parentHeight > 0) {
        // Calculate exact scale factor so 1920x1080 canvas fits viewport 100% perfectly
        const scaleX = parentWidth / 1920;
        const scaleY = parentHeight / 1080;
        // In OBS browser source at 1920x1080, scale = 1.0
        // In browser tab or preview dock, scale adjusts dynamically to fit window
        const fitScale = Math.min(scaleX, scaleY);
        setScale(fitScale);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-transparent flex items-center justify-center overflow-hidden select-none"
    >
      <div
        className="w-[1920px] h-[1080px] relative overflow-hidden shrink-0 origin-center transition-transform duration-75"
        style={{
          transform: `scale(${scale})`,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        <AlertBox />
        {children}
      </div>
    </div>
  );
}
