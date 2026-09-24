"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, ExternalLink, Check, Tv } from "lucide-react";
import { StreamScene } from "@/lib/types";

interface ScreenPreviewDockProps {
  currentScene: StreamScene;
  onSceneChange: (scene: StreamScene) => void;
}

export function ScreenPreviewDock({ currentScene, onSceneChange }: ScreenPreviewDockProps) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<string>("active");
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (!boxRef.current) return;
      const width = boxRef.current.clientWidth;
      if (width > 0) {
        setScale(width / 1920);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (boxRef.current) observer.observe(boxRef.current);

    return () => observer.disconnect();
  }, []);

  const previewRoutes: { id: string; label: string; path: string; scene?: StreamScene }[] = [
    { id: "active", label: "ACTIVE SCENE", path: `/overlays/${currentScene}` },
    { id: "game", label: "03 IN-GAME", path: "/overlays/game", scene: "game" },
    { id: "chatting", label: "02 TALK / REACT", path: "/overlays/chatting", scene: "chatting" },
    { id: "starting", label: "01 STARTING", path: "/overlays/starting", scene: "starting" },
    { id: "brb", label: "04 BRB", path: "/overlays/brb", scene: "brb" },
    { id: "ending", label: "05 ENDING", path: "/overlays/ending", scene: "ending" },
    { id: "webcam", label: "★ WEBCAM DOCK", path: "/overlays/webcam" },
  ];

  const currentTabObj = previewRoutes.find((r) => r.id === activePreviewTab) || previewRoutes[0];
  const activeUrl = currentTabObj.id === "active" ? `/overlays/${currentScene}` : currentTabObj.path;

  const copyObsUrl = (path: string) => {
    if (typeof window === "undefined") return;
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Tv size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            LIVE SCREEN PREVIEW DOCK
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            1080P MIRROR
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyObsUrl(activeUrl)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold transition-colors"
          >
            {copiedPath === activeUrl ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedPath === activeUrl ? "COPIED OBS URL!" : "COPY OBS URL"}</span>
          </button>

          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
            title="Open in new window"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {previewRoutes.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActivePreviewTab(tab.id);
              if (tab.scene) onSceneChange(tab.scene);
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all whitespace-nowrap ${
              activePreviewTab === tab.id
                ? "bg-amber-500 text-black shadow-glowAmber"
                : "bg-white/5 hover:bg-white/10 text-zinc-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scaled 16:9 Viewport Box */}
      <div
        ref={boxRef}
        className="relative w-full aspect-video rounded-2xl bg-black border border-white/15 overflow-hidden shadow-inner flex items-center justify-center"
      >
        {/* Render iframe scaled to fit 16:9 box exactly */}
        <div
          className="w-[1920px] h-[1080px] origin-top-left absolute top-0 left-0 pointer-events-none"
          style={{ transform: `scale(${scale})` }}
        >
          <iframe
            src={activeUrl}
            className="w-full h-full border-none pointer-events-none"
            title="Screen Live Preview"
          />
        </div>

        {/* Bottom preview overlay bar */}
        <div className="absolute bottom-2 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 font-mono text-[10px] text-zinc-300 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PREVIEWING: {activeUrl}</span>
          </div>

          <span className="font-mono text-[9px] text-zinc-500 bg-black/60 px-2 py-0.5 rounded-md">
            1920 × 1080 CEF
          </span>
        </div>
      </div>
    </div>
  );
}
