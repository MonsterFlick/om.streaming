"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Star, Crown, Bot, Sparkles, Megaphone } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { ChatMessage, ChatRole, ShoutoutEvent } from "@/lib/types";
import { chatAutomationEngine } from "@/lib/chat-automations";

interface ChatWidgetProps {
  autoFade?: boolean;
  fadeDelay?: number;
  maxMessages?: number;
  className?: string;
}

export function ChatWidget({
  autoFade = false,
  fadeDelay = 12000,
  maxMessages = 20,
  className = "",
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      author: "marcus_dev",
      role: "VIP",
      text: "The new studio overlay typography is insane! Razor sharp.",
      timestamp: Date.now() - 30000,
    },
    {
      id: "initial-2",
      author: "clara_motion",
      role: "SUB",
      text: "Love that we have separated webcam frames now! So easy to align in OBS.",
      timestamp: Date.now() - 15000,
    },
    {
      id: "initial-3",
      author: "uncompiled.om",
      role: "STREAMER",
      text: "Welcome to the broadcast everyone! Let's cook tonight.",
      timestamp: Date.now() - 5000,
    },
  ]);

  const [activeShoutout, setActiveShoutout] = useState<ShoutoutEvent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubNew = streamBus.on<ChatMessage>("NEW_CHAT_MESSAGE", (msg) => {
      if (!msg || !msg.text) return;

      const isFirst = msg.isFirstChat ?? (chatAutomationEngine.getConfig().showFirstChatBadge && chatAutomationEngine.isFirstTimeChatter(msg.author));

      const newMsg: ChatMessage = {
        id: msg.id || `chat-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        author: msg.author || "Viewer",
        role: msg.role || "VIEWER",
        text: msg.text,
        timestamp: Date.now(),
        platform: msg.platform || "system",
        isFirstChat: isFirst,
        isBotResponse: msg.isBotResponse,
        commandTriggered: msg.commandTriggered,
      };

      setMessages((prev) => {
        const next = [...prev, newMsg];
        return next.slice(-maxMessages);
      });
    });

    const unsubClear = streamBus.on("CLEAR_CHAT", () => {
      setMessages([]);
    });

    // Listen for live shoutout events (!so @username)
    const unsubShoutout = streamBus.on<ShoutoutEvent>("SHOUTOUT_EVENT", (event) => {
      if (!event) return;
      setActiveShoutout(event);
      setTimeout(() => {
        setActiveShoutout(null);
      }, 7000);
    });

    return () => {
      unsubNew();
      unsubClear();
      unsubShoutout();
    };
  }, [maxMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const getPlatformBadge = (platform?: string) => {
    switch (platform) {
      case "kick":
        return (
          <span className="px-1.5 py-0.5 rounded bg-[#53FC18]/20 text-[#53FC18] border border-[#53FC18]/40 font-mono text-[8px] font-extrabold uppercase tracking-wider">
            KICK
          </span>
        );
      case "youtube":
        return (
          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-[8px] font-extrabold uppercase tracking-wider">
            YT
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: ChatRole, isBot?: boolean) => {
    if (isBot) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-extrabold border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
          <Bot size={10} className="text-cyan-300" />
          <span>BOT</span>
        </span>
      );
    }

    switch (role) {
      case "STREAMER":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold border border-amber-500/30">
            <Crown size={9} />
            <span>HOST</span>
          </span>
        );
      case "MOD":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-[9px] font-bold border border-blue-500/30">
            <Shield size={9} />
            <span>MOD</span>
          </span>
        );
      case "VIP":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-400 font-mono text-[9px] font-bold border border-purple-500/30">
            <Star size={9} />
            <span>VIP</span>
          </span>
        );
      case "SUB":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/30">
            <span>SUB</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Dynamic Holographic Shoutout Card (Fires on !so @username) */}
      <AnimatePresence>
        {activeShoutout && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", damping: 18, stiffness: 240 }}
            className="mb-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-black/80 border border-amber-400/40 backdrop-blur-xl shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300">
              <Megaphone size={18} className="animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  CREATOR SHOUTOUT
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">✦ GO SHOW LOVE ✦</span>
              </div>
              <div className="font-display font-extrabold text-sm text-white truncate mt-0.5">
                @{activeShoutout.targetUser}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Messages Stream */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-none p-3"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
              className={`rounded-2xl p-2.5 backdrop-blur-md border transition-all ${
                msg.isBotResponse
                  ? "bg-gradient-to-r from-cyan-950/50 via-purple-950/30 to-black/80 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.18)]"
                  : msg.role === "STREAMER"
                  ? "bg-amber-500/10 border-amber-500/30 shadow-sm"
                  : msg.isFirstChat
                  ? "bg-emerald-950/30 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : "bg-black/50 border-white/10"
              }`}
            >
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                {getPlatformBadge(msg.platform)}
                {getRoleBadge(msg.role, msg.isBotResponse)}

                {/* Sparkling First-Time Chatter Badge */}
                {msg.isFirstChat && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 font-mono text-[8px] font-extrabold border border-emerald-400/40 animate-pulse">
                    <Sparkles size={8} className="text-emerald-300" />
                    <span>FIRST CHAT</span>
                  </span>
                )}

                {/* Command indicator tag */}
                {msg.commandTriggered && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40 font-mono text-[8px] font-extrabold uppercase">
                    {msg.commandTriggered}
                  </span>
                )}

                <span
                  className={`font-display font-bold text-xs truncate ${
                    msg.isBotResponse
                      ? "text-cyan-300 font-black tracking-wide"
                      : msg.role === "STREAMER"
                      ? "text-amber-300"
                      : msg.role === "VIP"
                      ? "text-purple-300"
                      : msg.role === "MOD"
                      ? "text-blue-300"
                      : msg.isFirstChat
                      ? "text-emerald-300"
                      : "text-zinc-200"
                  }`}
                >
                  {msg.author}
                </span>
              </div>

              <p
                className={`font-sans text-xs leading-relaxed break-words ${
                  msg.isBotResponse
                    ? "text-cyan-50 font-medium tracking-wide"
                    : msg.isFirstChat
                    ? "text-white font-medium"
                    : "text-zinc-100 font-medium"
                }`}
              >
                {msg.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
