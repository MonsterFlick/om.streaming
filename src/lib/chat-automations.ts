
import { ChatMessage, ChatRole, ChatCommand, ChatAutomationConfig, ShoutoutEvent } from "./types";
import { streamBus } from "./stream-bus";
import { soundEffects } from "./sound-effects";

export const DEFAULT_CHAT_COMMANDS: ChatCommand[] = [
  {
    id: "cmd-kick",
    command: "!kick",
    aliases: ["!stream", "!live"],
    response: "Watch and follow on Kick: https://kick.com/uncompiled-om 🟢",
    description: "Links to the official Kick channel",
    enabled: true,
  },
  {
    id: "cmd-yt",
    command: "!yt",
    aliases: ["!youtube", "!sub"],
    response: "Subscribe on YouTube for full VODs, uncut gameplay & dev highlights! 🔴",
    description: "Links to the YouTube channel",
    enabled: true,
  },
  {
    id: "cmd-discord",
    command: "!discord",
    aliases: ["!community"],
    response: "Join our community Discord to squad up and chat: discord.gg/uncompiled 💬",
    description: "Community Discord invite link",
    enabled: true,
  },
  {
    id: "cmd-specs",
    command: "!specs",
    aliases: ["!pc", "!rig", "!setup"],
    response: "Streaming Rig: RTX 4080 • Ryzen 9 7900X • 64GB DDR5 • OBS Studio ⚡",
    description: "PC hardware specifications",
    enabled: true,
  },
  {
    id: "cmd-uptime",
    command: "!uptime",
    aliases: ["!time"],
    response: "STREAM_UPTIME_DYNAMIC",
    description: "Shows stream live duration",
    enabled: true,
  },
  {
    id: "cmd-socials",
    command: "!socials",
    aliases: ["!links"],
    response: "🟢 Kick: kick.com/uncompiled-om | 🔴 YouTube: @uncompiled-om | 💬 Discord: discord.gg/uncompiled",
    description: "All official stream social links",
    enabled: true,
  },
  {
    id: "cmd-rules",
    command: "!rules",
    aliases: [],
    response: "1. Be respectful • 2. No toxicity or hate speech • 3. No backseating unless asked • 4. Enjoy! 🎮",
    description: "Stream community guidelines",
    enabled: true,
  },
  {
    id: "cmd-commands",
    command: "!commands",
    aliases: ["!help"],
    response: "COMMANDS_LIST_DYNAMIC",
    description: "Lists all available chat bot commands",
    enabled: true,
  },
  {
    id: "cmd-so",
    command: "!so",
    aliases: ["!shoutout"],
    response: "SHOUTOUT_DYNAMIC",
    description: "Shout out a creator/friend on screen (!so @user)",
    enabled: true,
  },
];

export const DEFAULT_AUTOMATION_CONFIG: ChatAutomationConfig = {
  welcomeNewChatters: true,
  welcomeMessageTemplate: "Welcome @{user} to the broadcast! Glad to have you here! 🎉",
  welcomeSound: true,
  showFirstChatBadge: true,
  commandsEnabled: true,
  botName: "UNCOMPILED BOT",
  commands: DEFAULT_CHAT_COMMANDS,
};

const STORAGE_KEY_CONFIG = "om_chat_automations_config_v1";
const STORAGE_KEY_SEEN_USERS = "om_chat_seen_users_v1";
const STORAGE_KEY_STREAM_START = "om_stream_start_timestamp_v1";
const LEADER_KEY = "om_automation_leader_lock";

