"use client";

import { useState } from "react";
import { Type, Sliders, Layers, Terminal } from "lucide-react";

export function TypographySystem() {
  const [customText, setCustomText] = useState("UNCOMPILED.OM // LIVE BROADCASTING");
  const [accentText, setAccentText] = useState("TACTILE INDUSTRIAL MINIMALISM");

  return (
    <div className="space-y-8">
      {/* Header & Interactive Text Controller */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Type size={14} />
              Brand Typography Hierarchy Engine
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Tactile Font System & Scale
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <Sliders size={14} className="text-amber-400" />
            <span>INTERACTIVE TESTER</span>
          </div>
        </div>

        {/* Live input controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 font-bold">
              PRIMARY BRAND DISPLAY TITLE
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-display focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="Enter brand name..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 font-bold">
              SUBTITLE & MONOSPACE SPEC
            </label>
            <input
              type="text"
              value={accentText}
              onChange={(e) => setAccentText(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="Enter subtext..."
            />
          </div>
        </div>
      </div>

      {/* Font Family Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Font 1: Syne (Display) */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber-400 font-extrabold uppercase tracking-widest">
                DISPLAY FONT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                GOOGLE FONTS
              </span>
            </div>
            <h3 className="font-display font-black text-3xl text-white mt-2">
              Syne
            </h3>
            <p className="text-zinc-400 text-xs mt-1">
              Ultra-bold geometric display typeface engineered for maximum visual punch on banners, stream titles, and overlays.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <p className="font-display font-black text-2xl text-amber-400 tracking-tight">
              Aa Bb Cc 123
            </p>
            <p className="font-display font-extrabold text-sm text-zinc-300">
              {customText}
            </p>
            <div className="pt-2 font-mono text-[10px] text-zinc-500 flex justify-between border-t border-white/5">
              <span>WEIGHTS: 700 / 800</span>
              <span>DISPLAY UI</span>
            </div>
          </div>
        </div>

        {/* Font 2: Plus Jakarta Sans (Body & UI) */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-blue-400 font-extrabold uppercase tracking-widest">
                BODY & DASHBOARD UI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                GOOGLE FONTS
              </span>
            </div>
            <h3 className="font-sans font-bold text-3xl text-white mt-2">
              Plus Jakarta Sans
            </h3>
            <p className="text-zinc-400 text-xs mt-1">
              Ergonomic geometric sans-serif tuned for screen clarity, chat feeds, alert modals, and dashboard controls.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <p className="font-sans font-bold text-xl text-blue-400">
              Aa Bb Cc 123
            </p>
            <p className="font-sans font-medium text-sm text-zinc-300">
              {customText}
            </p>
            <div className="pt-2 font-mono text-[10px] text-zinc-500 flex justify-between border-t border-white/5">
              <span>WEIGHTS: 400 / 600 / 800</span>
              <span>BODY UI</span>
            </div>
          </div>
        </div>

        {/* Font 3: Space Mono (Tactile Tech Spec) */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400 font-extrabold uppercase tracking-widest">
                TACTILE MONOSPACE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                GOOGLE FONTS
              </span>
            </div>
            <h3 className="font-mono font-bold text-3xl text-white mt-2">
              Space Mono
            </h3>
            <p className="text-zinc-400 text-xs mt-1">
              Industrial monospaced font used for stream deck buttons, live telemetry, timestamps, and social tags.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <p className="font-mono font-bold text-xl text-emerald-400">
              Aa Bb Cc 123
            </p>
            <p className="font-mono font-bold text-xs text-zinc-300">
              {accentText}
            </p>
            <div className="pt-2 font-mono text-[10px] text-zinc-500 flex justify-between border-t border-white/5">
              <span>WEIGHTS: 400 / 700</span>
              <span>DATA & CODE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typography Hierarchy Scale Showcase */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Layers size={14} />
            Type Hierarchy & Banner Scale Specifications
          </div>
          <span className="font-mono text-[10px] text-zinc-400">CSS DISPLAY RATIOS</span>
        </div>

        <div className="space-y-6">
          {/* Level 1: Banner Super Title */}
          <div className="p-5 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-amber-500 font-extrabold uppercase">
                HERO BANNER TITLE (SYNE BLACK • 64PX / 4rem)
              </span>
              <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
                {customText}
              </h1>
            </div>
            <div className="font-mono text-[11px] text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
              font-extrabold tracking-tight
            </div>
          </div>

          {/* Level 2: Section Heading */}
          <div className="p-5 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-blue-400 font-extrabold uppercase">
                SUB-HEADER / PLATFORM SLOGAN (SYNE BOLD • 32PX / 2rem)
              </span>
              <h2 className="font-display font-bold text-xl md:text-2xl text-zinc-100">
                {accentText}
              </h2>
            </div>
            <div className="font-mono text-[11px] text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
              font-bold text-zinc-100
            </div>
          </div>

          {/* Level 3: Tactile Data Pill */}
          <div className="p-5 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-emerald-400 font-extrabold uppercase">
                TACTILE STREAM BADGE (SPACE MONO BOLD • 12PX)
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase">
                  ● {accentText}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono text-xs font-bold text-amber-400 tracking-widest uppercase">
                  @UNCOMPILED.OM
                </span>
              </div>
            </div>
            <div className="font-mono text-[11px] text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
              font-mono text-xs tracking-widest
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
