"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Sparkles, RefreshCw, Check, Copy, Code } from "lucide-react";

export interface LogoStyleConfig {
  primaryText: string;
  secondaryText: string;
  accentColor: string;
  bgColor: string;
  glowIntensity: number;
  showGrid: boolean;
}

export function LogoGeneratorCanvas() {
  const [config, setConfig] = useState<LogoStyleConfig>({
    primaryText: "UNCOMPILED",
    secondaryText: "OM",
    accentColor: "#a855f7", // Cyber Purple from reference image
    bgColor: "#050508",
    glowIntensity: 1.2,
    showGrid: true,
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderCanvasLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1024;
    const height = 1024;
    canvas.width = width;
    canvas.height = height;

    // 1. Dark Pitch Background
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Mesh Radial Glow
    const radialGlow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      40,
      width / 2,
      height / 2,
      width * 0.65
    );
    radialGlow.addColorStop(0, hexToRgba(config.accentColor, 0.35 * config.glowIntensity));
    radialGlow.addColorStop(0.5, hexToRgba(config.accentColor, 0.09 * config.glowIntensity));
    radialGlow.addColorStop(1, "transparent");
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Technical 64px Grid Lines
    if (config.showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 4. Render Cyber Tech Frame Logo
    ctx.save();
    ctx.translate(width / 2, height / 2);
    drawCyberSteppedFrame(ctx, config);
    ctx.restore();
  };

  useEffect(() => {
    renderCanvasLogo();
  }, [config]);

  const handleDownloadPNG = (size: number) => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(size / 1024, size / 1024);

    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, 1024, 1024);

    const radialGlow = ctx.createRadialGradient(512, 512, 40, 512, 512, 650);
    radialGlow.addColorStop(0, hexToRgba(config.accentColor, 0.35 * config.glowIntensity));
    radialGlow.addColorStop(0.5, hexToRgba(config.accentColor, 0.09 * config.glowIntensity));
    radialGlow.addColorStop(1, "transparent");
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, 1024, 1024);

    if (config.showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 1024; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y <= 1024; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }
    }

    ctx.translate(512, 512);
    drawCyberSteppedFrame(ctx, config);

    ctx.restore();

    const link = document.createElement("a");
    link.download = `uncompiled-cyber-logo-${size}x${size}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopySVGCode = () => {
    const svgContent = `
<svg viewBox="0 0 640 220" width="640" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="220" rx="16" fill="#050508"/>
  <circle cx="440" cy="145" r="70" fill="${config.accentColor}" opacity="0.25"/>
  <g stroke="#FFFFFF" stroke-width="3.5" fill="none">
    <path d="M 135 35 L 245 35 L 255 45 L 395 45 L 405 35 L 505 35 L 525 55 L 525 95 L 520 105 L 520 145 L 510 155 L 500 155 L 490 165 L 470 175 L 330 175 L 320 165 L 190 165 L 180 175 L 130 175 L 110 155 L 110 65 Z"/>
    <path d="M 120 60 L 120 48 L 155 48" stroke="${config.accentColor}" stroke-width="3"/>
    <path d="M 195 165 L 295 165" stroke="${config.accentColor}" stroke-width="4"/>
  </g>
  <g fill="#FFFFFF" font-family="Syne, sans-serif" font-weight="900" font-size="37" letter-spacing="2.5">
    <text x="130" y="102">${config.primaryText}</text>
  </g>
  <g fill="${config.accentColor}" font-family="Syne, sans-serif" font-weight="900" font-size="36" letter-spacing="3">
    <text x="410" y="150">${config.secondaryText}</text>
  </g>
