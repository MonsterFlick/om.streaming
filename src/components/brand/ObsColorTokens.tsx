"use client";

import { useState } from "react";
import { Palette, Copy, Check } from "lucide-react";

const OBS_COLORS = [
  { name: "Cyber Purple", hex: "#A855F7", rgb: "168, 85, 247", role: "Primary Neon Logo & Stepped Frame Accent" },
  { name: "Industrial Amber", hex: "#F59E0B", rgb: "245, 158, 11", role: "OBS Stream Accent & Active Indicators" },
  { name: "Cyber Cobalt", hex: "#3B82F6", rgb: "59, 130, 246", role: "Active Scene Telemetry & Stream Status" },
  { name: "Live Crimson", hex: "#FF4757", rgb: "255, 71, 87", role: "Live Broadcast Indicator LED Dot" },
  { name: "Obsidian Core", hex: "#050508", rgb: "5, 5, 8", role: "Master Stream Pitch Black Canvas Background" },
  { name: "Tactile Surface", hex: "#0E1017", rgb: "14, 16, 23", role: "Hardware Glass Panels & Cyber Frame Fill" },
  { name: "Platinum White", hex: "#F4F5F8", rgb: "244, 245, 248", role: "UNCOMPILED Primary Header Typography" },
  { name: "Steel Subtext", hex: "#9BA1B2", rgb: "155, 161, 178", role: "Monospace Telemetry Labels & HUD Specs" },
];

export function ObsColorTokens() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10">
        <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
          <Palette size={14} />
          UNCOMPILED OM Color Specification Tokens
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          Cyber Tech Theme Palette
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OBS_COLORS.map((color) => {
          const isCopied = copiedHex === color.hex;
          return (
            <div
              key={color.name}
              className="group rounded-2xl p-4 bg-zinc-900/70 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className="h-24 w-full rounded-xl relative flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: color.hex }}
                >
                  <button
                    onClick={() => handleCopy(color.hex)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-bold rounded-xl"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {isCopied ? "COPIED" : color.hex}
                  </button>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-black/60 text-white backdrop-blur-md border border-white/10 group-hover:opacity-0 transition-opacity">
                    {color.hex}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display font-bold text-base text-white">
                    {color.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {color.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-zinc-500 flex justify-between">
                <span>RGB: {color.rgb}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
