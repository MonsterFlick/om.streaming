/**
 * Broadcast Event Bus for uncompiled.om stream overlays & dashboard.
 * Utilizes BroadcastChannel API with localStorage fallback for ultra-low latency
 * cross-window / cross-OBS-browser-source synchronization.
 */
class StreamEventBus {
  constructor(channelName = 'uncompiled_stream_channel') {
    this.channelName = channelName;
    this.listeners = new Map();

    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(this.channelName);
      this.channel.onmessage = (event) => {
        this._dispatch(event.data);
      };
    }

    // Storage fallback for broader CEF/browser compatibility
    window.addEventListener('storage', (event) => {
      if (event.key === `bus_${this.channelName}` && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          this._dispatch(data);
        } catch (e) {
          console.error('[StreamEventBus] Failed to parse storage message', e);
        }
      }
    });

    // Optional SSE connection for external server webhooks
    this._initSSE();
  }

  _initSSE() {
    if (window.location.protocol.startsWith('http') && 'EventSource' in window) {
      try {
        const sse = new EventSource('/api/events');
        sse.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.type) {
              this._dispatch(data);
            }
          } catch (e) {}
        };
      } catch (e) {
        // SSE not available
      }
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType, callback) {
    if (!this.listeners.has(eventType)) return;
    const filtered = this.listeners.get(eventType).filter((cb) => cb !== callback);
    this.listeners.set(eventType, filtered);
  }

  emit(eventType, payload = {}) {
    const message = {
      type: eventType,
      payload,
      timestamp: Date.now()
    };

    if (this.channel) {
      this.channel.postMessage(message);
    }

    // Also write to localStorage for fallback
    try {
      localStorage.setItem(`bus_${this.channelName}`, JSON.stringify(message));
    } catch (e) {
      // Ignore quota/private mode errors
    }

    // Dispatch locally in the same context
    this._dispatch(message);
  }

  _dispatch(message) {
    if (!message || !message.type) return;
    const handlers = this.listeners.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.payload, message.timestamp));
    }

    // Wildcard listeners
    const allHandlers = this.listeners.get('*');
    if (allHandlers) {
      allHandlers.forEach((handler) => handler(message.type, message.payload, message.timestamp));
    }
  }
}

// Global singleton instance
window.streamBus = new StreamEventBus();
