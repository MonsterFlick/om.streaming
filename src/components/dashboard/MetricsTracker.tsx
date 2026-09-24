"use client";

import { Target, Users, TrendingUp, DollarSign } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";
import { StreamGoal, StreamState } from "@/lib/types";

interface MetricsTrackerProps {
  state: StreamState;
  onUpdate: (partial: Partial<StreamState>) => void;
}

export function MetricsTracker({ state, onUpdate }: MetricsTrackerProps) {
  const handleGoalChange = (type: "followerGoal" | "subGoal", field: keyof StreamGoal, value: string | number) => {
    const existing = state[type];
    const updated = { ...existing, [field]: value };
    onUpdate({ [type]: updated });
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            GOALS & EVENT BAR METRICS
          </span>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
          REAL-TIME SYNC
        </span>
      </div>

      {/* Community Follower Goal */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] font-bold text-zinc-400 tracking-wider">
            FOLLOWER GOAL PROGRESS
          </span>
          <span className="font-display font-extrabold text-white">
            {state.followerGoal.current} / {state.followerGoal.target}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={state.followerGoal.target * 1.5 || 2000}
          value={state.followerGoal.current}
          onChange={(e) => handleGoalChange("followerGoal", "current", parseInt(e.target.value) || 0)}
          className="w-full accent-amber-500 cursor-pointer"
        />

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <label className="font-mono text-[9px] text-zinc-500 uppercase">CURRENT</label>
            <input
              type="number"
              value={state.followerGoal.current}
              onChange={(e) => handleGoalChange("followerGoal", "current", parseInt(e.target.value) || 0)}
              className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-[9px] text-zinc-500 uppercase">TARGET</label>
            <input
              type="number"
              value={state.followerGoal.target}
              onChange={(e) => handleGoalChange("followerGoal", "target", parseInt(e.target.value) || 0)}
              className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Top Banner Quick Chips Adjusters */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-[9px] font-bold text-zinc-400 uppercase">
            LATEST SUB OVERLAY CHIP
          </label>
          <input
            value={state.latestSub}
            onChange={(e) => onUpdate({ latestSub: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="font-mono text-[9px] font-bold text-zinc-400 uppercase">
            TOP TIP OVERLAY CHIP
          </label>
          <input
            value={state.topDonation}
            onChange={(e) => onUpdate({ topDonation: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>
    </div>
  );
}