</svg>`.trim();

    navigator.clipboard.writeText(svgContent);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(null as any), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Canvas Preview Area */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4 shadow-2xl">
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            UNCOMPILED.OM Cyber Tech Logo Engine
          </div>
          <span className="font-mono text-[10px] text-zinc-500">1024 × 1024 HIGH-RES RENDER</span>
        </div>

        {/* Canvas Display Frame */}
        <div className="relative aspect-square w-full max-w-[480px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#050508]">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Export Buttons Bar */}
        <div className="w-full pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-400">EXPORT:</span>
            <button
              onClick={() => handleDownloadPNG(512)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white border border-white/10 transition-colors"
            >
              512px
            </button>
            <button
              onClick={() => handleDownloadPNG(1024)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white border border-white/10 transition-colors"
            >
              1024px
            </button>
            <button
              onClick={() => handleDownloadPNG(2048)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5 shadow-lg"
            >
              {downloadSuccess ? (
                <>
                  <Check size={14} />
                  DOWNLOADED PNG!
                </>
              ) : (
                <>
                  <Download size={14} />
                  2048px (4K HD PNG)
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySVGCode}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-purple-300 border border-white/10 transition-colors flex items-center gap-1.5"
            >
              {copiedSvg ? <Check size={14} className="text-emerald-400" /> : <Code size={14} />}
              {copiedSvg ? "COPIED SVG!" : "COPY SVG CODE"}
            </button>

            <button
              onClick={renderCanvasLogo}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Redraw Canvas"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Controls Panel */}
      <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            Logo Customization
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            Cyber Tech Logo Controls
          </h3>
        </div>

        {/* Primary Text */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-400 font-bold">
            TOP TITLE TEXT
          </label>
          <input
            type="text"
            value={config.primaryText}
            onChange={(e) => setConfig({ ...config, primaryText: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-display focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Subtitle Text */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-zinc-400 font-bold">
            BOTTOM BADGE TEXT (OM)
          </label>
          <input
            type="text"
            value={config.secondaryText}
            onChange={(e) => setConfig({ ...config, secondaryText: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Color Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-zinc-400 font-bold">
            ACCENT NEON COLOR THEME
          </label>
          <div className="flex items-center gap-2">
            {[
              { name: "Cyber Purple", hex: "#a855f7" },
              { name: "Industrial Amber", hex: "#f59e0b" },
              { name: "Cyber Cobalt", hex: "#3b82f6" },
              { name: "Kick Neon Green", hex: "#00e701" },
              { name: "YouTube Neon Red", hex: "#ff0000" },
              { name: "Platinum White", hex: "#ffffff" },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => setConfig({ ...config, accentColor: c.hex })}
                className={`w-8 h-8 rounded-xl transition-transform border border-white/20 flex items-center justify-center ${
                  config.accentColor === c.hex ? "scale-110 ring-2 ring-white" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Toggles */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <label className="flex items-center justify-between text-xs font-mono text-zinc-300 cursor-pointer">
            <span>SHOW STRUCTURAL GRID</span>
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
              className="accent-purple-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between text-xs font-mono text-zinc-300 cursor-pointer">
            <span>ACCENT GLOW EFFECT</span>
            <input
              type="checkbox"
              checked={config.glowIntensity > 0}
              onChange={(e) => setConfig({ ...config, glowIntensity: e.target.checked ? 1.2 : 0 })}
              className="accent-purple-500 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Pixel-Perfect Stepped Cyber Frame Canvas Drawer
// --------------------------------------------------------------------------

function drawCyberSteppedFrame(ctx: CanvasRenderingContext2D, config: LogoStyleConfig) {
  const accent = config.accentColor;

  ctx.save();
  ctx.scale(1.1, 1.1);

  // 1. Draw Stepped Tech Border Outer Frame
  const frameW = 680;
  const frameH = 220;
  const leftX = -frameW / 2;
  const topY = -frameH / 2;

  // Background Fill inside Frame
  ctx.fillStyle = "rgba(10, 10, 16, 0.88)";
  ctx.beginPath();
  drawSteppedPath(ctx, leftX, topY, frameW, frameH);
  ctx.fill();

  // Primary White Frame Outer Stroke
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 15 * config.glowIntensity;
  ctx.stroke();

  // 2. Glowing Purple Chamfer Accent Strokes
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 22 * config.glowIntensity;

  // Top Left Notch Accent
  ctx.beginPath();
  ctx.moveTo(leftX + 20, topY + 40);
  ctx.lineTo(leftX + 20, topY + 22);
  ctx.lineTo(leftX + 50, topY + 22);
  ctx.stroke();

  // Bottom Horizontal Glow Line
  ctx.beginPath();
  ctx.moveTo(leftX + 180, topY + frameH - 12);
  ctx.lineTo(leftX + 270, topY + frameH - 12);
  ctx.stroke();

  // Bottom-Right Step Glow Notch
  ctx.beginPath();
  ctx.moveTo(leftX + frameW - 130, topY + frameH - 2);
  ctx.lineTo(leftX + frameW - 40, topY + frameH - 12);
  ctx.stroke();
  ctx.restore();

  // 3. Render Top Title: UNCOMPILED
  ctx.save();
  ctx.font = "900 68px 'Syne', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "4px";
  ctx.fillText(config.primaryText, 0, topY + 68);
  ctx.restore();

  // 4. Render Bottom Left Slanted Hazard Stripes (///)
  ctx.save();
  const stripeY = topY + 140;
  const startX = leftX + 55;
  const stripeW = 12;
  const stripeH = 26;
  const gap = 16;
  const skew = 10;

  const colors = ["#333642", "#6b21a8", accent, "#c084fc"];

  colors.forEach((col, i) => {
    const x = startX + i * gap;
    ctx.fillStyle = col;
    if (i >= 2) {
      ctx.shadowColor = accent;
      ctx.shadowBlur = 12 * config.glowIntensity;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.moveTo(x + skew, stripeY);
    ctx.lineTo(x + stripeW + skew, stripeY);
    ctx.lineTo(x + stripeW, stripeY + stripeH);
    ctx.lineTo(x, stripeY + stripeH);
    ctx.closePath();
    ctx.fill();
  });

  // Connecting Horizontal Bar Line
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX + colors.length * gap + 10, stripeY + stripeH / 2);
  ctx.lineTo(leftX + 410, stripeY + stripeH / 2);
  ctx.stroke();
  ctx.restore();

  // 5. Render Bottom Right ✦ OM ✦
  ctx.save();
  const omCenterX = leftX + 490;
  const omCenterY = stripeY + 12;

  // Left Spark Star ✦
  drawSparkStar(ctx, omCenterX - 65, omCenterY, accent, config.glowIntensity);

  // OM Text with Gradient & Neon Purple Glow
  const textGrad = ctx.createLinearGradient(omCenterX - 30, omCenterY - 20, omCenterX + 30, omCenterY + 20);
  textGrad.addColorStop(0, "#f3e8ff");
  textGrad.addColorStop(0.5, "#c084fc");
  textGrad.addColorStop(1, accent);

  ctx.font = "900 56px 'Syne', sans-serif";
  ctx.fillStyle = textGrad;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24 * config.glowIntensity;
  ctx.fillText(config.secondaryText, omCenterX, omCenterY + 2);

  // Right Spark Star ✦
  drawSparkStar(ctx, omCenterX + 65, omCenterY, accent, config.glowIntensity);
  ctx.restore();

  ctx.restore();
}

function drawSteppedPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x + 35, y);
  ctx.lineTo(x + 200, y);
  ctx.lineTo(x + 215, y + 15);
  ctx.lineTo(x + 380, y + 15);
  ctx.lineTo(x + 395, y);
  ctx.lineTo(x + w - 35, y);
  ctx.lineTo(x + w, y + 35);
  ctx.lineTo(x + w, y + 110);
  ctx.lineTo(x + w - 10, y + 125);
  ctx.lineTo(x + w - 10, y + h - 35);
  ctx.lineTo(x + w - 35, y + h);
  ctx.lineTo(x + 370, y + h);
  ctx.lineTo(x + 350, y + h - 18);
  ctx.lineTo(x + 180, y + h - 18);
  ctx.lineTo(x + 160, y + h);
  ctx.lineTo(x + 35, y + h);
  ctx.lineTo(x, y + h - 35);
  ctx.lineTo(x, y + 35);
  ctx.closePath();
}

function drawSparkStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, glow: number) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15 * glow;

  ctx.beginPath();
  ctx.moveTo(x, y - 16);
  ctx.quadraticCurveTo(x, y, x + 16, y);
  ctx.quadraticCurveTo(x, y, x, y + 16);
  ctx.quadraticCurveTo(x, y, x - 16, y);
  ctx.quadraticCurveTo(x, y, x, y - 16);
  ctx.fill();
  ctx.restore();
}

function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((char) => char + char).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}
