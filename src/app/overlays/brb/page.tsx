"use client";

import { useEffect, useState } from "react";
import { Coffee, Radio, Sparkles } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { AnimatedText } from "@/components/overlays/AnimatedText";
import { SponsorCard } from "@/components/overlays/SponsorCard";
import { ChatWidget } from "@/components/overlays/ChatWidget";

export default function BRBOverlayPage() {
  const [state, setState] = useState<StreamState>(streamBus.getState());

  useEffect(() => {
    return streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });
  }, []);

  return (
    <div className="relative w-full h-full p-12 flex flex-col justify-between overflow-hidden bg-[#08090d]">
      <div className="studio-canvas-bg" />
      <div className="studio-grid" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-display font-extrabold text-2xl tracking-tight text-white">
            uncompiled<span className="text-amber-500">.</span>om
          </div>
          <div className="status-pill">
            <span className="status-dot amber" />
            <span>INTERMISSION // PAUSED</span>
          </div>
        </div>

        <div className="status-pill">
          <Coffee size={13} className="text-amber-400" />
          <span>BE RIGHT BACK</span>
        </div>
      </header>

      {/* Center Layout Grid */}
      <main className="relative z-10 grid grid-cols-[1.1fr_0.9fr] gap-20 items-center">
        <div>
          <div className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase mb-4">
            STREAM INTERMISSION
          </div>

          <h1 className="font-display font-extrabold text-7xl text-white tracking-tight leading-[1.05]">
            <AnimatedText
              text="BE RIGHT BACK"
              preset="blur-focus"
            />
          </h1>

          <p className="mt-6 text-zinc-300 text-lg leading-relaxed max-w-xl font-medium">
            Stepping away from the desk for a brief moment. Grab a drink, stretch, and check out our studio partners.
          </p>

          <div className="mt-10">
            <SponsorCard />
          </div>
        </div>

        {/* Live Chat Dock on Right */}
        <div className="h-[480px] rounded-3xl bg-zinc-950/75 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl flex flex-col overflow-hidden">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              INTERMISSION CHAT // LIVE
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ChatWidget maxMessages={12} />
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 border-t border-white/10 pt-6">
        <AnimatedText
          text={state.tickerText}
          preset="marquee"
          className="font-mono text-xs text-zinc-400 tracking-wider"
        />
      </footer>
    </div>
  );
}
