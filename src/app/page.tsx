"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tv, Smartphone, Layers, Radio, Sparkles, ExternalLink, Palette } from "lucide-react";
import { streamBus, INITIAL_STREAM_STATE } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { UncompiledOmCyberLogo } from "@/components/brand/UncompiledOmCyberLogo";

export default function StudioLandingPage() {
  const [state, setState] = useState<StreamState>(INITIAL_STREAM_STATE);

  useEffect(() => {
    setState(streamBus.getState());
    return streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });
  }, []);

  const scenes = [
    { name: "01 Starting Soon", path: "/overlays/starting", desc: "Countdown mesh & episode rundown" },
    { name: "02 Talk / React", path: "/overlays/chatting", desc: "Split-screen media, cam & chat" },
    { name: "03 In-Game HUD", path: "/overlays/game", desc: "Minimalist gaming dock & event ticker" },
    { name: "04 Be Right Back", path: "/overlays/brb", desc: "Intermission with sponsor rotation" },
    { name: "05 Stream Ending", path: "/overlays/ending", desc: "Credits scroll & top supporters" },
    { name: "★ Standalone Webcam", path: "/overlays/webcam", desc: "Dedicated modular camera dock for OBS nested scenes" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden">
      <div className="studio-canvas-bg" />
      <div className="studio-grid" />

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <UncompiledOmCyberLogo width={220} height={68} showBackground={false} accentColor="#a855f7" />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/brand"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold transition-all"
          >
            <Palette size={14} />
            BRAND ASSETS STUDIO
          </Link>
          <div className="status-pill">
            <span className={`status-dot ${state.isLive ? "live" : "amber"}`} />
            <span>{state.isLive ? "BROADCAST ACTIVE" : "OFFLINE"}</span>
          </div>
          <div className="status-pill hidden sm:inline-flex">
            <span className="status-dot cobalt" />
            <span>SCENE: {state.currentScene.toUpperCase()}</span>
          </div>
        </div>
      </header>

      {/* Main Dual/Triple Hero Grid */}
      <main className="relative z-10 my-auto py-12 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Executive Control Deck */}
        <Link
          href="/dashboard"
          className="group relative rounded-3xl p-6 bg-zinc-900/60 hover:bg-zinc-900/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Tv size={100} />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Tv size={13} />
              PC Master Control
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white group-hover:text-amber-400 transition-colors">
              Executive Dashboard
            </h2>
            <p className="mt-2 text-zinc-400 text-xs leading-relaxed">
              Live multi-screen 16:9 OBS previews, text animation studio, alert simulator, sponsor cards, Twitch chat, and webcam mode switcher.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 font-mono text-xs text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
            LAUNCH CONTROL DECK →
          </div>
        </Link>

        {/* Card 2: Virtual Stream Deck */}
        <Link
          href="/deck"
          className="group relative rounded-3xl p-6 bg-zinc-900/60 hover:bg-zinc-900/90 border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Smartphone size={100} />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Smartphone size={13} />
              Mobile & Tablet Touch Pad
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white group-hover:text-blue-400 transition-colors">
              Virtual Stream Deck
            </h2>
            <p className="mt-2 text-zinc-400 text-xs leading-relaxed">
              Tactile hardware-style buttons for 1-touch scene switching, mic mutes, soundboard effects, panic shield, and confetti on your phone or tablet.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 font-mono text-xs text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
            OPEN STREAM DECK →
          </div>
        </Link>

        {/* Card 3: Code Brand Assets & Media Kit */}
        <Link
          href="/brand"
          className="group relative rounded-3xl p-6 bg-zinc-900/60 hover:bg-zinc-900/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Palette size={100} />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Palette size={13} />
              Code-Based Media Kit
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white group-hover:text-emerald-400 transition-colors">
              Brand Assets Studio
            </h2>
            <p className="mt-2 text-zinc-400 text-xs leading-relaxed">
              Generate & export brand color tokens, typography scales, vector logos, and social media banners/avatars for Instagram, YouTube, and Kick.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
            GENERATE BRAND ASSETS →
          </div>
        </Link>
      </main>

      {/* OBS Overlay Quick Links Section */}
      <section className="relative z-10 max-w-6xl mx-auto w-full pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-xs font-bold text-zinc-400 tracking-wider flex items-center gap-2">
            <Layers size={14} className="text-amber-400" />
            DIRECT OBS BROWSER SOURCE ROUTES
          </div>
          <span className="font-mono text-[11px] text-zinc-500">1920 × 1080 CANVAS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {scenes.map((scene) => (
            <Link
              key={scene.path}
              href={scene.path}
              target="_blank"
              className="p-3.5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/70 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="font-display font-bold text-xs text-zinc-200 group-hover:text-amber-400 flex items-center justify-between">
                  {scene.name}
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                </div>
                <div className="text-[10px] text-zinc-500 mt-1 line-clamp-2">
                  {scene.desc}
                </div>
              </div>
              <div className="font-mono text-[9px] text-zinc-400 mt-2 truncate">
                {scene.path}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
        <div>UNCOMPILED.OM PRODUCTION STUDIO // NEXT.JS 15 ENGINE</div>
        <div className="flex items-center gap-4">
          <span>PORT: 3000</span>
          <span>•</span>
          <span>CEF ACCELERATED</span>
        </div>
      </footer>
    </div>
  );
}
