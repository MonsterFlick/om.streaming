"use client";

import { useRef, useEffect, useState } from "react";
import { Download, Check, Sparkles, Tv } from "lucide-react";

export function ObsMasterBanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const drawBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 2560;
    const height = 1440;
    canvas.width = width;
    canvas.height = height;

    const accent = "#a855f7"; // Cyber Purple from reference logo

    // 1. OBS Deep Dark Background (#050508)
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Cyber Purple Glow
    const purpleGlow = ctx.createRadialGradient(width * 0.5, height * 0.5, 60, width * 0.5, height * 0.5, 950);
    purpleGlow.addColorStop(0, "rgba(168, 85, 247, 0.28)");
    purpleGlow.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
    purpleGlow.addColorStop(1, "transparent");
    ctx.fillStyle = purpleGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Technical 64px Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;
    const step = 64;
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

    // 4. Corner HUD Reticle Brackets
    const padding = 80;
    const reticleLen = 120;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 5;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(padding, padding + reticleLen);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + reticleLen, padding);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - padding, height - padding - reticleLen);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding - reticleLen, height - padding);
    ctx.stroke();

    // 5. Center Render: Official Cyber Tech Stepped Logo
    ctx.save();
    ctx.translate(width / 2, height / 2 - 40);
    ctx.scale(1.8, 1.8);
    drawCyberSteppedLogo(ctx, accent);
    ctx.restore();

    // 6. Bottom Telemetry Status Line
    ctx.save();
    const bottomY = height - 160;
    ctx.font = "bold 24px 'Space Mono', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("● LIVE BROADCAST  •  1080P60 HDR  •  CEF ACCELERATED  •  UNCOMPILED.OM", width / 2, bottomY);
    ctx.restore();
  };

  useEffect(() => {
    drawBanner();
  }, []);

  const handleDownload = (width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, width, height);

    const link = document.createElement("a");
    link.download = `uncompiled-cyber-banner-${width}x${height}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Canvas Viewport */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
            <Tv size={14} />
            Master Cyber Stream Banner (2560 × 1440)
          </div>
          <span className="font-mono text-[10px] text-zinc-500 font-bold">UNCOMPILED OM THEME</span>
        </div>

        {/* Canvas Display */}
        <div className="w-full max-w-full flex justify-center items-center bg-[#050508] rounded-2xl p-2 border border-white/10 shadow-2xl overflow-hidden min-h-[300px]">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[520px] object-contain rounded-xl"
          />
        </div>

        {/* Action Export Bar */}
        <div className="w-full pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-zinc-400">
            OFFICIAL CYBER LOGO BANNER FOR YOUTUBE, KICK, INSTAGRAM & STREAMS
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleDownload(1920, 1080)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs border border-white/10 transition-colors"
            >
              1080p (1920×1080)
            </button>
            <button
              onClick={() => handleDownload(2560, 1440)}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {downloadSuccess ? (
                <>
                  <Check size={16} />
                  DOWNLOADED PNG!
                </>
              ) : (
                <>
                  <Download size={16} />
                  DOWNLOAD 1440p (2560×1440 4K)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function drawCyberSteppedLogo(ctx: CanvasRenderingContext2D, accent: string) {
  const frameW = 680;
  const frameH = 220;
  const leftX = -frameW / 2;
  const topY = -frameH / 2;

  // Background Fill inside Frame
  ctx.fillStyle = "rgba(10, 10, 16, 0.9)";
  ctx.beginPath();
  drawSteppedPath(ctx, leftX, topY, frameW, frameH);
  ctx.fill();

  // Primary White Frame Outer Stroke
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.stroke();

  // Glowing Purple Chamfer Accent Strokes
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;

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

  // Top Title: UNCOMPILED
  ctx.save();
  ctx.font = "900 68px 'Syne', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("UNCOMPILED", 0, topY + 68);
  ctx.restore();

  // Bottom Left Slanted Hazard Stripes (///)
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
      ctx.shadowBlur = 12;
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

  // Connecting Line
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX + colors.length * gap + 10, stripeY + stripeH / 2);
  ctx.lineTo(leftX + 410, stripeY + stripeH / 2);
  ctx.stroke();
  ctx.restore();

  // Bottom Right ✦ OM ✦
  ctx.save();
  const omCenterX = leftX + 490;
  const omCenterY = stripeY + 12;

  // Left Spark Star
  drawSparkStar(ctx, omCenterX - 65, omCenterY, accent);

  // OM Text
  const textGrad = ctx.createLinearGradient(omCenterX - 30, omCenterY - 20, omCenterX + 30, omCenterY + 20);
  textGrad.addColorStop(0, "#f3e8ff");
  textGrad.addColorStop(0.5, "#c084fc");
  textGrad.addColorStop(1, accent);

  ctx.font = "900 56px 'Syne', sans-serif";
  ctx.fillStyle = textGrad;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.fillText("OM", omCenterX, omCenterY + 2);

  // Right Spark Star
  drawSparkStar(ctx, omCenterX + 65, omCenterY, accent);
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

function drawSparkStar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(x, y - 16);
  ctx.quadraticCurveTo(x, y, x + 16, y);
  ctx.quadraticCurveTo(x, y, x, y + 16);
  ctx.quadraticCurveTo(x, y, x - 16, y);
  ctx.quadraticCurveTo(x, y, x, y - 16);
  ctx.fill();
  ctx.restore();
}
