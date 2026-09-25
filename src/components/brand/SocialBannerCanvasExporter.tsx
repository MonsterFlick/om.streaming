"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Sparkles, Check, Eye, ShieldAlert, Tv } from "lucide-react";

export type PlatformPreset = 
  | "ig-avatar"
  | "ig-story"
  | "yt-banner"
  | "kick-header";

interface PlatformSpec {
  id: PlatformPreset;
  platform: "Instagram" | "YouTube" | "Kick";
  label: string;
  width: number;
  height: number;
  aspect: string;
  safeAreaGuide?: string;
}

const PLATFORM_SPECS: PlatformSpec[] = [
  {
    id: "yt-banner",
    platform: "YouTube",
    label: "YouTube Channel Banner",
    width: 2560,
    height: 1440,
    aspect: "16:9 Banner",
    safeAreaGuide: "Safe Area: 1546×423 px centered",
  },
  {
    id: "kick-header",
    platform: "Kick",
    label: "Kick Channel Header",
    width: 1200,
    height: 480,
    aspect: "5:2 Ratio",
  },
  {
    id: "ig-avatar",
    platform: "Instagram",
    label: "Instagram Profile Avatar",
    width: 1080,
    height: 1080,
    aspect: "1:1 Square",
  },
  {
    id: "ig-story",
    platform: "Instagram",
    label: "Instagram Story Banner",
    width: 1080,
    height: 1920,
    aspect: "9:16 Vertical",
  },
];

