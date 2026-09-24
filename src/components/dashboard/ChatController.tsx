"use client";

import { useState, useRef } from "react";
import { MessageSquare, Radio, Send, Trash2, CheckCircle2 } from "lucide-react";
import { streamBus } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";
import { TwitchIRCClient } from "@/lib/twitch-irc";
import { ChatRole } from "@/lib/types";

export function ChatController() {
  const [twitchChannel, setTwitchChannel] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [authorName, setAuthorName] = useState("uncompiled.om");
  const [authorRole, setAuthorRole] = useState<ChatRole>("STREAMER");
  const [chatText, setChatText] = useState("");

  const twitchRef = useRef<TwitchIRCClient | null>(null);

  const handleConnectTwitch = () => {
    if (!twitchChannel.trim()) return;
    soundEffects.play("click");

    if (twitchRef.current) {
      twitchRef.current.disconnect();
    }

    const client = new TwitchIRCClient((msg) => {
      streamBus.emit("NEW_CHAT_MESSAGE", msg);
    });

    client.connect(twitchChannel);
    twitchRef.current = client;
    setIsConnected(true);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    soundEffects.play("click");
    streamBus.emit("NEW_CHAT_MESSAGE", {
      id: `manual-${Date.now()}`,
      author: authorName || "Host",
      role: authorRole,
      text: chatText,
      timestamp: Date.now(),
      platform: "system",
    });

    setChatText("");
  };

  const handleClearChat = () => {
    soundEffects.play("click");
    streamBus.emit("CLEAR_CHAT");
  };

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            LIVE CHAT CONNECT & BROADCASTER
          </span>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold transition-colors"
        >
          <Trash2 size={12} />
          <span>CLEAR CHAT</span>
        </button>
      </div>

      {/* Twitch Native Connector */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            NATIVE TWITCH IRC FEED (ZERO TOKENS NEEDED)
          </label>
          {isConnected && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold">
              <CheckCircle2 size={11} /> CONNECTED
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={twitchChannel}
            onChange={(e) => setTwitchChannel(e.target.value)}
            placeholder="e.g. uncompiled_om"
            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handleConnectTwitch}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
          >
            {isConnected ? "RECONNECT" : "CONNECT"}
          </button>
        </div>
      </div>

      {/* Manual Message Injector */}
      <form onSubmit={handleSendAnnouncement} className="flex flex-col gap-2">
        <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          BROADCAST PINNED ANNOUNCEMENT
        </label>

        <div className="grid grid-cols-2 gap-2">
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Host Name"
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />

          <select
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value as ChatRole)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 font-mono text-xs text-white focus:outline-none"
          >
            <option value="STREAMER">STREAMER / HOST</option>
            <option value="MOD">MODERATOR</option>
            <option value="VIP">VIP</option>
            <option value="SUB">SUBSCRIBER</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            placeholder="Type message to appear on stream..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-glowAmber"
          >
            <Send size={12} />
            <span>SEND</span>
          </button>
        </div>
      </form>
    </div>
  );
}
