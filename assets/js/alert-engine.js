/**
 * Editorial Studio Alert Engine for uncompiled.om.
 * Handles Follower, Subscriber, Donation, and Raid alerts with queueing,
 * spring micro-animations, and clean typographic presentation.
 */
class AlertEngine {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('alert-mount');
    this.queue = [];
    this.isDisplaying = false;
    this.duration = options.duration || 5500;
    this.audioEnabled = options.audioEnabled !== false;

    this.init();
  }

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'editorial-alert-container';
      document.body.appendChild(this.container);
    }

    if (window.streamBus) {
      window.streamBus.on('TRIGGER_ALERT', (payload) => {
        this.enqueue(payload);
      });
    }
  }

  enqueue(alertData) {
    this.queue.push(alertData);
    if (!this.isDisplaying) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length === 0) {
      this.isDisplaying = false;
      return;
    }

    this.isDisplaying = true;
    const alert = this.queue.shift();
    this.showAlert(alert);
  }

  showAlert(data) {
    const type = (data.type || 'FOLLOWER').toUpperCase();
    const user = data.user || 'ANONYMOUS SUPPORTER';
    const amount = data.amount || '';
    const message = data.message || '';

    let kicker = 'COMMUNITY // NEW FOLLOWER';
    let badgeClass = 'amber';
    if (type === 'SUB' || type === 'SUBSCRIBER') {
      kicker = 'SUBSCRIPTION // VIP MEMBER';
      badgeClass = 'live';
    } else if (type === 'DONATION' || type === 'TIP') {
      kicker = 'DIRECT SUPPORT // DONATION';
      badgeClass = 'amber';
    } else if (type === 'RAID') {
      kicker = 'INCOMING RAID // WELCOME';
      badgeClass = 'live';
    }

    if (this.audioEnabled) {
      this.playAlertTone();
    }

    this.container.innerHTML = `
      <div class="editorial-alert" id="active-alert-box">
        <span class="badge-pill" style="border-color: rgba(255,255,255,0.25);">
          <span class="dot ${badgeClass}"></span>
          ${type}
        </span>
        <div style="display: flex; flex-direction: column;">
          <span class="alert-kicker">${kicker}</span>
          <span class="alert-user">${user}</span>
          ${message ? `<span style="font-size: 13px; color: var(--text-secondary); margin-top: 3px;">"${message}"</span>` : ''}
        </div>
        ${amount ? `<div class="alert-amount">${amount}</div>` : ''}
      </div>
    `;

    const alertBox = document.getElementById('active-alert-box');
    requestAnimationFrame(() => {
      alertBox.classList.add('show');
    });

    setTimeout(() => {
      alertBox.classList.remove('show');
      setTimeout(() => {
        this.container.innerHTML = '';
        this.processQueue();
      }, 600);
    }, this.duration);
  }

  playAlertTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Audio autoplay policy
    }
  }
}

window.AlertEngine = AlertEngine;
