import { ChatMessage, ChatRole } from "./types";

export class TwitchIRCClient {
  private ws: WebSocket | null = null;
  private channel: string = "";
  private onMessageCallback: ((msg: ChatMessage) => void) | null = null;
  private isConnected: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(onMessage: (msg: ChatMessage) => void) {
    this.onMessageCallback = onMessage;
  }

  public connect(channel: string) {
    if (!channel) return;
    this.channel = channel.toLowerCase().replace(/^#/, "").trim();
    this.disconnect();

    const wsUrl = "wss://irc-ws.chat.twitch.tv:443";
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        const nick = `justinfan${Math.floor(10000 + Math.random() * 89999)}`;
        this.ws?.send("CAP REQ :twitch.tv/tags twitch.tv/commands\r\n");
        this.ws?.send(`PASS SCHMOOPIIE\r\n`);
        this.ws?.send(`NICK ${nick}\r\n`);
        this.ws?.send(`JOIN #${this.channel}\r\n`);
      };

      this.ws.onmessage = (event) => {
        const raw = event.data as string;
        if (raw.startsWith("PING")) {
          this.ws?.send("PONG :tmi.twitch.tv\r\n");
          return;
        }

        const lines = raw.split("\r\n");
        for (const line of lines) {
          if (!line) continue;
          this.parseLine(line);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
      };

      this.ws.onerror = (err) => {
        console.warn("[TwitchIRC] WebSocket error:", err);
      };
    } catch (e) {
      console.error("[TwitchIRC] Failed to connect:", e);
    }
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  public getStatus() {
    return { isConnected: this.isConnected, channel: this.channel };
  }

  private parseLine(line: string) {
    if (!line.includes("PRIVMSG")) return;

    try {
      let tags = "";
      let remainder = line;

      if (line.startsWith("@")) {
        const spaceIdx = line.indexOf(" ");
        tags = line.substring(1, spaceIdx);
        remainder = line.substring(spaceIdx + 1);
      }

      // Extract sender and message
      const privmsgMatch = remainder.match(/:([^!]+)![^@]+@[^.]+\.tmi\.twitch\.tv PRIVMSG #[^ ]+ :(.+)/);
      if (!privmsgMatch) return;

      const username = privmsgMatch[1];
      const messageText = privmsgMatch[2];

      let role: ChatRole = "VIEWER";
      let displayName = username;

      // Parse tags
      if (tags) {
        const tagMap: Record<string, string> = {};
        tags.split(";").forEach((pair) => {
          const [k, v] = pair.split("=");
          tagMap[k] = v;
        });

        if (tagMap["display-name"]) displayName = tagMap["display-name"];

        const badges = tagMap["badges"] || "";
        if (badges.includes("broadcaster")) role = "STREAMER";
        else if (badges.includes("moderator")) role = "MOD";
        else if (badges.includes("vip")) role = "VIP";
        else if (badges.includes("subscriber")) role = "SUB";
      }

      const chatMsg: ChatMessage = {
        id: `tw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        author: displayName,
        role,
        text: messageText,
        timestamp: Date.now(),
        platform: "twitch",
      };

      if (this.onMessageCallback) {
        this.onMessageCallback(chatMsg);
      }
    } catch (e) {
      console.warn("[TwitchIRC] Error parsing line:", e);
    }
  }
}
