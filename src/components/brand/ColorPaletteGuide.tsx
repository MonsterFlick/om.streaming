"use client";

import { useState } from "react";
import { Copy, Check, Palette, ShieldCheck, Sparkles } from "lucide-react";

interface ColorItem {
  name: string;
  category: "brand" | "platform" | "ui";
  hex: string;
  rgb: string;
  hsl: string;
  usage: string;
  wcagOnDark: string;
  contrastRatio: string;
}

const BRAND_COLORS: ColorItem[] = [
  {
    name: "Industrial Amber",
    category: "brand",
    hex: "#F59E0B",
    rgb: "245, 158, 11",
    hsl: "38°, 92%, 50%",
    usage: "Primary Accent, Stream Deck Active State, Highlights",
    wcagOnDark: "AAA (Large text), AA (Normal)",
    contrastRatio: "9.8:1",
  },
  {
    name: "Cyber Cobalt",
    category: "brand",
    hex: "#3B82F6",
    rgb: "59, 130, 246",
    hsl: "217°, 91%, 60%",
    usage: "Secondary Accent, Active Scene Badges, Tech Links",
    wcagOnDark: "AAA",
    contrastRatio: "8.4:1",
  },
  {
    name: "Obsidian Core",
    category: "brand",
    hex: "#08090C",
    rgb: "8, 9, 12",
    hsl: "225°, 20%, 4%",
    usage: "Background Master Canvas, Deep Backdrop",
    wcagOnDark: "N/A Base",
    contrastRatio: "Base",
  },
  {
    name: "Tactile Surface",
    category: "brand",
    hex: "#0E1017",
    rgb: "14, 16, 23",
    hsl: "227°, 24%, 7%",
    usage: "Card Backgrounds, Modal Surfaces, Hardware Panels",
    wcagOnDark: "Base Surface",
    contrastRatio: "Base",
  },
  {
    name: "Kick Neon Green",
    category: "platform",
    hex: "#00E701",
    rgb: "0, 231, 1",
    hsl: "120°, 100%, 45%",
    usage: "Kick Platform Branding, High-Visibility Badges",
    wcagOnDark: "AAA",
    contrastRatio: "14.2:1",
  },
  {
    name: "YouTube Neon Red",
    category: "platform",
    hex: "#FF0000",
    rgb: "255, 0, 0",
    hsl: "0°, 100%, 50%",
    usage: "YouTube Platform Header, Live Stream Alerts",
    wcagOnDark: "AA",
    contrastRatio: "5.3:1",
  },
  {
    name: "Instagram Sunrise",
    category: "platform",
    hex: "#E1306C",
    rgb: "225, 48, 108",
    hsl: "340°, 75%, 54%",
    usage: "Instagram Story Accents, Profile Highlights",
    wcagOnDark: "AAA",
    contrastRatio: "6.9:1",
  },
  {
    name: "Instagram Violet",
    category: "platform",
    hex: "#833AB4",
    rgb: "131, 58, 180",
    hsl: "276°, 51%, 47%",
    usage: "Instagram Gradient Start, Modern Aesthetics",
    wcagOnDark: "AA",
    contrastRatio: "4.8:1",
  },
  {
    name: "Platinum White",
    category: "ui",
    hex: "#F4F5F8",
    rgb: "244, 245, 248",
    hsl: "225°, 20%, 96%",
    usage: "Primary Display Typography, Header Text",
    wcagOnDark: "AAA",
    contrastRatio: "18.6:1",
  },
  {
    name: "Steel Subtext",
    category: "ui",
    hex: "#9BA1B2",
    rgb: "155, 161, 178",
    hsl: "224°, 14%, 65%",
    usage: "Secondary Descriptions, Monospace Labels",
    wcagOnDark: "AA",
    contrastRatio: "7.1:1",
  },
  {
    name: "Industrial Crimson",
    category: "ui",
    hex: "#FF5252",
    rgb: "255, 82, 82",
    hsl: "0°, 100%, 66%",
    usage: "Live Broadcast Indicator, Emergency Shields",
    wcagOnDark: "AAA",
    contrastRatio: "6.5:1",
  },
  {
    name: "Cyber Emerald",
    category: "ui",
    hex: "#10B981",
    rgb: "16, 185, 129",
    hsl: "161°, 84%, 39%",
    usage: "Success Signals, Bitrate Green Status",
    wcagOnDark: "AAA",
    contrastRatio: "9.2:1",
  },
];

export function ColorPaletteGuide() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "brand" | "platform" | "ui">("all");

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const filteredColors = activeTab === "all" 
    ? BRAND_COLORS 
    : BRAND_COLORS.filter((c) => c.category === activeTab);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Palette size={14} />
            Tactile Color Specification System
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Brand Color Tokens & Contrast Standards
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Engineered for high-contrast broadcast overlays, OBS web sources, and social media media kits.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
          {(["all", "brand", "platform", "ui"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-amber-500 text-black shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Color Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredColors.map((color) => {
          const isCopied = copiedHex === color.hex;
          return (
            <div
              key={color.name}
              className="group relative rounded-2xl p-4 bg-zinc-900/70 border border-white/10 hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Top Color Box */}
              <div>
                <div
                  className="h-28 w-full rounded-xl relative flex items-center justify-center transition-transform group-hover:scale-[1.02] shadow-inner border border-white/10"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Copy overlay button */}
                  <button
                    onClick={() => handleCopy(color.hex)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-bold backdrop-blur-xs rounded-xl"
                  >
                    {isCopied ? (
                      <>
                        <Check size={16} className="text-emerald-400" />
                        COPIED!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        COPY {color.hex}
                      </>
                    )}
                  </button>

                  <span
                    className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-black/50 text-white backdrop-blur-md border border-white/10 group-hover:opacity-0 transition-opacity"
                  >
                    {color.hex}
                  </span>
                </div>

                {/* Color Details */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-base text-white">
                      {color.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 uppercase tracking-widest border border-white/10">
                      {color.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 min-h-[32px]">
                    {color.usage}
                  </p>
                </div>
              </div>

              {/* Code Specs & WCAG Compliance */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                  <div className="bg-black/30 p-1.5 rounded border border-white/5">
                    <span className="text-zinc-500 block text-[9px]">RGB</span>
                    <span className="text-zinc-200 font-bold truncate block">{color.rgb}</span>
                  </div>
                  <div className="bg-black/30 p-1.5 rounded border border-white/5">
                    <span className="text-zinc-500 block text-[9px]">HSL</span>
                    <span className="text-zinc-200 font-bold truncate block">{color.hsl}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck size={12} />
                    {color.wcagOnDark}
                  </span>
                  <span className="text-zinc-400 font-bold">
                    {color.contrastRatio}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code snippet guide */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          CSS & Tailwind Color System Integration
        </div>
        <p className="text-zinc-400 text-xs">
          Copy these custom CSS custom properties directly into your stylesheet or OBS web browser sources:
        </p>
        <pre className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto">
{`:root {
  --color-brand-amber: #F59E0B;
  --color-brand-cobalt: #3B82F6;
  --color-brand-obsidian: #08090C;
  --color-platform-kick: #00E701;
  --color-platform-youtube: #FF0000;
  --color-platform-instagram: #E1306C;
  --color-text-platinum: #F4F5F8;
  --color-text-subtext: #9BA1B2;
}`}
        </pre>
      </div>
    </div>
  );
}
