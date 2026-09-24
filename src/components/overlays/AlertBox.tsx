"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Star, Zap, DollarSign, Heart, Sparkles } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { AlertEvent } from "@/lib/types";

export function AlertBox() {
  const [currentAlert, setCurrentAlert] = useState<AlertEvent | null>(null);
  const [queue, setQueue] = useState<AlertEvent[]>([]);

  useEffect(() => {
    return streamBus.on<AlertEvent>("TRIGGER_ALERT", (alertData) => {
      const alert: AlertEvent = {
        id: alertData?.id || `alert-${Date.now()}`,
        type: alertData?.type || "FOLLOWER",
        user: alertData?.user || "Anonymous",
        amount: alertData?.amount,
        message: alertData?.message,
        tier: alertData?.tier,
        timestamp: Date.now(),
      };

      setQueue((prev) => [...prev, alert]);
    });
  }, []);

  useEffect(() => {
    if (currentAlert || queue.length === 0) return;

    const nextAlert = queue[0];
    setCurrentAlert(nextAlert);
    setQueue((prev) => prev.slice(1));

    // Play synthesized sound
    if (nextAlert.type === "SUB") {
      soundEffects.play("sub");
      triggerConfetti();
    } else if (nextAlert.type === "DONATION") {
      soundEffects.play("donation");
      triggerConfetti();
    } else if (nextAlert.type === "RAID") {
      soundEffects.play("raid");
      triggerConfetti();
    } else {
      soundEffects.play("chime");
    }

    const timer = setTimeout(() => {
      setCurrentAlert(null);
    }, 5500);

    return () => clearTimeout(timer);
  }, [currentAlert, queue]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.15 },
        colors: ["#f59e0b", "#3b82f6", "#ffffff", "#ff5252"],
      });
    } catch (e) {}
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "KICK_SUB":
      case "SUB":
        return <Star size={20} className="text-amber-400" />;
      case "KICK_TIP":
      case "YT_SUPERCHAT":
      case "DONATION":
        return <DollarSign size={20} className="text-emerald-400" />;
      case "KICK_RAID":
      case "RAID":
        return <Zap size={20} className="text-blue-400" />;
      case "YT_MEMBER":
      case "YT_SUB":
        return <Sparkles size={20} className="text-rose-400" />;
      default:
        return <Heart size={20} className="text-rose-400" />;
    }
  };

  const getAlertTitle = (type: string, tier?: string) => {
    switch (type) {
      case "KICK_SUB":
        return `KICK SUBSCRIBER // ${tier || "TIER 1"}`;
      case "KICK_TIP":
        return "KICK TIP // SUPPORT ACTIVE";
      case "KICK_RAID":
        return "KICK RAID // HOST INCOMING";
      case "YT_SUPERCHAT":
        return "YOUTUBE SUPER CHAT // APPRECIATED";
      case "YT_MEMBER":
        return `YOUTUBE MEMBER // ${tier || "WELCOME"}`;
      case "YT_SUB":
        return "YOUTUBE SUBSCRIBER // WELCOME";
      case "SUB":
        return `NEW SUBSCRIBER // ${tier || "TIER 1"}`;
      case "DONATION":
        return "TIP & DONATION // APPRECIATED";
      case "RAID":
        return "INCOMING RAID // WELCOME";
      default:
        return "NEW FOLLOWER // WELCOME";
    }
  };

  return (
    <div className="fixed top-8 inset-x-0 flex justify-center z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        {currentAlert && (
          <motion.div
            key={currentAlert.id}
            initial={{ opacity: 0, y: -40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -25, scale: 0.95, filter: "blur(8px)" }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            className="w-[460px] rounded-3xl bg-[#0c0e14]/90 border border-white/20 p-5 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Top highlight line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-blue-500" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                {getAlertIcon(currentAlert.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                    {getAlertTitle(currentAlert.type, currentAlert.tier)}
                  </span>
                  {currentAlert.amount && (
                    <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {currentAlert.amount}
                    </span>
                  )}
                </div>

                <div className="font-display font-extrabold text-xl text-white mt-0.5 truncate tracking-tight">
                  {currentAlert.user}
                </div>

                {currentAlert.message && (
                  <p className="mt-1.5 text-xs text-zinc-300 font-sans italic line-clamp-2 bg-white/5 rounded-xl p-2 border border-white/5">
                    &ldquo;{currentAlert.message}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Bottom animated progress meter */}
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5.2, ease: "linear" }}
                className="h-full bg-amber-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