class ChatAutomationEngine {
  private config: ChatAutomationConfig = DEFAULT_AUTOMATION_CONFIG;
  private seenUsers: Set<string> = new Set();
  private streamStartTime: number = Date.now();
  private instanceId: string = Math.random().toString(36).substring(2, 9);
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load saved config
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = {
          ...DEFAULT_AUTOMATION_CONFIG,
          ...parsed,
          commands: parsed.commands && parsed.commands.length > 0 ? parsed.commands : DEFAULT_CHAT_COMMANDS,
        };
      }
    } catch (e) {
      console.warn("[ChatAutomations] Failed to load config from storage", e);
    }

    // Load seen users for this stream session
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEY_SEEN_USERS);
      if (savedUsers) {
        const list: string[] = JSON.parse(savedUsers);
        this.seenUsers = new Set(list.map((u) => u.toLowerCase()));
      }
    } catch (e) {}

    // Stream start time
    try {
      const savedStart = localStorage.getItem(STORAGE_KEY_STREAM_START);
      if (savedStart) {
        this.streamStartTime = parseInt(savedStart, 10);
      } else {
        localStorage.setItem(STORAGE_KEY_STREAM_START, this.streamStartTime.toString());
      }
    } catch (e) {}

    // Listen for config sync from other tabs
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY_CONFIG && e.newValue) {
        try {
          this.config = JSON.parse(e.newValue);
        } catch (err) {}
      }
      if (e.key === STORAGE_KEY_SEEN_USERS && e.newValue) {
        try {
          const list: string[] = JSON.parse(e.newValue);
          this.seenUsers = new Set(list.map((u) => u.toLowerCase()));
        } catch (err) {}
      }
    });

    // Auto-listen to universal chat stream
    streamBus.on<ChatMessage>("NEW_CHAT_MESSAGE", (msg) => {
      if (!msg || !msg.text || msg.isBotResponse) return;
      this.handleIncoming(msg);
    });
  }

  private handleIncoming(rawMsg: ChatMessage) {
    if (!this.isLeader()) return;

    const { botReply, shoutout } = this.processIncomingMessage(rawMsg);

    if (shoutout) {
      streamBus.emit("SHOUTOUT_EVENT", shoutout);
    }

    if (botReply) {
      setTimeout(() => {
        streamBus.emit("NEW_CHAT_MESSAGE", botReply);
      }, 450);
    }
  }

  /**
   * Leader lock: ensures only one browser tab sends bot responses
   */
  public isLeader(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const now = Date.now();
      const raw = localStorage.getItem(LEADER_KEY);
      if (raw) {
        const { id, expiry } = JSON.parse(raw);
        if (id === this.instanceId || now > expiry) {
          localStorage.setItem(LEADER_KEY, JSON.stringify({ id: this.instanceId, expiry: now + 3500 }));
          return true;
        }
        return false;
      } else {
        localStorage.setItem(LEADER_KEY, JSON.stringify({ id: this.instanceId, expiry: now + 3500 }));
        return true;
      }
    } catch (e) {
      return true;
    }
  }

  public getConfig(): ChatAutomationConfig {
    return this.config;
  }

  public updateConfig(partial: Partial<ChatAutomationConfig>) {
    this.config = { ...this.config, ...partial };
    this.saveConfig();
    streamBus.emit("CHAT_AUTOMATIONS_CONFIG_UPDATED", this.config);
  }

  private saveConfig() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
    } catch (e) {}
  }

  public addCommand(cmd: Omit<ChatCommand, "id">): ChatCommand {
    const newCmd: ChatCommand = {
      ...cmd,
      id: `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      command: cmd.command.startsWith("!") ? cmd.command : `!${cmd.command}`,
    };
    this.config.commands = [...this.config.commands, newCmd];
    this.saveConfig();
    streamBus.emit("CHAT_AUTOMATIONS_CONFIG_UPDATED", this.config);
    return newCmd;
  }

  public updateCommand(id: string, partial: Partial<ChatCommand>) {
    this.config.commands = this.config.commands.map((c) => {
      if (c.id === id) {
        const updated = { ...c, ...partial };
        if (updated.command && !updated.command.startsWith("!")) {
          updated.command = `!${updated.command}`;
        }
        return updated;
      }
      return c;
    });
    this.saveConfig();
    streamBus.emit("CHAT_AUTOMATIONS_CONFIG_UPDATED", this.config);
  }

  public deleteCommand(id: string) {
    this.config.commands = this.config.commands.filter((c) => c.id !== id);
    this.saveConfig();
    streamBus.emit("CHAT_AUTOMATIONS_CONFIG_UPDATED", this.config);
  }

  public toggleCommand(id: string) {
    this.config.commands = this.config.commands.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    this.saveConfig();
    streamBus.emit("CHAT_AUTOMATIONS_CONFIG_UPDATED", this.config);
  }

  public getSeenUsersCount(): number {
    return this.seenUsers.size;
  }

  public resetSeenUsers() {
    this.seenUsers.clear();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_SEEN_USERS);
        this.streamStartTime = Date.now();
        localStorage.setItem(STORAGE_KEY_STREAM_START, this.streamStartTime.toString());
      } catch (e) {}
    }
  }

  private markUserSeen(username: string) {
    const normalized = username.trim().toLowerCase();
    if (!normalized) return;
    this.seenUsers.add(normalized);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_SEEN_USERS, JSON.stringify(Array.from(this.seenUsers)));
      } catch (e) {}
    }
  }

  public isFirstTimeChatter(username: string): boolean {
    const normalized = username.trim().toLowerCase();
    return !this.seenUsers.has(normalized);
  }

  /**
   * Formats dynamic stream live uptime
   */
  public getUptimeString(): string {
    const diff = Math.max(0, Date.now() - this.streamStartTime);
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  }

  /**
   * Main processor for incoming messages: checks first-time chatters and executes commands
   */
  public processIncomingMessage(rawMsg: ChatMessage): {
    enrichedMessage: ChatMessage;
    botReply?: ChatMessage;
    shoutout?: ShoutoutEvent;
  } {
    const isFirst = this.isFirstTimeChatter(rawMsg.author);
    const enrichedMessage: ChatMessage = {
      ...rawMsg,
      isFirstChat: this.config.showFirstChatBadge && isFirst,
    };

    let botReply: ChatMessage | undefined;
    let shoutout: ShoutoutEvent | undefined;

    // 1. Process First-Time Chatter
    if (isFirst) {
      this.markUserSeen(rawMsg.author);

      if (this.config.welcomeNewChatters && !rawMsg.isBotResponse && rawMsg.role !== "STREAMER") {
        const welcomeText = this.config.welcomeMessageTemplate.replace(
          /\{user\}/gi,
          rawMsg.author
        );

        botReply = {
          id: `bot-welcome-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          author: this.config.botName,
          role: "MOD",
          text: welcomeText,
          timestamp: Date.now(),
          platform: "system",
          isBotResponse: true,
        };

        if (this.config.welcomeSound) {
          soundEffects.play("chime");
        }
      }
    }

    // 2. Process Command (!kick, !specs, etc.)
    const trimmed = rawMsg.text.trim();
    if (this.config.commandsEnabled && trimmed.startsWith("!")) {
      const parts = trimmed.split(" ");
      const cmdTrigger = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ").trim();

      // Find matching command
      const foundCmd = this.config.commands.find(
        (c) =>
          c.enabled &&
          (c.command.toLowerCase() === cmdTrigger ||
            c.aliases?.some((a) => a.toLowerCase() === cmdTrigger))
      );

      if (foundCmd) {
        enrichedMessage.commandTriggered = foundCmd.command;
        let responseText = foundCmd.response;

        if (foundCmd.response === "COMMANDS_LIST_DYNAMIC") {
          const list = this.config.commands
            .filter((c) => c.enabled)
            .map((c) => c.command)
            .join("  •  ");
          responseText = `Active commands: ${list}`;
        } else if (foundCmd.response === "STREAM_UPTIME_DYNAMIC") {
          responseText = `🔥 Stream has been live for ${this.getUptimeString()}!`;
        } else if (foundCmd.response === "SHOUTOUT_DYNAMIC") {
          const target = arg ? arg.replace(/^@/, "") : "our awesome friend";
          responseText = `🌟 Huge shoutout to @${target}! Go check out their stream & show some love!`;
          shoutout = {
            id: `so-${Date.now()}`,
            targetUser: target,
            shoutedBy: rawMsg.author,
            message: `Check out @${target}! Recommended by @${rawMsg.author}`,
            timestamp: Date.now(),
          };
        }

        botReply = {
          id: `bot-cmd-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          author: this.config.botName,
          role: "MOD",
          text: responseText,
          timestamp: Date.now(),
          platform: "system",
          isBotResponse: true,
          commandTriggered: foundCmd.command,
        };
      }
    }

    return { enrichedMessage, botReply, shoutout };
  }

  /**
   * Dispatches automated events to streamBus if this instance is leader
   */
  public handleAndBroadcast(rawMsg: ChatMessage) {
    const { enrichedMessage, botReply, shoutout } = this.processIncomingMessage(rawMsg);

    // If there is a shoutout, emit shoutout event for OBS overlay
    if (shoutout) {
      streamBus.emit("SHOUTOUT_EVENT", shoutout);
    }

    // Bot reply dispatch (only if leader tab to prevent duplication across multiple windows)
    if (botReply && this.isLeader()) {
      setTimeout(() => {
        streamBus.emit("NEW_CHAT_MESSAGE", botReply);
      }, 450);
    }

    return enrichedMessage;
  }
}

export const chatAutomationEngine = new ChatAutomationEngine();
