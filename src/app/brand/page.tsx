"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Tv, Shield, Palette } from "lucide-react";
import { ObsMasterLogo } from "@/components/brand/ObsMasterLogo";
import { ObsMasterBanner } from "@/components/brand/ObsMasterBanner";
import { ObsColorTokens } from "@/components/brand/ObsColorTokens";

export default function BrandStudioPage() {
  return (
    <div className="relative min-h-screen bg-[#050508] text-[#f4f5f8] p-6 md:p-12 overflow-x-hidden">
      {/* Ambient background grids & glows */}
      <div className="studio-canvas-bg" />
      <div className="studio-grid" />

      {/* Header Bar */}
      <header className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-purple-500/40 text-zinc-400 hover:text-purple-300 transition-all"
            title="Return to Studio Landing"
          >
            <ArrowLeft size={18} />
          </Link>

          <ObsMasterLogo width={260} height={80} />
        </div>

        <div className="flex items-center gap-3">
          <div className="status-pill">
            <span className="status-dot live" />
            <span>UNCOMPILED.OM BRAND // 100% CODE GENERATED</span>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Notice Badge */}
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3 text-purple-300 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400 shrink-0" />
            <span>
              <strong>CYBER TECH THEME:</strong> Master logo and stream banner match your exact UNCOMPILED OM stepped frame brand mark. Zero AI image generation.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-purple-500/20 font-bold border border-purple-500/30 text-[10px] shrink-0 hidden sm:inline-block">
            100% CODE GENERATED
          </span>
        </div>

        {/* Section 1: Official Master Cyber Stream Banner */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
            <Tv size={16} />
            SECTION 01 // MASTER CYBER STREAM BANNER
          </div>
          <ObsMasterBanner />
        </section>

        {/* Section 2: Official Cyber Tech Logo */}
        <section className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
              <Shield size={16} />
              SECTION 02 // OFFICIAL UNCOMPILED OM CYBER TECH LOGO
            </div>
            <span className="font-mono text-[10px] text-zinc-500">STEPPED CYBER FRAME</span>
          </div>

          <div className="p-8 rounded-2xl bg-[#050508] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <ObsMasterLogo width={360} height={110} />

            <div className="font-mono text-xs text-zinc-400 bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
              <div className="text-purple-400 font-bold">LOGO SPECIFICATIONS:</div>
              <div>● Architecture: Stepped Cyber Tech Frame Notch</div>
              <div>● Typography: UNCOMPILED + ✦ OM ✦ Spark Stars</div>
              <div>● Hazard Accents: Slanted 4-Stripes Gradient (///)</div>
              <div>● Theme: Dark Obsidian (#050508) & Cyber Purple (#a855f7)</div>
            </div>
          </div>
        </section>

        {/* Section 3: Official Color Tokens */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
            <Palette size={16} />
            SECTION 03 // COLOR SPECIFICATION PALETTE
          </div>
          <ObsColorTokens />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pt-12 mt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
        <div>UNCOMPILED.OM CYBER LOGO SUITE // NO AI IMAGE GEN</div>
        <div className="flex items-center gap-4">
          <span>PORT: 3000</span>
          <span>•</span>
          <span>CEF ACCELERATED</span>
        </div>
      </footer>
    </div>
  );
}
