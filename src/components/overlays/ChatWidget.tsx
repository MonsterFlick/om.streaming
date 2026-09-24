"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Star, Crown, MessageSquare } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { ChatMessage, ChatRole } from "@/lib/types";

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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubNew = streamBus.on<ChatMessage>("NEW_CHAT_MESSAGE", (msg) => {
      if (!msg || !msg.text) return;
      const newMsg: ChatMessage = {
        id: msg.id || `chat-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        author: msg.author || "Viewer",
        role: msg.role || "VIEWER",
        text: msg.text,
        timestamp: Date.now(),
        platform: msg.platform || "system",
      };

      setMessages((prev) => {
        const next = [...prev, newMsg];
        return next.slice(-maxMessages);
      });
    });

    const unsubClear = streamBus.on("CLEAR_CHAT", () => {
      setMessages([]);
    });

    return () => {
      unsubNew();
      unsubClear();
    };
  }, [maxMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const getRoleBadge = (role: ChatRole) => {
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
    <div
      ref={containerRef}
      className={`flex flex-col gap-2 overflow-y-auto scrollbar-none p-3 ${className}`}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 220 }}
            className={`rounded-2xl p-2.5 backdrop-blur-md border ${
              msg.role === "STREAMER"
                ? "bg-amber-500/10 border-amber-500/30 shadow-sm"
                : "bg-black/50 border-white/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getRoleBadge(msg.role)}
              <span
                className={`font-display font-bold text-xs truncate ${
                  msg.role === "STREAMER"
                    ? "text-amber-300"
                    : msg.role === "VIP"
                    ? "text-purple-300"
                    : msg.role === "MOD"
                    ? "text-blue-300"
                    : "text-zinc-200"
                }`}
              >
                {msg.author}
              </span>
            </div>
            <p className="font-sans text-xs text-zinc-100 leading-relaxed break-words font-medium">
              {msg.text}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
