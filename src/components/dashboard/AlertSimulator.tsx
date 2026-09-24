"use client";

import { useState } from "react";
import { Bell, Heart, Star, DollarSign, Zap, Volume2, VolumeX } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { AlertType } from "@/lib/types";

export function AlertSimulator() {
  const [subName, setSubName] = useState("alex_prime");
  const [subTier, setSubTier] = useState("TIER 1");
  const [donorName, setDonorName] = useState("elena.eth");
  const [donorAmount, setDonorAmount] = useState("$50.00");
  const [donorMessage, setDonorMessage] = useState(
    "Incredible production quality tonight Om! Keep cooking."
  );
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const fireAlert = (type: AlertType, user: string, amount?: string, message?: string, tier?: string) => {
    soundEffects.play("click");
    streamBus.emit("TRIGGER_ALERT", {
      type,
      user,
      amount,
      message,
      tier,
    });
  };

  const toggleSound = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    soundEffects.setMuted(next);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            ALERT SIMULATOR & SFX
          </span>
        </div>

        <button
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold border transition-colors ${
            isAudioMuted
              ? "bg-red-500/20 border-red-500/40 text-red-300"
              : "bg-white/5 border-white/10 text-zinc-300"
          }`}
        >
          {isAudioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          <span>{isAudioMuted ? "SFX MUTED" : "SFX ACTIVE"}</span>
        </button>
      </div>

      {/* Quick Triggers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => fireAlert("FOLLOWER", "marcus_dev")}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex flex-col justify-between group transition-all"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Heart size={14} className="text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-[11px] text-white">FOLLOWER</span>
          </div>
          <span className="font-mono text-[9px] text-zinc-400">marcus_dev</span>
        </button>

        <button
          onClick={() => fireAlert("KICK_SUB", "kick_legend", undefined, "Hyped for the stream!", "TIER 1")}
          className="p-2.5 rounded-2xl bg-[#53FC18]/10 hover:bg-[#53FC18]/20 border border-[#53FC18]/30 text-left flex flex-col justify-between group transition-all"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Star size={14} className="text-[#53FC18] group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-[11px] text-white">KICK SUB</span>
          </div>
          <span className="font-mono text-[9px] text-[#53FC18]">kick_legend</span>
        </button>

        <button
          onClick={() => fireAlert("YT_SUPERCHAT", "youtube_creator", "$25.00", "Keep cooking Om! YouTube chat loves this!")}
          className="p-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left flex flex-col justify-between group transition-all"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign size={14} className="text-red-400 group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-[11px] text-white">YT SUPER CHAT</span>
          </div>
          <span className="font-mono text-[9px] text-red-300">$25.00</span>
        </button>

        <button
          onClick={() => fireAlert("RAID", "neon_valkyrie", "420 RAIDERS")}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex flex-col justify-between group transition-all"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-[11px] text-white">RAID</span>
          </div>
          <span className="font-mono text-[9px] text-zinc-400">420 RAIDERS</span>
        </button>
      </div>

      {/* Custom Sub Test */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-amber-400 tracking-wider">
            CUSTOM SUBSCRIBER TEST
          </span>
          <Star size={13} className="text-amber-400" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="Username"
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />

          <select
            value={subTier}
            onChange={(e) => setSubTier(e.target.value)}
            className="px-2 py-1.5 rounded-xl bg-zinc-900 border border-white/10 font-mono text-xs text-white focus:outline-none"
          >
            <option value="TIER 1">TIER 1</option>
            <option value="TIER 2">TIER 2</option>
            <option value="TIER 3">TIER 3 (VIP)</option>
            <option value="PRIME">PRIME</option>
          </select>

          <button
            onClick={() => fireAlert("SUB", subName, subTier, undefined, subTier)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all shadow-glowAmber"
          >
            FIRE SUB
          </button>
        </div>
      </div>

      {/* Custom Donation Test */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider">
            CUSTOM TIP / DONATION TEST
          </span>
          <DollarSign size={13} className="text-emerald-400" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Donor Name"
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-emerald-400"
          />
          <input
            value={donorAmount}
            onChange={(e) => setDonorAmount(e.target.value)}
            placeholder="Amount"
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <input
          value={donorMessage}
          onChange={(e) => setDonorMessage(e.target.value)}
          placeholder="Donor message..."
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-zinc-300 focus:outline-none"
        />

        <button
          onClick={() => fireAlert("DONATION", donorName, donorAmount, donorMessage)}
          className="mt-1 w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-colors"
        >
          FIRE DONATION ALERT ($)
        </button>
      </div>
    </div>
  );
}