export function SocialBannerCanvasExporter() {
  const [selectedSpec, setSelectedSpec] = useState<PlatformSpec>(PLATFORM_SPECS[0]);
  const [showSafeArea, setShowSafeArea] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderBannerCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = selectedSpec;
    canvas.width = width;
    canvas.height = height;

    const accent = "#a855f7"; // Cyber Purple from official logo

    // Base Pitch Background
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, width, height);

    // Ambient Radial Glow
    const radial = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      50,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.7
    );
    radial.addColorStop(0, "rgba(168, 85, 247, 0.25)");
    radial.addColorStop(0.6, "rgba(168, 85, 247, 0.04)");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 64px Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;
    const step = Math.min(width, height) / 16;
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Corner Reticle Brackets
    const padding = Math.min(width, height) * 0.05;
    const bracketLen = Math.min(width, height) * 0.08;
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(3, Math.floor(width / 320));

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(padding, padding + bracketLen);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + bracketLen, padding);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - padding, height - padding - bracketLen);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding - bracketLen, height - padding);
    ctx.stroke();

    // Draw Cyber Tech Logo centered
    ctx.save();
    ctx.translate(width / 2, height / 2);
    const scaleFactor = Math.min(width, height) / 480;
    ctx.scale(scaleFactor, scaleFactor);
    drawCyberSteppedLogo(ctx, accent);
    ctx.restore();

    // YouTube Safe Zone Overlay
    if (showSafeArea && selectedSpec.id === "yt-banner") {
      ctx.strokeStyle = "rgba(168, 85, 247, 0.8)";
      ctx.lineWidth = 3;
      ctx.setLineDash([16, 12]);
      
      const safeW = 1546;
      const safeH = 423;
      const safeX = (width - safeW) / 2;
      const safeY = (height - safeH) / 2;

      ctx.strokeRect(safeX, safeY, safeW, safeH);
      ctx.setLineDash([]);
      ctx.font = "bold 20px 'Space Mono', monospace";
      ctx.fillStyle = accent;
      ctx.textAlign = "right";
      ctx.fillText("DESKTOP & MOBILE CORE SAFE AREA [1546 × 423]", safeX + safeW - 20, safeY + 36);
    }
  };

  useEffect(() => {
    renderBannerCanvas();
  }, [selectedSpec, showSafeArea]);

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `uncompiled-${selectedSpec.platform.toLowerCase()}-${selectedSpec.id}-${selectedSpec.width}x${selectedSpec.height}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              Cyber Tech Social Media Standards
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Platform Banner Presets
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLATFORM_SPECS.map((spec) => {
            const isSelected = selectedSpec.id === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => setSelectedSpec(spec)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-purple-600/10 border-purple-500 shadow-lg text-white"
                    : "bg-black/40 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="font-mono text-[10px] text-purple-400 uppercase font-bold mb-1">
                  {spec.platform}
                </div>
                <div className="font-display font-bold text-sm">
                  {spec.label}
                </div>
                <div className="font-mono text-[10px] text-zinc-500 mt-2">
                  {spec.width} × {spec.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Exporter Workspace */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold">
            <Eye size={14} />
            LIVE CANVAS PREVIEW [{selectedSpec.width} × {selectedSpec.height} px]
          </div>
        </div>

        <div className="w-full max-w-full flex justify-center items-center bg-[#050508] rounded-2xl p-2 border border-white/10 shadow-2xl overflow-hidden min-h-[300px]">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[500px] object-contain rounded-xl"
          />
        </div>

        <div className="w-full pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-zinc-400">
            OFFICIAL UNCOMPILED OM CYBER LOGO BANNER
          </div>

          <button
            onClick={handleExportPNG}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {downloadSuccess ? (
              <>
                <Check size={18} />
                EXPORTED PNG!
              </>
            ) : (
              <>
                <Download size={18} />
                DOWNLOAD {selectedSpec.platform.toUpperCase()} BANNER
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function drawCyberSteppedLogo(ctx: CanvasRenderingContext2D, accent: string) {
  const frameW = 440;
  const frameH = 140;
  const leftX = -frameW / 2;
  const topY = -frameH / 2;

  ctx.fillStyle = "rgba(10, 10, 16, 0.9)";
  ctx.beginPath();
  drawSteppedPath(ctx, leftX, topY, frameW, frameH);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3.5;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;

  ctx.beginPath();
  ctx.moveTo(leftX + 12, topY + 26);
  ctx.lineTo(leftX + 12, topY + 14);
  ctx.lineTo(leftX + 32, topY + 14);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(leftX + 115, topY + frameH - 8);
  ctx.lineTo(leftX + 175, topY + frameH - 8);
  ctx.stroke();
  ctx.restore();

  // UNCOMPILED
  ctx.save();
  ctx.font = "900 42px 'Syne', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("UNCOMPILED", 0, topY + 44);
  ctx.restore();

  // Stripes ///
  ctx.save();
  const stripeY = topY + 90;
  const startX = leftX + 35;
  const stripeW = 8;
  const stripeH = 18;
  const gap = 11;
  const skew = 6;
  const colors = ["#333642", "#6b21a8", accent, "#c084fc"];

  colors.forEach((col, i) => {
    const x = startX + i * gap;
    ctx.fillStyle = col;
    if (i >= 2) {
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
    }
    ctx.beginPath();
    ctx.moveTo(x + skew, stripeY);
    ctx.lineTo(x + stripeW + skew, stripeY);
    ctx.lineTo(x + stripeW, stripeY + stripeH);
    ctx.lineTo(x, stripeY + stripeH);
    ctx.closePath();
    ctx.fill();
  });

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX + colors.length * gap + 6, stripeY + stripeH / 2);
  ctx.lineTo(leftX + 260, stripeY + stripeH / 2);
  ctx.stroke();
  ctx.restore();

  // OM + Stars
  ctx.save();
  const omCenterX = leftX + 315;
  const omCenterY = stripeY + 8;

  drawSparkStar(ctx, omCenterX - 42, omCenterY, accent);

  const textGrad = ctx.createLinearGradient(omCenterX - 20, omCenterY - 12, omCenterX + 20, omCenterY + 12);
  textGrad.addColorStop(0, "#f3e8ff");
  textGrad.addColorStop(0.5, "#c084fc");
  textGrad.addColorStop(1, accent);

  ctx.font = "900 36px 'Syne', sans-serif";
  ctx.fillStyle = textGrad;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.fillText("OM", omCenterX, omCenterY + 1);

  drawSparkStar(ctx, omCenterX + 42, omCenterY, accent);
  ctx.restore();
}

function drawSteppedPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x + 22, y);
  ctx.lineTo(x + 130, y);
  ctx.lineTo(x + 140, y + 10);
  ctx.lineTo(x + 245, y + 10);
  ctx.lineTo(x + 255, y);
  ctx.lineTo(x + w - 22, y);
  ctx.lineTo(x + w, y + 22);
  ctx.lineTo(x + w, y + 70);
  ctx.lineTo(x + w - 6, y + 80);
  ctx.lineTo(x + w - 6, y + h - 22);
  ctx.lineTo(x + w - 22, y + h);
  ctx.lineTo(x + 235, y + h);
  ctx.lineTo(x + 222, y + h - 12);
  ctx.lineTo(x + 115, y + h - 12);
  ctx.lineTo(x + 102, y + h);
  ctx.lineTo(x + 22, y + h);
  ctx.lineTo(x, y + h - 22);
  ctx.lineTo(x, y + 22);
  ctx.closePath();
}

function drawSparkStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.quadraticCurveTo(x, y, x + 10, y);
  ctx.quadraticCurveTo(x, y, x, y + 10);
  ctx.quadraticCurveTo(x, y, x - 10, y);
  ctx.quadraticCurveTo(x, y, x, y - 10);
  ctx.fill();
  ctx.restore();
}
