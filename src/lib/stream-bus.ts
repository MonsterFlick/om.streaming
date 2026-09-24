import { INITIAL_STREAM_STATE } from "@/config/stream-config";
import { StreamState } from "./types";

type EventHandler<T = unknown> = (payload: T, timestamp: number) => void;

class StreamEventBus {
  private channelName: string;
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, EventHandler<unknown>[]> = new Map();
  private state: StreamState = INITIAL_STREAM_STATE;
  private sse: EventSource | null = null;

  constructor(channelName: string = "uncompiled_stream_hub_v2") {
    this.channelName = channelName;

    if (typeof window !== "undefined") {
      // 1. Initialize BroadcastChannel
      if ("BroadcastChannel" in window) {
        try {
          this.channel = new BroadcastChannel(this.channelName);
          this.channel.onmessage = (event) => {
            this._handleIncoming(event.data);
          };
        } catch (e) {
          console.warn("[StreamBus] BroadcastChannel not available, using fallback", e);
        }
      }

      // 2. Storage fallback for OBS CEF / older renderers
      window.addEventListener("storage", (event) => {
        if (event.key === `bus_${this.channelName}` && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            this._handleIncoming(data);
          } catch (e) {
            console.error("[StreamBus] Failed to parse storage event", e);
          }
        }
      });

      // 3. Hydrate state from localStorage if available
      try {
        const saved = localStorage.getItem(`state_${this.channelName}`);
        if (saved) {
          this.state = { ...INITIAL_STREAM_STATE, ...JSON.parse(saved) };
        }
      } catch (e) {}

      // 4. Connect to SSE bridge if running under http
      this._initSSE();
    }
  }

  private _initSSE() {
    if (typeof window === "undefined") return;
    if (window.location.protocol.startsWith("http") && "EventSource" in window) {
      try {
        this.sse = new EventSource("/api/events");
        this.sse.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.type) {
              this._handleIncoming(data);
            }
          } catch (e) {}
        };
      } catch (e) {
        // SSE optional
      }
    }
  }

  public getState(): StreamState {
    return this.state;
  }

  public updateState(partial: Partial<StreamState>) {
    this.state = { ...this.state, ...partial };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`state_${this.channelName}`, JSON.stringify(this.state));
      } catch (e) {}
    }
    this.emit("STATE_UPDATED", this.state);
  }

  public emit(eventType: string, payload: unknown = {}) {
    const message = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {}
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`bus_${this.channelName}`, JSON.stringify(message));
      } catch (e) {}
    }

    // Process locally in current tab
    this._handleIncoming(message);
  }

  public on<T = unknown>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(handler as EventHandler<unknown>);

    return () => this.off(eventType, handler);
  }

  public off<T = unknown>(eventType: string, handler: EventHandler<T>) {
    if (!this.listeners.has(eventType)) return;
    const list = this.listeners.get(eventType)!;
    this.listeners.set(
      eventType,
      list.filter((h) => h !== handler)
    );
  }

  private _handleIncoming(message: { type: string; payload: unknown; timestamp?: number }) {
    if (!message || !message.type) return;

    if (message.type === "STATE_UPDATED" && message.payload) {
      this.state = message.payload as StreamState;
    }

    const ts = message.timestamp || Date.now();
    const handlers = this.listeners.get(message.type);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(message.payload, ts);
        } catch (err) {
          console.error(`[StreamBus] Error in handler for ${message.type}:`, err);
        }
      });
    }

    const wildcards = this.listeners.get("*");
    if (wildcards) {
      wildcards.forEach((h) => {
        try {
          h({ type: message.type, payload: message.payload }, ts);
        } catch (err) {}
      });
    }
  }
}

// Global browser singleton
export const streamBus = new StreamEventBus();
