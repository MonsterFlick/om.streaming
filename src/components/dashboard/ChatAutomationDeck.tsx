"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Terminal,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Check,
  Megaphone,
  Radio,
  Sliders,
  Volume2,
  ExternalLink,
} from "lucide-react";
import { chatAutomationEngine } from "@/lib/chat-automations";
import { ChatAutomationConfig, ChatCommand } from "@/lib/types";
import { streamBus } from "@/lib/stream-bus";
import { soundEffects } from "@/lib/sound-effects";

export function ChatAutomationDeck() {
  const [config, setConfig] = useState<ChatAutomationConfig>(chatAutomationEngine.getConfig());
  const [seenCount, setSeenCount] = useState<number>(0);
  const [uptime, setUptime] = useState<string>("0m");
  const [activeSubTab, setActiveSubTab] = useState<"commands" | "welcomer" | "shoutout">("commands");

  // New Command Form State
  const [isAddingCmd, setIsAddingCmd] = useState(false);
  const [newCmdName, setNewCmdName] = useState("");
  const [newCmdResponse, setNewCmdResponse] = useState("");
  const [newCmdDesc, setNewCmdDesc] = useState("");

  // Quick Shoutout Form State
  const [shoutoutUser, setShoutoutUser] = useState("");
  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setLastActionToast(msg);
    setTimeout(() => setLastActionToast(null), 3000);
  };

  useEffect(() => {
    setConfig(chatAutomationEngine.getConfig());
    setSeenCount(chatAutomationEngine.getSeenUsersCount());
    setUptime(chatAutomationEngine.getUptimeString());

    const timer = setInterval(() => {
      setSeenCount(chatAutomationEngine.getSeenUsersCount());
      setUptime(chatAutomationEngine.getUptimeString());
    }, 2000);

    const unsubBus = streamBus.on<ChatAutomationConfig>(
      "CHAT_AUTOMATIONS_CONFIG_UPDATED",
      (newConf) => {
        if (newConf) setConfig(newConf);
      }
    );

    return () => {
      clearInterval(timer);
      unsubBus();
    };
  }, []);

  const handleToggleMaster = () => {
    soundEffects.play("click");
    const updated = !config.commandsEnabled;
    chatAutomationEngine.updateConfig({ commandsEnabled: updated });
    showToast(updated ? "Commands Engine Activated" : "Commands Engine Paused");
  };

  const handleToggleWelcomer = () => {
    soundEffects.play("click");
    const updated = !config.welcomeNewChatters;
    chatAutomationEngine.updateConfig({ welcomeNewChatters: updated });
    showToast(updated ? "Auto-Welcome ON" : "Auto-Welcome OFF");
  };

  const handleToggleBadge = () => {
    soundEffects.play("click");
    const updated = !config.showFirstChatBadge;
    chatAutomationEngine.updateConfig({ showFirstChatBadge: updated });
  };

  const handleToggleSound = () => {
    soundEffects.play("click");
    const updated = !config.welcomeSound;
    chatAutomationEngine.updateConfig({ welcomeSound: updated });
  };

  const handleUpdateTemplate = (tmpl: string) => {
    chatAutomationEngine.updateConfig({ welcomeMessageTemplate: tmpl });
  };

  const handleToggleCommand = (id: string) => {
    soundEffects.play("click");
    chatAutomationEngine.toggleCommand(id);
  };

  const handleDeleteCommand = (id: string) => {
    soundEffects.play("scratch");
    chatAutomationEngine.deleteCommand(id);
    showToast("Command Deleted");
  };

  const handleCreateCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmdName.trim() || !newCmdResponse.trim()) return;

    soundEffects.play("bell");
    chatAutomationEngine.addCommand({
      command: newCmdName.trim(),
      response: newCmdResponse.trim(),
      description: newCmdDesc.trim() || "Custom streamer command",
      enabled: true,
      aliases: [],
    });

    setNewCmdName("");
    setNewCmdResponse("");
    setNewCmdDesc("");
    setIsAddingCmd(false);
    showToast("New Command Added!");
  };

  // Simulation Triggers for testing in Dashboard
  const handleTestCommand = (cmd: ChatCommand) => {
    soundEffects.play("click");
    // Emit test user typing the command
    streamBus.emit("NEW_CHAT_MESSAGE", {
      id: `test-cmd-${Date.now()}`,
      author: "Viewer_Alex",
      role: "VIEWER",
      text: cmd.command,
      timestamp: Date.now(),
      platform: "kick",
    });
    showToast(`Executed ${cmd.command}`);
  };

  const handleSimulateNewChatter = () => {
    soundEffects.play("click");
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const testUsername = `NeoGamer_${randomSuffix}`;

    streamBus.emit("NEW_CHAT_MESSAGE", {
      id: `test-first-${Date.now()}`,
      author: testUsername,
      role: "VIEWER",
      text: "Yo what's up everyone! First time dropping by the stream!",
      timestamp: Date.now(),
      platform: "kick",
    });

    setSeenCount(chatAutomationEngine.getSeenUsersCount());
    showToast(`Simulated First Chat from @${testUsername}!`);
  };

  const handleResetChatters = () => {
    soundEffects.play("scratch");
    chatAutomationEngine.resetSeenUsers();
    setSeenCount(0);
    showToast("Session Chatters Reset!");
  };

  const handleSendShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    const target = shoutoutUser.trim().replace(/^@/, "");
    if (!target) return;

    soundEffects.play("applause");
    streamBus.emit("NEW_CHAT_MESSAGE", {
      id: `shoutout-cmd-${Date.now()}`,
      author: "uncompiled.om",
      role: "STREAMER",
      text: `!so @${target}`,
      timestamp: Date.now(),
      platform: "system",
    });

    setShoutoutUser("");
    showToast(`Shoutout dispatched for @${target}!`);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/85 border border-white/10 backdrop-blur-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Bot size={17} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-wider text-white">
                CHAT AUTOMATIONS & BOT ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono text-[9px] font-extrabold uppercase">
                {config.commandsEnabled ? "ONLINE" : "PAUSED"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-zinc-400">
              Welcome new viewers automatically & trigger instant ! commands in OBS
            </p>
          </div>
        </div>

        {/* Master Commands Engine Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lastActionToast && (
            <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 animate-pulse">
              {lastActionToast}
            </span>
          )}
          <button
            onClick={handleToggleMaster}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              config.commandsEnabled
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-zinc-800 text-zinc-400 border border-white/10 hover:text-white"
            }`}
          >
            <Radio size={12} />
            <span>{config.commandsEnabled ? "ENGINE ACTIVE" : "PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-black/50 border border-white/5 font-mono text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 uppercase">Chatters Seen</span>
          <span className="text-sm font-black text-emerald-400">{seenCount}</span>
        </div>
        <div className="flex flex-col items-center border-x border-white/10">
          <span className="text-[10px] text-zinc-400 uppercase">Active Commands</span>
          <span className="text-sm font-black text-cyan-400">
            {config.commands.filter((c) => c.enabled).length} / {config.commands.length}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 uppercase">Stream Uptime</span>
          <span className="text-sm font-black text-amber-400">{uptime}</span>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-white/10">
        <button
          onClick={() => setActiveSubTab("commands")}
          className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "commands"
              ? "bg-cyan-500 text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Terminal size={12} />
          <span>! COMMANDS ({config.commands.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab("welcomer")}
          className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "welcomer"
              ? "bg-emerald-500 text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles size={12} />
          <span>NEW CHATTER WELCOME</span>
        </button>
        <button
          onClick={() => setActiveSubTab("shoutout")}
          className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "shoutout"
              ? "bg-amber-500 text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Megaphone size={12} />
          <span>LIVE SHOUTOUT</span>
        </button>
      </div>

      {/* TAB 1: ! COMMANDS MANAGER */}
      {activeSubTab === "commands" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              CONFIGURED BOT COMMANDS
            </span>
            <button
              onClick={() => setIsAddingCmd(!isAddingCmd)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold transition-all"
            >
              <Plus size={12} />
              <span>{isAddingCmd ? "CANCEL" : "ADD COMMAND"}</span>
            </button>
          </div>

          {/* New Command Input Box */}
          {isAddingCmd && (
            <form
              onSubmit={handleCreateCommand}
              className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-400/30 flex flex-col gap-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-[9px] text-zinc-400 font-bold block mb-1">
                    COMMAND (e.g. !sens, !rank, !merch)
                  </label>
                  <input
                    type="text"
                    placeholder="!crosshair"
                    value={newCmdName}
                    onChange={(e) => setNewCmdName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-zinc-400 font-bold block mb-1">
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    placeholder="My in-game crosshair code"
                    value={newCmdDesc}
                    onChange={(e) => setNewCmdDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[9px] text-zinc-400 font-bold block mb-1">
                  BOT RESPONSE TEXT
                </label>
                <input
                  type="text"
                  placeholder="Crosshair Code: 0;P;c;5;o;1;d;1;z;3..."
                  value={newCmdResponse}
                  onChange={(e) => setNewCmdResponse(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="self-end px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Check size={13} />
                <span>SAVE COMMAND</span>
              </button>
            </form>
          )}

          {/* Commands List */}
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-none pr-1">
            {config.commands.map((cmd) => (
              <div
                key={cmd.id}
                className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  cmd.enabled
                    ? "bg-black/50 border-white/10 hover:border-cyan-400/40"
                    : "bg-black/20 border-white/5 opacity-50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-extrabold text-xs text-cyan-300">
                      {cmd.command}
                    </span>
                    {cmd.aliases && cmd.aliases.length > 0 && (
                      <span className="font-mono text-[9px] text-zinc-500">
                        ({cmd.aliases.join(", ")})
                      </span>
                    )}
                    <span className="font-sans text-[10px] text-zinc-400 truncate">
                      • {cmd.description}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-zinc-300 truncate">
                    {cmd.response === "COMMANDS_LIST_DYNAMIC"
                      ? "• Lists all active commands dynamically"
                      : cmd.response === "STREAM_UPTIME_DYNAMIC"
                      ? `• Shows live stream uptime (Currently: ${uptime})`
                      : cmd.response === "SHOUTOUT_DYNAMIC"
                      ? "• Emits on-screen shoutout graphics (!so @user)"
                      : cmd.response}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Test button */}
                  <button
                    onClick={() => handleTestCommand(cmd)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title={`Test ${cmd.command}`}
                  >
                    <Play size={12} className="text-cyan-400" />
                  </button>

                  {/* Toggle Enable/Disable */}
                  <button
                    onClick={() => handleToggleCommand(cmd.id)}
                    className={`px-2 py-1 rounded-xl font-mono text-[10px] font-bold transition-all ${
                      cmd.enabled
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-zinc-800 text-zinc-500 border border-white/5"
                    }`}
                  >
                    {cmd.enabled ? "ACTIVE" : "OFF"}
                  </button>

                  {/* Delete custom command */}
                  {!cmd.id.startsWith("cmd-kick") &&
                    !cmd.id.startsWith("cmd-yt") &&
                    !cmd.id.startsWith("cmd-commands") && (
                      <button
                        onClick={() => handleDeleteCommand(cmd.id)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Command"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NEW CHATTER WELCOMER */}
      {activeSubTab === "welcomer" && (
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Toggle 1: Auto Welcome Bot */}
            <button
              onClick={handleToggleWelcomer}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                config.welcomeNewChatters
                  ? "bg-emerald-950/20 border-emerald-400/40 shadow-sm"
                  : "bg-black/40 border-white/10 opacity-70"
              }`}
            >
              <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
                Auto-Welcome
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-display font-bold text-xs text-white">
                  Bot Chat Message
                </span>
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    config.welcomeNewChatters
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {config.welcomeNewChatters ? "ON" : "OFF"}
                </span>
              </div>
            </button>

            {/* Toggle 2: First Chat Glow Badge */}
            <button
              onClick={handleToggleBadge}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                config.showFirstChatBadge
                  ? "bg-cyan-950/20 border-cyan-400/40 shadow-sm"
                  : "bg-black/40 border-white/10 opacity-70"
              }`}
            >
              <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
                OBS Visuals
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-display font-bold text-xs text-white">
                  ✨ FIRST CHAT Badge
                </span>
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    config.showFirstChatBadge
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {config.showFirstChatBadge ? "ON" : "OFF"}
                </span>
              </div>
            </button>

            {/* Toggle 3: Audio Chime */}
            <button
              onClick={handleToggleSound}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                config.welcomeSound
                  ? "bg-amber-950/20 border-amber-400/40 shadow-sm"
                  : "bg-black/40 border-white/10 opacity-70"
              }`}
            >
              <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
                Audio Notification
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-display font-bold text-xs text-white">
                  Glass Chime Sound
                </span>
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    config.welcomeSound
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {config.welcomeSound ? "ON" : "OFF"}
                </span>
              </div>
            </button>
          </div>

          {/* Template Input */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase">
                WELCOME MESSAGE TEMPLATE (USE &#123;user&#125; FOR CHATTER NAME)
              </label>
              <span className="font-mono text-[9px] text-zinc-500">Auto-replaces &#123;user&#125;</span>
            </div>
            <input
              type="text"
              value={config.welcomeMessageTemplate}
              onChange={(e) => handleUpdateTemplate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
            <div className="font-sans text-[11px] text-zinc-400 bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="font-mono text-[10px] text-emerald-400 font-bold mr-1">PREVIEW:</span>
              {config.welcomeMessageTemplate.replace(/\{user\}/gi, "MarcusGaming")}
            </div>
          </div>

          {/* Test & Reset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={handleSimulateNewChatter}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles size={13} />
              <span>TEST SIMULATE NEW VIEWER</span>
            </button>

            <button
              onClick={handleResetChatters}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              <span>RESET SESSION CHATTERS ({seenCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SHOUTOUT TOOL */}
      {activeSubTab === "shoutout" && (
        <form onSubmit={handleSendShoutout} className="flex flex-col gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-400/30 flex flex-col gap-2">
            <span className="font-display font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <Megaphone size={14} />
              <span>ON-SCREEN CREATOR SHOUTOUT (!so)</span>
            </span>
            <p className="font-sans text-xs text-zinc-300">
              Trigger a flashy holographic banner in OBS overlay and post an official shoutout link in chat.
            </p>

            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 font-mono text-zinc-500 text-xs">@</span>
                <input
                  type="text"
                  placeholder="streamer_username"
                  value={shoutoutUser}
                  onChange={(e) => setShoutoutUser(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={!shoutoutUser.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <Megaphone size={13} />
                <span>SHOUTOUT NOW</span>
              </button>
            </div>
          </div>

          <div className="font-mono text-[10px] text-zinc-500 flex items-center gap-2">
            <span>TIP: Viewers or mods can also type:</span>
            <span className="text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded">!so @friend</span>
            <span>in chat to trigger this live!</span>
          </div>
        </form>
      )}
    </div>
  );
}
