"use client";

import { useEffect, useState } from "react";
import { streamBus } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { AnimatedText } from "@/components/overlays/AnimatedText";
import { ChatWidget } from "@/components/overlays/ChatWidget";
import { SponsorCard } from "@/components/overlays/SponsorCard";
import { WebcamFrame } from "@/components/overlays/WebcamFrame";

export default function ChattingOverlayPage() {
  const [state, setState] = useState<StreamState>(streamBus.getState());

  useEffect(() => {
    return streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });
  }, []);

  const goalPercent = Math.min(
    100,
    Math.round((state.followerGoal.current / state.followerGoal.target) * 100)
  );

  return (
    <div className="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden bg-transparent">

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between h-14">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="font-display font-extrabold text-2xl tracking-tight text-white">
            uncompiled<span className="text-amber-500">.</span>om
          </div>
          <div className="status-pill">
            <span className="status-dot live" />
            <span>STUDIO // LIVE</span>
          </div>
        </div>

        {/* Stream Topic Pill with Animated Text */}
        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl">
          <span className="font-mono text-[10px] font-bold text-amber-400 tracking-wider">
            FOCUS
          </span>
          <div className="font-sans font-semibold text-sm text-zinc-100 truncate">
            <AnimatedText
              text={state.topic}
              preset={state.textAnimation}
              repeatKey={state.topic}
            />
          </div>
        </div>

        {/* Social Marquee Ticker */}
        <div className="w-[420px] overflow-hidden">
          <AnimatedText
            text={state.tickerText}
            preset="marquee"
            className="font-mono text-[11px] text-zinc-400 tracking-wider"
          />
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="relative z-10 grid grid-cols-[1240px_1fr] gap-6 flex-1 my-5 min-h-0">
        {/* Left Column: Primary Media Frame (Video / Reaction Capture) */}
        <section className="relative rounded-3xl bg-transparent border border-white/15 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Top Frame Overlay */}
          <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <div className="status-pill text-[10px] py-1 bg-black/70">
              <span className="status-dot amber" />
              <span>DISPLAY CAPTURE // 1080P60</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-400 tracking-wider">
              [ MEDIA FEED ACTIVE ]
            </span>
          </div>

          {/* Center Transparent Workspace for OBS Window/Display Capture underneath */}
          <div className="flex-1" />

          {/* Bottom Frame Overlay */}
          <div className="p-4 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
            <span className="font-display font-bold text-xs text-white/80 tracking-wider">
              uncompiled.om // reaction session
            </span>
            <span className="font-mono text-[11px] text-amber-400">
              AUDIO SYNC: 24-BIT / 48KHZ
            </span>
          </div>
        </section>

        {/* Right Sidebar: Camera + Chat Feed */}
        <aside className="flex flex-col gap-5 h-full">
          {/* Webcam Box (Integrated frame) */}
          <div className="h-[360px] rounded-3xl overflow-hidden shadow-2xl">
            <WebcamFrame />
          </div>

          {/* Chat Feed Panel */}
          <div className="flex-1 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl min-h-0">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                STUDIO CHAT // REALTIME
              </span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                SLOW MODE OFF
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <ChatWidget maxMessages={15} />
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Studio Footer */}
      <footer className="relative z-10 grid grid-cols-[1240px_1fr] gap-6 h-20">
        {/* Sponsor Dock (Left) */}
        <div className="flex items-center">
          <SponsorCard />
        </div>

        {/* Community Goal Progress (Right) */}
        <div className="rounded-2xl bg-zinc-950/75 border border-white/10 backdrop-blur-xl p-4 flex flex-col justify-center gap-2 shadow-xl">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono font-bold text-zinc-400 tracking-wider text-[11px]">
              {state.followerGoal.label}
            </span>
            <span className="font-display font-extrabold text-white">
              {state.followerGoal.current} / {state.followerGoal.target}
            </span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
