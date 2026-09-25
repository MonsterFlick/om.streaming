import { ChatMessage, ChatRole } from "./types";

export class KickWebSocketClient {
  private ws: WebSocket | null = null;
  private channelSlug: string = "";
  private chatroomId: number | null = null;
  private onMessageCallback: ((msg: ChatMessage) => void) | null = null;
  private isConnected: boolean = false;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(onMessage: (msg: ChatMessage) => void) {
    this.onMessageCallback = onMessage;
  }

  public async connect(channelSlug: string) {
    if (!channelSlug) return;
    this.channelSlug = channelSlug.toLowerCase().trim().replace(/^@/, "");
    this.disconnect();

    try {
      // 1. Fetch Chatroom ID for Kick Channel
      const chatroomId = await this.fetchKickChatroomId(this.channelSlug);
      if (!chatroomId) {
        console.warn(`[KickClient] Could not resolve chatroom ID for Kick channel: ${this.channelSlug}`);
        return;
      }

      this.chatroomId = chatroomId;

      // 2. Connect to Official Kick Pusher WebSocket
      const pusherKey = "eb1d5f28b05140d36377"; // Kick universal Pusher App Key
      const wsUrl = `wss://ws-us2.pusher.com/app/${pusherKey}?protocol=7&client=js&version=8.4.0-rc2&flash=false`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        // Subscribe to Kick Chatroom Channel
        const subscribeMsg = JSON.stringify({
          event: "pusher:subscribe",
          data: {
            auth: "",
            channel: `chatrooms.${this.chatroomId}.v2`,
          },
        });
        this.ws?.send(subscribeMsg);

        // Keep-alive ping every 30 seconds
        this.pingInterval = setInterval(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ event: "pusher:ping", data: {} }));
          }
        }, 30000);
      };

      this.ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (raw.event === "App\\Events\\ChatMessageEvent") {
            const data = JSON.parse(raw.data);
            this.handleChatMessage(data);
          }
        } catch (e) {
          // Ignore non-JSON ping/pong
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        if (this.pingInterval) clearInterval(this.pingInterval);
      };

      this.ws.onerror = (err) => {
        console.warn("[KickClient] WebSocket error:", err);
      };
    } catch (e) {
      console.error("[KickClient] Failed to connect to Kick:", e);
    }
  }

  public disconnect() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  public getStatus() {
    return { isConnected: this.isConnected, channelSlug: this.channelSlug, chatroomId: this.chatroomId };
  }

  private async fetchKickChatroomId(slug: string): Promise<number | null> {
    try {
      // Fetch public Kick channel JSON metadata
      const res = await fetch(`https://kick.com/api/v2/channels/${slug}`);
      if (!res.ok) {
        // Fallback endpoint
        const res1 = await fetch(`https://kick.com/api/v1/channels/${slug}`);
        if (!res1.ok) return null;
        const data1 = await res1.json();
        return data1.chatroom?.id || data1.id || null;
      }
      const data = await res.json();
      return data.chatroom?.id || data.id || null;
    } catch (e) {
      console.warn(`[KickClient] Error fetching channel ID for ${slug}:`, e);
      return null;
    }
  }

  private handleChatMessage(data: any) {
    if (!data || !data.content) return;

    const sender = data.sender || {};
    const username = sender.username || "KickUser";
    const identity = sender.identity || {};
    const badges = identity.badges || [];

    let role: ChatRole = "VIEWER";
    const badgeTypes = badges.map((b: any) => b.type);

    if (badgeTypes.includes("broadcaster")) role = "STREAMER";
    else if (badgeTypes.includes("moderator")) role = "MOD";
    else if (badgeTypes.includes("subscriber") || badgeTypes.includes("sub")) role = "SUB";
    else if (badgeTypes.includes("vip")) role = "VIP";

    const chatMsg: ChatMessage = {
      id: `kick-${data.id || Date.now()}`,
      author: username,
      role,
      text: data.content,
      timestamp: Date.now(),
      platform: "kick",
    };

    if (this.onMessageCallback) {
      this.onMessageCallback(chatMsg);
    }
  }
}
