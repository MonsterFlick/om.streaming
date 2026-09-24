"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ShieldAlert, Video } from "lucide-react";
import { streamBus, INITIAL_STREAM_STATE } from "@/lib/stream-bus";
import { StreamState, WebcamConfig } from "@/lib/types";

interface WebcamFrameProps {
  standalone?: boolean;
  className?: string;
  customConfig?: Partial<WebcamConfig>;
}

export function WebcamFrame({
  standalone = false,
  className = "",
  customConfig,
}: WebcamFrameProps) {
  const [state, setState] = useState<StreamState>(INITIAL_STREAM_STATE);
  const [hasAlertGlow, setHasAlertGlow] = useState(false);

  useEffect(() => {
    setState(streamBus.getState());
    const unsubState = streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });

    const unsubAlert = streamBus.on("TRIGGER_ALERT", () => {
      setHasAlertGlow(true);
      setTimeout(() => setHasAlertGlow(false), 4000);
    });

    return () => {
      unsubState();
      unsubAlert();
    };
  }, []);

  const config: WebcamConfig = {
    ...state.webcamConfig,
    ...customConfig,
  };

  // Dimensions & Aspect ratio classes
  const aspectStyles = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  }[config.aspectRatio];

  const roundingStyles = {
    none: "rounded-none",
    md: "rounded-xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  }[config.rounding];

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${aspectStyles} ${roundingStyles} ${
        hasAlertGlow ? "ring-2 ring-amber-400 shadow-glowAmber" : "ring-1 ring-white/15"
      } ${standalone ? "w-full h-full min-w-[320px] min-h-[180px]" : ""} ${className}`}
    >
      {/* Top subtle highlight edge */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none" />

      {/* Transparent Center for OBS Video Capture Device underneath */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      {/* Top Left Tag: OM.CAM */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] font-bold tracking-wider shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Top Right Tag: Aspect Ratio / Res Indicator */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <div className="px-2 py-0.5 rounded-md bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 font-mono text-[9px] uppercase tracking-widest">
          {config.aspectRatio} // RAW
        </div>
      </div>

      {/* Privacy Shield Frosted Overlay */}
      <AnimatePresence>
        {state.privacyShield && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center text-center p-4 border border-red-500/30"
          >
            <ShieldAlert size={32} className="text-red-400 mb-2 animate-bounce" />
            <div className="font-display font-bold text-sm tracking-wider text-red-200">
              PRIVACY SHIELD ACTIVE
            </div>
            <div className="font-mono text-[10px] text-zinc-400 mt-1">
              CAMERA BLURRED // MIC MUTED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar: Watermark & Mic status */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="font-display font-extrabold text-xs tracking-wider text-white/80 drop-shadow-md">
          {config.sublabel}
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border font-mono text-[10px] font-bold shadow-md transition-colors ${
            state.isMicMuted
              ? "bg-red-500/20 border-red-500/40 text-red-400"
              : "bg-black/60 border-white/10 text-zinc-300"
          }`}
        >
          {state.isMicMuted ? (
            <>
              <MicOff size={11} className="text-red-400 animate-pulse" />
              <span>MUTED</span>
            </>
          ) : (
            <>
              <Mic size={11} className="text-amber-400" />
              <span>{config.micLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
