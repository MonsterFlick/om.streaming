"use client";

import { useEffect, useState } from "react";
import { Clock, Radio, Sparkles } from "lucide-react";
import { streamBus, INITIAL_STREAM_STATE } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { AnimatedText } from "@/components/overlays/AnimatedText";

export default function StartingSoonOverlayPage() {
  const [state, setState] = useState<StreamState>(INITIAL_STREAM_STATE);
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    const s = streamBus.getState();
    setState(s);
    if (s.timerSeconds) setSecondsLeft(s.timerSeconds);

    const unsub = streamBus.on("STATE_UPDATED", (newState) => {
      const s = newState as StreamState;
      setState(s);
      if (s.timerSeconds) setSecondsLeft(s.timerSeconds);
    });

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="relative w-full h-full p-12 flex flex-col justify-between overflow-hidden bg-[#07080b]">
      {/* Ambient dynamic gradient flow */}
      <div className="absolute -top-[30%] -left-[20%] w-[140%] h-[160%] bg-[radial-gradient(circle_at_30%_40%,rgba(245,158,11,0.12)_0%,transparent_45%),radial-gradient(circle_at_75%_60%,rgba(59,130,246,0.14)_0%,transparent_50%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.1)_0%,transparent_40%)] blur-[90px] animate-float-mesh pointer-events-none" />
      <div className="studio-grid" />

      {/* Top Meta Row */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-display font-extrabold text-2xl tracking-tight text-white">
            uncompiled<span className="text-amber-500">.</span>om
          </div>
          <div className="status-pill">
            <span className="status-dot amber" />
            <span>INITIALIZING BROADCAST</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span>1080P60 HDR</span>
          <span>•</span>
          <span>PRO AUDIO ENGINE</span>
        </div>
      </header>

      {/* Center Content Grid */}
      <main className="relative z-10 grid grid-cols-[1.1fr_0.9fr] gap-20 items-center">
        {/* Left Column: Big Editorial Title */}
        <div>
          <div className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase mb-4 flex items-center gap-2">
            <Radio size={14} className="animate-pulse" />
            <span>SESSION 042 // LIVE BROADCAST</span>
          </div>

          <h1 className="font-display font-extrabold text-7xl text-white tracking-tight leading-[1.05]">
            <AnimatedText
              text="BROADCAST COMMENCING SOON"
              preset="blur-focus"
            />
          </h1>

          <p className="mt-6 text-zinc-300 text-lg leading-relaxed max-w-xl font-medium">
            {state.topic}
          </p>
        </div>

        {/* Right Column: Countdown Timer & Run of Show */}
        <div className="rounded-3xl bg-zinc-950/75 border border-white/10 backdrop-blur-2xl p-10 shadow-2xl flex flex-col gap-8">
          {/* Countdown Clock */}
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
            <div>
              <div className="font-mono text-[11px] font-bold text-zinc-400 tracking-wider">
                ESTIMATED COMMENCEMENT
              </div>
              <div className="font-display font-extrabold text-7xl text-white tracking-tight mt-1">
                {timeFormatted}
              </div>
            </div>
            <Clock size={36} className="text-amber-400 opacity-60" />
          </div>

          {/* Rundown Topics */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              EPISODE RUNDOWN
            </span>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="font-mono text-xs font-bold text-amber-400">01</span>
              <span className="text-xs font-semibold text-zinc-200">
                Setup Breakdown & Architectural Upgrades
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="font-mono text-xs font-bold text-blue-400">02</span>
              <span className="text-xs font-semibold text-zinc-200">
                Live Reaction & High-Octane Gaming Session
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="font-mono text-xs font-bold text-rose-400">03</span>
              <span className="text-xs font-semibold text-zinc-200">
                Community Q&A & Code Giveaway
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Social Marquee */}
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
