"use client";

import { useState } from "react";
import { Type, Sparkles, Send, RefreshCw } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";
import { TextAnimationPreset } from "@/lib/types";
import { AnimatedText } from "@/components/overlays/AnimatedText";

interface TextAnimationStudioProps {
  currentTopic: string;
  currentTicker: string;
  currentPreset: TextAnimationPreset;
  onUpdateTopic: (topic: string) => void;
  onUpdateTicker: (ticker: string) => void;
  onUpdatePreset: (preset: TextAnimationPreset) => void;
}

export function TextAnimationStudio({
  currentTopic,
  currentTicker,
  currentPreset,
  onUpdateTopic,
  onUpdateTicker,
  onUpdatePreset,
}: TextAnimationStudioProps) {
  const [topicInput, setTopicInput] = useState(currentTopic);
  const [tickerInput, setTickerInput] = useState(currentTicker);
  const [previewKey, setPreviewKey] = useState(0);

  const presets: { id: TextAnimationPreset; label: string; desc: string }[] = [
    { id: "blur-focus", label: "BLUR-TO-FOCUS", desc: "Optical focus reveal (Clean & modern)" },
    { id: "kinetic", label: "KINETIC STAGGER", desc: "Word spring physics" },
    { id: "typewriter", label: "TYPEWRITER", desc: "Clean terminal character reveal" },
    { id: "marquee", label: "STUDIO MARQUEE", desc: "Continuous smooth ticker" },
    { id: "shimmer", label: "SHIMMER WAVE", desc: "Subtle metallic light sweep" },
  ];

  const handlePushTopic = () => {
    soundEffects.play("click");
    onUpdateTopic(topicInput);
    setPreviewKey((prev) => prev + 1);
  };

  const handlePushTicker = () => {
    soundEffects.play("click");
    onUpdateTicker(tickerInput);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Type size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            TEXT & MOTION ANIMATION STUDIO
          </span>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
          FRAMER MOTION ENGINE
        </span>
      </div>

      {/* Animation Style Selector */}
      <div>
        <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
          CHOOSE ANIMATION STYLE:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {presets.map((p) => {
            const isSelected = currentPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundEffects.play("click");
                  onUpdatePreset(p.id);
                  setPreviewKey((prev) => prev + 1);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/60 shadow-sm"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? "text-amber-400" : "text-zinc-200"
                    }`}
                  >
                    {p.label}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Text Preview Box */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-2 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-zinc-400 tracking-wider">
            LIVE ANIMATION PREVIEW
          </span>
          <button
            onClick={() => setPreviewKey((prev) => prev + 1)}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Re-play animation"
          >
            <RefreshCw size={12} />
          </button>
        </div>

        <div className="font-display font-bold text-base text-white min-h-[32px] flex items-center">
          <AnimatedText
            text={topicInput || "ENTER A STREAM TOPIC..."}
            preset={currentPreset}
            repeatKey={previewKey}
          />
        </div>
      </div>

      {/* Topic Input & Push Button */}
      <div>
        <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
          ACTIVE STREAM TOPIC / FOCUS
        </label>
        <div className="flex gap-2">
          <input
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. TALK, TECH & COMMUNITY REACTIONS // UNCUT"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handlePushTopic}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all shadow-glowAmber flex items-center gap-1.5 shrink-0"
          >
            <Send size={12} />
            <span>PUSH TOPIC</span>
          </button>
        </div>
      </div>

      {/* Marquee Ticker Input */}
      <div>
        <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
          BOTTOM / HEADER MARQUEE TICKER
        </label>
        <div className="flex gap-2">
          <input
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Social handles, links, and announcements..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handlePushTicker}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all shrink-0"
          >
            UPDATE TICKER
          </button>
        </div>
      </div>
    </div>
  );
}
