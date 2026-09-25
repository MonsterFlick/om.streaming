"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Tv,
  Smartphone,
  Radio,
  Layers,
  Sparkles,
  ExternalLink,
  Mic,
  MicOff,
  ShieldAlert,
  Volume2,
  VolumeX,
  Palette,
} from "lucide-react";
import { streamBus, INITIAL_STREAM_STATE } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { setupStreamHotkeys } from "@/lib/hotkeys";
import { StreamScene, StreamState, WebcamConfig, TextAnimationPreset } from "@/lib/types";
import { UncompiledOmCyberLogo } from "@/components/brand/UncompiledOmCyberLogo";

// Dashboard Subcomponents
import { ScreenPreviewDock } from "@/components/dashboard/ScreenPreviewDock";
import { WebcamSettingsDeck } from "@/components/dashboard/WebcamSettingsDeck";
import { TextAnimationStudio } from "@/components/dashboard/TextAnimationStudio";
import { AlertSimulator } from "@/components/dashboard/AlertSimulator";
import { SponsorManager } from "@/components/dashboard/SponsorManager";
import { ChatController } from "@/components/dashboard/ChatController";
import { MetricsTracker } from "@/components/dashboard/MetricsTracker";
import { SoundboardDock } from "@/components/dashboard/SoundboardDock";
import { RunOfShowNotes } from "@/components/dashboard/RunOfShowNotes";

export default function DashboardPage() {
  const [state, setState] = useState<StreamState>(INITIAL_STREAM_STATE);
  const [activeTab, setActiveTab] = useState<"all" | "previews" | "webcam" | "text" | "alerts" | "sponsors">("all");

  useEffect(() => {
    setState(streamBus.getState());
    // 1. Subscribe to universal state updates
    const unsubBus = streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });

    // 2. Setup streamer keyboard hotkeys (Num 1-5, M, P, S)
    const cleanupHotkeys = setupStreamHotkeys();

    return () => {
      unsubBus();
      cleanupHotkeys();
    };
  }, []);

  const handleSceneChange = (scene: StreamScene) => {
    soundEffects.play("click");
    soundEffects.play("whoosh");
    streamBus.updateState({ currentScene: scene });
  };

  const handleWebcamUpdate = (partial: Partial<WebcamConfig>) => {
    streamBus.updateState({
      webcamConfig: { ...state.webcamConfig, ...partial },
    });
  };

  const handleTopicUpdate = (topic: string) => {
    streamBus.updateState({ topic });
  };

  const handleTickerUpdate = (tickerText: string) => {
    streamBus.updateState({ tickerText });
  };

  const handlePresetUpdate = (textAnimation: TextAnimationPreset) => {
    streamBus.updateState({ textAnimation });
  };

  const handleMetricsUpdate = (partial: Partial<StreamState>) => {
    streamBus.updateState(partial);
  };

  const scenes: { id: StreamScene; label: string; num: string }[] = [
    { id: "starting", label: "STARTING", num: "1" },
    { id: "chatting", label: "TALK / REACT", num: "2" },
    { id: "game", label: "IN-GAME", num: "3" },
    { id: "brb", label: "BE RIGHT BACK", num: "4" },
    { id: "ending", label: "ENDING", num: "5" },
  ];

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#f4f5f8] flex flex-col p-4 md:p-8">
      <div className="studio-canvas-bg" />
      <div className="studio-grid" />

      {/* Top Mission Control Bar */}
      <header className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <UncompiledOmCyberLogo width={200} height={60} showBackground={false} accentColor="#a855f7" />
          </Link>

          <Link
            href="/brand"
            className="hidden sm:flex items-center gap-1.5 ml-3 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all"
          >
            <Palette size={14} />
            <span>BRAND KIT</span>
          </Link>
        </div>

        {/* Quick Scene & Hardware Status Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Scene Pill Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10">
            {scenes.map((s) => {
              const isActive = state.currentScene === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSceneChange(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-amber-500 text-black shadow-glowAmber"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="opacity-50">[{s.num}]</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mic Quick Toggle */}
          <button
            onClick={() => {
              soundEffects.play("mute");
              streamBus.updateState({ isMicMuted: !state.isMicMuted });
            }}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold ${
              state.isMicMuted
                ? "bg-red-500/20 border-red-500/40 text-red-300"
                : "bg-black/60 border-white/10 text-zinc-300"
            }`}
            title="Press 'M' to toggle"
          >
            {state.isMicMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-amber-400" />}
            <span className="hidden sm:inline">{state.isMicMuted ? "MUTED" : "MIC"}</span>
          </button>

          {/* Virtual Stream Deck Quick Link */}
          <Link
            href="/deck"
            target="_blank"
            className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Smartphone size={13} />
            <span>OPEN STREAM DECK</span>
          </Link>
        </div>
      </header>

      {/* Main Grid Sections */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* ROW 1: Left 7 cols = Screen Preview Dock; Right 5 cols = Webcam Studio */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <ScreenPreviewDock
            currentScene={state.currentScene}
            onSceneChange={handleSceneChange}
          />

          <SoundboardDock />
        </section>

        <section className="lg:col-span-5 flex flex-col gap-6">
          <WebcamSettingsDeck
            config={state.webcamConfig}
            onUpdate={handleWebcamUpdate}
          />

          <RunOfShowNotes onPushTopic={handleTopicUpdate} />
        </section>

        {/* ROW 2: Text Animation Studio (6 cols) & Sponsor Hub (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <TextAnimationStudio
            currentTopic={state.topic}
            currentTicker={state.tickerText}
            currentPreset={state.textAnimation}
            onUpdateTopic={handleTopicUpdate}
            onUpdateTicker={handleTickerUpdate}
            onUpdatePreset={handlePresetUpdate}
          />
        </section>

        <section className="lg:col-span-6 flex flex-col gap-6">
          <SponsorManager />
        </section>

        {/* ROW 3: Alert Simulator (6 cols) & Chat Controller (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <AlertSimulator />
        </section>

        <section className="lg:col-span-6 flex flex-col gap-6">
          <ChatController />
        </section>

        {/* ROW 4: Goals & Metrics Synchronizer (12 cols) */}
        <section className="lg:col-span-12">
          <MetricsTracker state={state} onUpdate={handleMetricsUpdate} />
        </section>
      </main>

      {/* Footer Hotkey Guide */}
      <footer className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] text-zinc-500">
        <div className="flex items-center gap-3">
          <span>HOTKEYS:</span>
          <span>[1-5] SCENES</span>
          <span>•</span>
          <span>[M] MIC MUTE</span>
          <span>•</span>
          <span>[P] PANIC SHIELD</span>
          <span>•</span>
          <span>[S] NEXT SPONSOR</span>
        </div>
        <div>UNCOMPILED.OM PRODUCTION STUDIO // ALL SYSTEMS NOMINAL</div>
      </footer>
    </div>
  );
}
