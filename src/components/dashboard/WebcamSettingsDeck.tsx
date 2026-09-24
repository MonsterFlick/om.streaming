"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Camera, Mic, Sliders, Check, Sparkles, AlertCircle } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { WebcamAspectRatio, WebcamConfig, WebcamRounding } from "@/lib/types";

interface WebcamSettingsDeckProps {
  config: WebcamConfig;
  onUpdate: (partial: Partial<WebcamConfig>) => void;
}

export function WebcamSettingsDeck({ config, onUpdate }: WebcamSettingsDeckProps) {
  const [localCamActive, setLocalCamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startLocalCam = async () => {
    try {
      if (localCamActive) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setLocalCamActive(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLocalCamActive(true);
      soundEffects.play("click");
    } catch (e) {
      alert("Could not access camera for browser test. Check browser permissions.");
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const ratios: { id: WebcamAspectRatio; label: string; desc: string }[] = [
    { id: "16:9", label: "16:9", desc: "Widescreen" },
    { id: "4:3", label: "4:3", desc: "Retro / Tight" },
    { id: "1:1", label: "1:1", desc: "Square / Circle" },
    { id: "9:16", label: "9:16", desc: "Vertical" },
  ];

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            WEBCAM ARCHITECTURE & DOCK
          </span>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
          DUAL-MODE ENGINE
        </span>
      </div>

      {/* Mode Switcher: Separated vs Integrated */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          CHOOSE WEBCAM OVERLAY ARCHITECTURE:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Option A: Separated Standalone */}
          <button
            onClick={() => {
              soundEffects.play("click");
              onUpdate({ mode: "separated" });
            }}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              config.mode === "separated"
                ? "bg-amber-500/10 border-amber-500/60 shadow-glowAmber"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-white">
                1. Separated Overlay (Recommended)
              </span>
              {config.mode === "separated" && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </div>
            <p className="font-sans text-[11px] text-zinc-400 mt-1 leading-snug">
              Standalone route at <code className="text-amber-300">/overlays/webcam</code>. Add to an OBS Nested Scene with your camera and move/scale freely on any scene!
            </p>
          </button>

          {/* Option B: Integrated Dock */}
          <button
            onClick={() => {
              soundEffects.play("click");
              onUpdate({ mode: "integrated" });
            }}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              config.mode === "integrated"
                ? "bg-amber-500/10 border-amber-500/60 shadow-glowAmber"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-white">
                2. Integrated Overlay
              </span>
              {config.mode === "integrated" && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </div>
            <p className="font-sans text-[11px] text-zinc-400 mt-1 leading-snug">
              Cutout frame rendered inside the full 1920×1080 scene layout. Best for streamers who prefer only 1 browser source per scene.
            </p>
          </button>
        </div>
      </div>

      {/* Aspect Ratio & Rounding */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            ASPECT RATIO
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {ratios.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  soundEffects.play("click");
                  onUpdate({ aspectRatio: r.id });
                }}
                className={`py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                  config.aspectRatio === r.id
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            CORNER ROUNDING
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["none", "md", "xl", "full"] as WebcamRounding[]).map((round) => (
              <button
                key={round}
                onClick={() => {
                  soundEffects.play("click");
                  onUpdate({ rounding: round });
                }}
                className={`py-1.5 rounded-xl font-mono text-xs font-bold border uppercase transition-all ${
                  config.rounding === round
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {round}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Label Inputs */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="font-mono text-[9px] font-bold text-zinc-400 uppercase">
            STATUS BADGE
          </label>
          <input
            value={config.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="font-mono text-[9px] font-bold text-zinc-400 uppercase">
            WATERMARK
          </label>
          <input
            value={config.sublabel}
            onChange={(e) => onUpdate({ sublabel: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="font-mono text-[9px] font-bold text-zinc-400 uppercase">
            MIC STATUS
          </label>
          <input
            value={config.micLabel}
            onChange={(e) => onUpdate({ micLabel: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Local Camera Test Preview */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={startLocalCam}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              localCamActive
                ? "bg-red-500/20 border-red-500/40 text-red-300"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300"
            }`}
          >
            <Video size={13} />
            <span>{localCamActive ? "STOP CAM TEST" : "TEST CAM IN BROWSER"}</span>
          </button>
          <span className="font-mono text-[10px] text-zinc-500">
            Preview webcam alignment directly in browser
          </span>
        </div>

        {localCamActive && (
          <div className="w-24 h-14 rounded-lg overflow-hidden border border-white/20 bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
