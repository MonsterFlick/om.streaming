"use client";

import { Tag, RotateCw, ExternalLink } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { DEFAULT_SPONSORS } from "@/config/stream-config";

export function SponsorManager() {
  const triggerSpecific = (id: string) => {
    soundEffects.play("click");
    soundEffects.play("chime");
    streamBus.emit("TRIGGER_SPONSOR", { sponsorId: id });
  };

  const triggerNext = () => {
    soundEffects.play("click");
    soundEffects.play("chime");
    streamBus.emit("TRIGGER_SPONSOR");
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            SPONSOR BROADCAST HUB
          </span>
        </div>

        <button
          onClick={triggerNext}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold transition-colors"
        >
          <RotateCw size={12} />
          <span>ROTATE NEXT</span>
        </button>
      </div>

      <p className="font-sans text-xs text-zinc-400">
        Click any partner brand below to immediately broadcast its lower-third card and promo code on-screen.
      </p>

      {/* 2x2 Sponsor Grid */}
      <div className="grid grid-cols-2 gap-3">
        {DEFAULT_SPONSORS.map((s) => (
          <button
            key={s.id}
            onClick={() => triggerSpecific(s.id)}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 text-left transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-xs text-white group-hover:text-amber-400 transition-colors">
                  {s.brand}
                </span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                  {s.code}
                </span>
              </div>
              <div className="font-sans text-[11px] text-zinc-400 mt-1 line-clamp-1">
                {s.discount}
              </div>
            </div>

            <div className="font-mono text-[9px] text-zinc-500 group-hover:text-amber-400 mt-2 flex items-center justify-between">
              <span>BROADCAST →</span>
              <span className="opacity-0 group-hover:opacity-100">LIVE</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
