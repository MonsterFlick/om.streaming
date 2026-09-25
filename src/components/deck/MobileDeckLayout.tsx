"use client";

import { useEffect, useState } from "react";
import {
  Tv,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  Sparkles,
  Tag,
  Trash2,
  Bell,
  Play,
  Maximize2,
  Radio,
  Music,
  Zap,
} from "lucide-react";
import { streamBus, INITIAL_STREAM_STATE } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { StreamScene, StreamState } from "@/lib/types";
import { UncompiledOmCyberLogo } from "@/components/brand/UncompiledOmCyberLogo";

export function MobileDeckLayout() {
  const [state, setState] = useState<StreamState>(INITIAL_STREAM_STATE);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    setState(streamBus.getState());
    const unsub = streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });

    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch (e) {}
    }
  };

  const handleSceneSwitch = (scene: StreamScene) => {
    triggerHaptic();
    soundEffects.play("click");
    soundEffects.play("whoosh");
    streamBus.updateState({ currentScene: scene });
  };

  const toggleMicMute = () => {
    triggerHaptic();
    soundEffects.play("mute");
    streamBus.updateState({ isMicMuted: !state.isMicMuted });
  };

  const toggleAudioMute = () => {
    triggerHaptic();
    soundEffects.play("mute");
    streamBus.updateState({ isAudioMuted: !state.isAudioMuted });
  };

  const togglePanicShield = () => {
    triggerHaptic();
    soundEffects.play("scratch");
    const newShield = !state.privacyShield;
    streamBus.updateState({
      privacyShield: newShield,
      isMicMuted: newShield ? true : state.isMicMuted,
      currentScene: newShield ? "brb" : state.currentScene,
    });
  };

  const toggleCamPrivacy = () => {
    triggerHaptic();
    soundEffects.play("click");
    streamBus.updateState({
      privacyShield: !state.privacyShield,
    });
  };

  const triggerNextSponsor = () => {
    triggerHaptic();
    soundEffects.play("chime");
    streamBus.emit("TRIGGER_SPONSOR");
  };

  const triggerTestAlert = () => {
    triggerHaptic();
    streamBus.emit("TRIGGER_ALERT", {
      type: "SUB",
      user: "streamdeck_vip",
      amount: "TIER 3",
      message: "Fired from mobile Stream Deck!",
    });
  };

  const clearChat = () => {
    triggerHaptic();
    soundEffects.play("click");
    streamBus.emit("CLEAR_CHAT");
  };

  const playSfx = (type: "bell" | "applause" | "scratch") => {
    triggerHaptic();
    soundEffects.play(type);
  };

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scenes: { id: StreamScene; label: string; num: string }[] = [
    { id: "starting", label: "STARTING", num: "01" },
    { id: "chatting", label: "TALK / REACT", num: "02" },
    { id: "game", label: "IN-GAME", num: "03" },
    { id: "brb", label: "BE RIGHT BACK", num: "04" },
    { id: "ending", label: "ENDING", num: "05" },
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-white p-4 flex flex-col justify-between select-none touch-none">
      {/* Top Deck Status Bar */}
      <header className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <UncompiledOmCyberLogo width={160} height={50} showBackground={false} accentColor="#a855f7" />
        </div>

        <div className="flex items-center gap-2">
          <div className="status-pill text-[10px] py-1">
            <span className="status-dot live" />
            <span className="font-mono">{formatUptime(uptimeSeconds)}</span>
          </div>

          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 active:text-white"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </header>

      {/* Main Grid Matrix */}
      <main className="flex-1 flex flex-col gap-4 justify-around">
        {/* Row 1: Scene Switching */}
        <div>
          <div className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Tv size={12} className="text-amber-400" />
            <span>SCENE TRANSITION MATRIX</span>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {scenes.map((s) => {
              const isActive = state.currentScene === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSceneSwitch(s.id)}
                  className={`deck-btn h-24 flex flex-col items-center justify-center p-2 text-center transition-all ${
                    isActive ? "active" : ""
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold tracking-widest ${
                      isActive ? "text-amber-300" : "text-zinc-500"
                    }`}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`font-display font-bold text-xs mt-1 leading-tight ${
                      isActive ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {s.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shadow-glowAmber" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Audio & Privacy Toggles */}
        <div>
          <div className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Radio size={12} className="text-blue-400" />
            <span>AUDIO & PRIVACY CONTROLS</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {/* Mic Mute */}
            <button
              onClick={toggleMicMute}
              className={`deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2 ${
                state.isMicMuted ? "border-red-500/80 bg-red-950/40 text-red-300" : ""
              }`}
            >
              {state.isMicMuted ? (
                <MicOff size={22} className="text-red-400 animate-pulse" />
              ) : (
                <Mic size={22} className="text-amber-400" />
              )}
              <span className="font-mono text-[10px] font-bold">
                {state.isMicMuted ? "MIC MUTED" : "MIC LIVE"}
              </span>
            </button>

            {/* BGM Mute */}
            <button
              onClick={toggleAudioMute}
              className={`deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2 ${
                state.isAudioMuted ? "border-red-500/80 bg-red-950/40 text-red-300" : ""
              }`}
            >
              {state.isAudioMuted ? (
                <VolumeX size={22} className="text-red-400" />
              ) : (
                <Volume2 size={22} className="text-blue-400" />
              )}
              <span className="font-mono text-[10px] font-bold">
                {state.isAudioMuted ? "BGM OFF" : "BGM ON"}
              </span>
            </button>

            {/* Cam Privacy */}
            <button
              onClick={toggleCamPrivacy}
              className={`deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2 ${
                state.privacyShield ? "border-amber-500/80 bg-amber-950/40 text-amber-300" : ""
              }`}
            >
              <ShieldAlert size={22} className={state.privacyShield ? "text-amber-400" : "text-zinc-400"} />
              <span className="font-mono text-[10px] font-bold">
                {state.privacyShield ? "CAM BLURRED" : "CAM CLEAR"}
              </span>
            </button>

            {/* Panic Shield */}
            <button
              onClick={togglePanicShield}
              className="deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2 border-red-500/50 hover:border-red-500 active:bg-red-950"
            >
              <ShieldAlert size={22} className="text-red-400 animate-bounce" />
              <span className="font-mono text-[10px] font-bold text-red-300">
                PANIC (BRB)
              </span>
            </button>
          </div>
        </div>

        {/* Row 3: Studio Broadcast Triggers */}
        <div>
          <div className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Zap size={12} className="text-amber-400" />
            <span>BROADCAST TRIGGERS</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {/* Next Sponsor */}
            <button
              onClick={triggerNextSponsor}
              className="deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2"
            >
              <Tag size={20} className="text-amber-400" />
              <span className="font-mono text-[10px] font-bold text-zinc-200">
                NEXT SPONSOR
              </span>
            </button>

            {/* Test Alert */}
            <button
              onClick={triggerTestAlert}
              className="deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2"
            >
              <Bell size={20} className="text-emerald-400" />
              <span className="font-mono text-[10px] font-bold text-zinc-200">
                TRIGGER ALERT
              </span>
            </button>

            {/* Clear Chat */}
            <button
              onClick={clearChat}
              className="deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2"
            >
              <Trash2 size={20} className="text-rose-400" />
              <span className="font-mono text-[10px] font-bold text-zinc-200">
                CLEAR CHAT
              </span>
            </button>

            {/* Confetti Blast */}
            <button
              onClick={() => {
                triggerHaptic();
                soundEffects.play("sub");
                import("canvas-confetti").then((m) => {
                  m.default({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
                });
              }}
              className="deck-btn h-20 flex flex-col items-center justify-center gap-1.5 p-2"
            >
              <Sparkles size={20} className="text-blue-400" />
              <span className="font-mono text-[10px] font-bold text-zinc-200">
                CONFETTI
              </span>
            </button>
          </div>
        </div>

        {/* Row 4: Soundboard Dock */}
        <div>
          <div className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Music size={12} className="text-purple-400" />
            <span>SOUNDBOARD EFFECTS</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => playSfx("bell")}
              className="deck-btn h-16 flex items-center justify-center gap-2 p-2"
            >
              <Bell size={16} className="text-amber-400" />
              <span className="font-mono text-xs font-bold text-zinc-200">STUDIO BELL</span>
            </button>

            <button
              onClick={() => playSfx("applause")}
              className="deck-btn h-16 flex items-center justify-center gap-2 p-2"
            >
              <Sparkles size={16} className="text-blue-400" />
              <span className="font-mono text-xs font-bold text-zinc-200">APPLAUSE</span>
            </button>

            <button
              onClick={() => playSfx("scratch")}
              className="deck-btn h-16 flex items-center justify-center gap-2 p-2"
            >
              <Radio size={16} className="text-rose-400" />
              <span className="font-mono text-xs font-bold text-zinc-200">DJ SCRATCH</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-zinc-500">
        <span>ACTIVE SCENE: {state.currentScene.toUpperCase()}</span>
        <span>HAPTIC VIBRATION: ON</span>
      </footer>
    </div>
  );
}
