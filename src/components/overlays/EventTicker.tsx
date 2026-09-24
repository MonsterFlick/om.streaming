"use client";

import { useEffect, useState } from "react";
import { streamBus, INITIAL_STREAM_STATE } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { AnimatedText } from "./AnimatedText";

export function EventTicker() {
  const [state, setState] = useState<StreamState>(INITIAL_STREAM_STATE);

  useEffect(() => {
    setState(streamBus.getState());
    return streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Live Badge */}
      <div className="status-pill bg-black/60 shadow-lg">
        <span className="status-dot live" />
        <span>REC // LIVE 60FPS</span>
      </div>

      {/* Latest Sub */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg text-xs">
        <span className="font-mono text-[9px] font-bold text-zinc-400 tracking-wider">
          LATEST SUB
        </span>
        <span className="font-display font-bold text-white">
          {state.latestSub || "alex_prime"}
        </span>
      </div>

      {/* Top Donation */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg text-xs">
        <span className="font-mono text-[9px] font-bold text-amber-400 tracking-wider">
          TOP TIP
        </span>
        <span className="font-display font-bold text-white">
          {state.topDonation || "elena.eth ($50.00)"}
        </span>
      </div>

      {/* Community Goal */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg text-xs">
        <span className="font-mono text-[9px] font-bold text-zinc-400 tracking-wider">
          GOAL
        </span>
        <span className="font-display font-bold text-amber-300">
          {state.followerGoal.current} / {state.followerGoal.target}
        </span>
      </div>
    </div>
  );
}
