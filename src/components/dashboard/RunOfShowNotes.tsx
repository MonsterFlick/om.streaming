"use client";

import { useState } from "react";
import { ListChecks, ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";

interface RunOfShowNotesProps {
  onPushTopic: (topic: string) => void;
}

export function RunOfShowNotes({ onPushTopic }: RunOfShowNotesProps) {
  const [items, setItems] = useState<string[]>([
    "STREAM OVERVIEW: Architectural Migration to Next.js 15 & Framer Motion",
    "DEEP DIVE: Separated vs Integrated Webcam Overlays for OBS Studio",
    "FEATURE TEST: Virtual Stream Deck with Mobile Touch & Haptics",
    "COMMUNITY CODE REVIEW & Q&A SESSION",
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, newItem.trim()]);
    setNewItem("");
    soundEffects.play("click");
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    soundEffects.play("click");
  };

  const pushItem = (text: string) => {
    soundEffects.play("click");
    onPushTopic(text);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            RUN-OF-SHOW // TELEPROMPTER
          </span>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
          1-CLICK PUSH TO OVERLAY
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 group hover:border-white/15 transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0">
                0{idx + 1}
              </span>
              <span className="font-sans text-xs text-zinc-200 truncate">{item}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => pushItem(item)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1 transition-colors"
                title="Push this topic to live overlay"
              >
                <span>PUSH</span>
                <ArrowUpRight size={11} />
              </button>
              <button
                onClick={() => removeItem(idx)}
                className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add next talking point / segment..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
        />
        <button
          onClick={addItem}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1"
        >
          <Plus size={13} />
          <span>ADD</span>
        </button>
      </div>
    </div>
  );
}
