"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Sparkles, ExternalLink } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { DEFAULT_SPONSORS } from "@/config/stream-config";
import { SponsorItem } from "@/lib/types";

export function SponsorCard() {
  const [activeSponsor, setActiveSponsor] = useState<SponsorItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Listen for manual trigger from dashboard
    const unsub = streamBus.on<{ sponsorId?: string }>("TRIGGER_SPONSOR", (payload) => {
      let chosen: SponsorItem;
      if (payload && payload.sponsorId) {
        chosen = DEFAULT_SPONSORS.find((s) => s.id === payload.sponsorId) || DEFAULT_SPONSORS[0];
      } else {
        const nextIdx = (currentIndex + 1) % DEFAULT_SPONSORS.length;
        setCurrentIndex(nextIdx);
        chosen = DEFAULT_SPONSORS[nextIdx];
      }

      setActiveSponsor(chosen);
      setTimeout(() => {
        setActiveSponsor(null);
      }, 16000);
    });

    // Auto rotation every 180s
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % DEFAULT_SPONSORS.length;
        setActiveSponsor(DEFAULT_SPONSORS[next]);
        setTimeout(() => setActiveSponsor(null), 16000);
        return next;
      });
    }, 180000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [currentIndex]);

  return (
    <AnimatePresence>
      {activeSponsor && (
        <motion.div
          key={activeSponsor.id}
          initial={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(6px)" }}
          transition={{ type: "spring", damping: 20, stiffness: 180 }}
          className="relative max-w-xl rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-white/15 p-4 shadow-2xl overflow-hidden"
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 inset-x-0 h-1"
            style={{ backgroundColor: activeSponsor.accentColor || "#f59e0b" }}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 uppercase tracking-widest">
                  {activeSponsor.badge}
                </span>
                <span className="font-display font-black text-sm text-white tracking-wider">
                  {activeSponsor.brand}
                </span>
              </div>

              <div className="font-sans font-semibold text-xs text-zinc-200 mt-1 truncate">
                {activeSponsor.headline}
              </div>

              <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                {activeSponsor.description}
              </div>
            </div>

            {/* Promo Code Dock */}
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-sm">
                <Tag size={12} className="text-amber-400" />
                <span>CODE: {activeSponsor.code}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400 font-medium">
                {activeSponsor.discount}
              </span>
            </div>
          </div>

          {/* Progress bar countdown */}
          <div className="mt-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 15.8, ease: "linear" }}
              className="h-full bg-amber-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
