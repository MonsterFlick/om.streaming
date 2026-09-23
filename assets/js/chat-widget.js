/**
 * Studio Chat Widget for uncompiled.om.
 * Renders smooth flowing stream chat with modern typography,
 * role badges (VIP, MOD, SUB), auto-scroll, and optional auto-fade.
 */
class ChatWidget {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('chat-mount');
    this.maxMessages = options.maxMessages || 20;
    this.autoFade = options.autoFade || false;
    this.fadeDelay = options.fadeDelay || 12000;
    this.twitchChannel = options.twitchChannel || null;
    this.messages = [];
    this.twitchSocket = null;

    this.init();
  }

  async init() {
    if (!this.container) return;
    this.container.classList.add('chat-stream-box');

    // Attempt to read channel name from stream-config.json if not provided
    if (!this.twitchChannel) {
      try {
        const res = await fetch('../config/stream-config.json');
        const cfg = await res.json();
        if (cfg.integrations && cfg.integrations.twitchChannel) {
          this.twitchChannel = cfg.integrations.twitchChannel;
        }
      } catch (e) {
        // file protocol fallback
      }
    }

    // Listen to global stream bus for messages
    if (window.streamBus) {
      window.streamBus.on('NEW_CHAT_MESSAGE', (payload) => {
        this.addMessage(payload);
      });

      window.streamBus.on('CLEAR_CHAT', () => {
        this.clear();
      });

      window.streamBus.on('CONNECT_TWITCH', (payload) => {
        if (payload && payload.channel) {
          this.connectTwitch(payload.channel);
        }
      });
    }

    // Connect to Twitch IRC if configured
    if (this.twitchChannel) {
      this.connectTwitch(this.twitchChannel);
    }

    // Populate a few realistic demo messages initially if none exist
    if (this.messages.length === 0) {
      this._seedInitialChat();
    }
  }

  /**
   * Connects directly to Twitch Chat via anonymous WebSocket IRC.
   * Zero API keys or tokens required. Works for any public channel.
   */
  connectTwitch(channel) {
    const cleanChannel = channel.toLowerCase().replace('#', '').trim();
    if (!cleanChannel) return;

    if (this.twitchSocket) {
      try { this.twitchSocket.close(); } catch(e) {}
    }

    console.log(`[ChatWidget] Connecting to Twitch Chat: #${cleanChannel}...`);
    try {
      this.twitchSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

      this.twitchSocket.onopen = () => {
        console.log('[ChatWidget] Connected to Twitch IRC WebSocket.');
        this.twitchSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        this.twitchSocket.send('PASS SCHMOOPIE');
        this.twitchSocket.send(`NICK justinfan${Math.floor(10000 + Math.random() * 90000)}`);
        this.twitchSocket.send(`JOIN #${cleanChannel}`);
      };

      this.twitchSocket.onmessage = (event) => {
        const raw = event.data;
        if (raw.startsWith('PING')) {
          this.twitchSocket.send('PONG :tmi.twitch.tv');
          return;
        }

        if (raw.includes('PRIVMSG')) {
          const parsed = this._parseIrcMessage(raw);
          if (parsed) {
            this.addMessage(parsed);
          }
        }
      };

      this.twitchSocket.onclose = () => {
        console.warn('[ChatWidget] Twitch socket closed. Reconnecting in 5s...');
        setTimeout(() => this.connectTwitch(cleanChannel), 5000);
      };

      this.twitchSocket.onerror = (err) => {
        console.error('[ChatWidget] Twitch WebSocket error', err);
      };
    } catch (e) {
      console.error('[ChatWidget] Failed to initialize Twitch WebSocket', e);
    }
  }

  _parseIrcMessage(raw) {
    try {
      // Tags prefix @badge-info=... :user!user@user.tmi.twitch.tv PRIVMSG #channel :message
      let tags = {};
      let remaining = raw;
      if (raw.startsWith('@')) {
        const spaceIdx = raw.indexOf(' ');
        const tagStr = raw.substring(1, spaceIdx);
        remaining = raw.substring(spaceIdx + 1);
        tagStr.split(';').forEach(pair => {
          const [k, v] = pair.split('=');
          tags[k] = v;
        });
      }

      const match = remaining.match(/:([^!]+)![^ ]+ PRIVMSG #[^ ]+ :(.+)/);
      if (!match) return null;

      const author = tags['display-name'] || match[1];
      const text = match[2].trim();

      // Determine role badge
      let role = 'VIEWER';
      const badges = tags['badges'] || '';
      if (badges.includes('broadcaster') || badges.includes('moderator')) {
        role = 'MOD';
      } else if (badges.includes('vip')) {
        role = 'VIP';
      } else if (badges.includes('subscriber')) {
        role = 'SUB';
      }

      return {
        author,
        text,
        role,
        isHighlighted: role === 'MOD' || !!tags['msg-id']
      };
    } catch (e) {
      return null;
    }
  }

  addMessage({ author, text, role = 'VIEWER', isHighlighted = false }) {
    if (!this.container) return;

    const msgEl = document.createElement('div');
    msgEl.className = `chat-message ${isHighlighted ? 'highlight' : ''}`;

    let badgeText = '';
    if (role === 'MOD') badgeText = '<span class="chat-badge" style="background:#10b981; color:#fff;">MOD</span>';
    else if (role === 'VIP') badgeText = '<span class="chat-badge" style="background:#f59e0b; color:#fff;">VIP</span>';
    else if (role === 'SUB') badgeText = '<span class="chat-badge" style="background:#6366f1; color:#fff;">SUB</span>';

    msgEl.innerHTML = `
      <div class="chat-author-line">
        ${badgeText}
        <span class="chat-author">${author}</span>
        <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); margin-left: auto;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="chat-text">${this._escapeHTML(text)}</div>
    `;

    this.container.appendChild(msgEl);
    this.messages.push(msgEl);

    // Limit maximum messages on screen
    if (this.messages.length > this.maxMessages) {
      const oldest = this.messages.shift();
      if (this.container.contains(oldest)) {
        this.container.removeChild(oldest);
      }
    }

    // Scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;

    // Optional auto fade
    if (this.autoFade) {
      setTimeout(() => {
        msgEl.style.opacity = '0';
        msgEl.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (this.container.contains(msgEl)) {
            this.container.removeChild(msgEl);
            this.messages = this.messages.filter(m => m !== msgEl);
          }
        }, 500);
      }, this.fadeDelay);
    }
  }

  clear() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.messages = [];
  }

  _escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }

  _seedInitialChat() {
    const demo = [
      { author: 'marcus_v', text: 'audio levels sounding crisp tonight om!', role: 'SUB' },
      { author: 'clara_design', text: 'love this overlay aesthetic, so clean', role: 'VIP' },
      { author: 'kyle_tech', text: 'what monitor you running for the gaming feed?', role: 'VIEWER' }
    ];

    demo.forEach((d, idx) => {
      setTimeout(() => {
        this.addMessage(d);
      }, idx * 1200);
    });
  }
}

window.ChatWidget = ChatWidget;
