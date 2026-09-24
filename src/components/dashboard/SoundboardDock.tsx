"use client";

import { Music, Bell, Sparkles, Radio, Wind, CheckCircle } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";
import { SoundEffectType } from "@/lib/types";

export function SoundboardDock() {
  const play = (type: SoundEffectType) => {
    soundEffects.play(type);
  };

  const sfxList: { id: SoundEffectType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "bell", label: "STUDIO BELL", icon: <Bell size={16} />, color: "text-amber-400" },
    { id: "applause", label: "APPLAUSE", icon: <Sparkles size={16} />, color: "text-blue-400" },
    { id: "scratch", label: "DJ SCRATCH", icon: <Radio size={16} />, color: "text-rose-400" },
    { id: "whoosh", label: "WHOOSH", icon: <Wind size={16} />, color: "text-emerald-400" },
    { id: "chime", label: "CHIME", icon: <CheckCircle size={16} />, color: "text-purple-400" },
  ];

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Music size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            AUDIO SOUNDBOARD (WEB SYNTHESIZER)
          </span>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
          ZERO MISSING FILES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {sfxList.map((item) => (
          <button
            key={item.id}
            onClick={() => play(item.id)}
            className="deck-btn p-3 flex flex-col items-center justify-center gap-1.5 active:scale-95"
          >
            <span className={item.color}>{item.icon}</span>
            <span className="font-mono text-[10px] font-bold text-zinc-200">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
