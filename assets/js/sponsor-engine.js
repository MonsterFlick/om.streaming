/**
 * Editorial Brand & Sponsor Showcase Engine for uncompiled.om.
 * Handles automated timed rotation, manual hotkey triggers,
 * Web Audio synthetic luxury chime, and progress countdown.
 */
class SponsorEngine {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('sponsor-mount');
    this.configUrl = options.configUrl || '../config/stream-config.json';
    this.sponsors = [];
    this.currentIndex = 0;
    this.intervalId = null;
    this.activeTimeout = null;
    this.progressInterval = null;
    this.rotationSeconds = options.rotationSeconds || 180;
    this.displayDurationSeconds = options.displayDurationSeconds || 18;
    this.audioEnabled = options.audioEnabled !== false;

    this.init();
  }

  async init() {
    try {
      const response = await fetch(this.configUrl);
      const data = await response.json();
      this.sponsors = data.sponsors || [];
      if (data.timing) {
        this.rotationSeconds = data.timing.sponsorRotationSeconds || this.rotationSeconds;
        this.displayDurationSeconds = data.timing.sponsorDisplayDurationSeconds || this.displayDurationSeconds;
      }
    } catch (e) {
      console.warn('[SponsorEngine] Could not load config via fetch, using fallback data', e);
      this.sponsors = this._getFallbackSponsors();
    }

    // Listen to global stream bus triggers
    if (window.streamBus) {
      window.streamBus.on('TRIGGER_SPONSOR', (payload) => {
        if (payload && payload.sponsorId) {
          const found = this.sponsors.findIndex(s => s.id === payload.sponsorId);
          if (found !== -1) {
            this.showSponsor(found);
            return;
          }
        }
        this.showNext();
      });

      window.streamBus.on('UPDATE_SPONSORS', (payload) => {
        if (payload && payload.sponsors) {
          this.sponsors = payload.sponsors;
        }
      });
    }

    // Start auto cycle
    this.startAutoRotation();
  }

  startAutoRotation() {
    if (this.intervalId) clearInterval(this.intervalId);
    
    // First trigger after 15 seconds of stream boot
    setTimeout(() => {
      this.showNext();
    }, 12000);

    this.intervalId = setInterval(() => {
      this.showNext();
    }, this.rotationSeconds * 1000);
  }

  showNext() {
    if (!this.sponsors || this.sponsors.length === 0) return;
    this.showSponsor(this.currentIndex);
    this.currentIndex = (this.currentIndex + 1) % this.sponsors.length;
  }

  showSponsor(index) {
    if (!this.container || !this.sponsors[index]) return;
    const sponsor = this.sponsors[index];

    // Clear existing timers
    if (this.activeTimeout) clearTimeout(this.activeTimeout);
    if (this.progressInterval) clearInterval(this.progressInterval);

    // Play subtle high-end broadcast chime
    if (this.audioEnabled) {
      this.playBroadcastChime();
    }

    // Render Editorial Card
    this.container.innerHTML = `
      <div class="sponsor-card" id="active-sponsor-card" style="opacity: 0; transform: translateY(20px);">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="badge-pill" style="padding: 3px 10px; font-size: 10px; border-color: rgba(255,255,255,0.2);">
              <span class="dot amber"></span>
              ${sponsor.badge || 'BRAND COLLABORATION'}
            </span>
            <span class="collab-tag" style="color: ${sponsor.accentColor || '#ffffff'};">
              [ 0${index + 1} // 0${this.sponsors.length} ]
            </span>
          </div>
          <div class="brand-name" style="margin-top: 4px;">${sponsor.brand}</div>
          <div class="headline">${sponsor.headline || sponsor.subtitle}</div>
        </div>

        <div class="promo-pill">
          <div style="font-size: 9px; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 0.12em;">USE PROMO CODE</div>
          <div class="promo-code">${sponsor.code}</div>
          <div class="discount-text">${sponsor.discount}</div>
        </div>

        <div class="time-progress-bar" id="sponsor-timer-bar"></div>
      </div>
    `;

    const card = document.getElementById('active-sponsor-card');
    const timerBar = document.getElementById('sponsor-timer-bar');

    // Slide in
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      
      // Animate progress bar
      if (timerBar) {
        timerBar.style.transition = `width ${this.displayDurationSeconds}s linear`;
        requestAnimationFrame(() => {
          timerBar.style.width = '100%';
        });
      }
    });

    // Dismiss after duration
    this.activeTimeout = setTimeout(() => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          if (this.container.contains(card)) {
            this.container.innerHTML = '';
          }
        }, 600);
      }
    }, this.displayDurationSeconds * 1000);
  }

  // Synthesizes a luxury studio glass chime (no external MP3 required)
  playBroadcastChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq, delay, duration, gainVal) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(gainVal, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + duration);
        }, delay);
      };

      // Subtle editorial 3-tone chime (F#5 -> A#5 -> C#6)
      playTone(739.99, 0, 0.8, 0.08);
      playTone(932.33, 140, 0.9, 0.07);
      playTone(1108.73, 280, 1.2, 0.06);
    } catch (e) {
      // Audio autoplay policy might be restricted before interaction
    }
  }

  _getFallbackSponsors() {
    return [
      {
        "id": "sponsor-1",
        "brand": "NOTHING",
        "badge": "AUDIO PARTNER",
        "headline": "Pure Sound. Transparent Design.",
        "code": "UNCOMPILED",
        "discount": "15% OFF",
        "accentColor": "#ffffff"
      },
      {
        "id": "sponsor-2",
        "brand": "KEYCHRON",
        "badge": "STUDIO HARDWARE",
        "headline": "Crafted For Ultimate Precision.",
        "code": "OMSTREAM",
        "discount": "$20 OFF",
        "accentColor": "#ff6b4a"
      }
    ];
  }
}

window.SponsorEngine = SponsorEngine;
