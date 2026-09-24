"use client";

import { useEffect, useState } from "react";
import { Heart, Calendar, Radio } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { AnimatedText } from "@/components/overlays/AnimatedText";

export default function StreamEndingOverlayPage() {
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
            <span className="status-dot live" />
            <span>SESSION CONCLUDED</span>
          </div>
        </div>

        <div className="status-pill">
          <Heart size={13} className="text-rose-400" />
          <span>THANK YOU COMMUNITY</span>
        </div>
      </header>

      {/* Center Layout Grid */}
      <main className="relative z-10 grid grid-cols-[1.1fr_0.9fr] gap-20 items-center">
        <div>
          <div className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase mb-4">
            STREAM WRAP-UP
          </div>

          <h1 className="font-display font-extrabold text-7xl text-white tracking-tight leading-[1.05]">
            <AnimatedText
              text="THANKS FOR WATCHING"
              preset="blur-focus"
            />
          </h1>

          <p className="mt-6 text-zinc-300 text-lg leading-relaxed max-w-xl font-medium">
            Incredible energy tonight. Thank you for hanging out, subscribing, and being part of the community. See you on the next broadcast!
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="font-mono text-[10px] text-zinc-400">SESSION TOP DONOR</div>
              <div className="font-display font-bold text-base text-amber-400 mt-0.5">
                {state.topDonation}
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="font-mono text-[10px] text-zinc-400">COMMUNITY REACH</div>
              <div className="font-display font-bold text-base text-white mt-0.5">
                {state.followerGoal.current} / {state.followerGoal.target} FOLLOWERS
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Links Card */}
        <div className="rounded-3xl bg-zinc-950/75 border border-white/10 backdrop-blur-2xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Calendar size={20} className="text-amber-400" />
            <span className="font-display font-bold text-base text-white">
              NEXT BROADCAST SCHEDULE
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
              <div>
                <div className="font-display font-bold text-sm text-zinc-100">
                  Late Night Coding & Tech Deep Dive
                </div>
                <div className="font-mono text-xs text-zinc-400 mt-0.5">
                  FRIDAY @ 9:00 PM EST
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                LIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
              <div>
                <div className="font-display font-bold text-sm text-zinc-100">
                  Community Reaction & Chill Gaming
                </div>
                <div className="font-mono text-xs text-zinc-400 mt-0.5">
                  SUNDAY @ 8:00 PM EST
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-zinc-400 px-3 py-1 rounded-full bg-white/5">
                UPCOMING
              </span>
            </div>
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
