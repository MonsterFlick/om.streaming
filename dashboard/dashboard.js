/**
 * uncompiled.om Streamer Control Deck Logic
 * Interacts with OBS browser overlays via window.streamBus (BroadcastChannel & localStorage).
 */

let currentSponsors = [];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
  await loadSponsorConfig();
  renderSponsorTriggers();
  setupEventListeners();
});

async function loadSponsorConfig() {
  try {
    const res = await fetch('../config/stream-config.json');
    const data = await res.json();
    currentSponsors = data.sponsors || [];
    if (data.stream && data.stream.title) {
      const topicInput = document.getElementById('input-topic');
      if (topicInput) topicInput.value = data.stream.title;
    }
  } catch (e) {
    console.warn('Could not load config via fetch, using fallback', e);
    currentSponsors = [
      { id: "sponsor-1", brand: "NOTHING", code: "UNCOMPILED", discount: "15% OFF" },
      { id: "sponsor-2", brand: "KEYCHRON", code: "OMSTREAM", discount: "$20 OFF" },
      { id: "sponsor-3", brand: "MOFT", code: "UNCOMPILED10", discount: "10% OFF" },
      { id: "sponsor-4", brand: "MODERN CREATIVE", code: "UNCOMPILED25", discount: "FREE SHIPPING" }
    ];
  }
}

function renderSponsorTriggers() {
  const container = document.getElementById('sponsor-triggers-container');
  if (!container) return;

  container.innerHTML = currentSponsors.map(sponsor => `
    <div class="sponsor-trigger-item" onclick="triggerSpecificSponsor('${sponsor.id}')">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="brand">${sponsor.brand}</span>
        <span class="code-pill">${sponsor.code}</span>
      </div>
      <div style="font-size: 11px; color: var(--text-muted);">${sponsor.discount || 'Active Collab'}</div>
      <div style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-amber); margin-top: 4px;">CLICK TO BROADCAST →</div>
    </div>
  `).join('');
}

function triggerSpecificSponsor(sponsorId) {
  window.streamBus.emit('TRIGGER_SPONSOR', { sponsorId });
  showToast(`Broadcasted Sponsor: ${sponsorId}`);
}

function triggerNextSponsor() {
  window.streamBus.emit('TRIGGER_SPONSOR');
  showToast('Rotated to Next Sponsor');
}

function setupEventListeners() {
  // Test Alerts
  document.getElementById('btn-test-follow')?.addEventListener('click', () => {
    const names = ['marcus_dev', 'clara_motion', 'tech_nomad', 'alexa_k'];
    const randomUser = names[Math.floor(Math.random() * names.length)];
    window.streamBus.emit('TRIGGER_ALERT', {
      type: 'FOLLOWER',
      user: randomUser
    });
    showToast(`Fired Follower Alert: ${randomUser}`);
  });

  document.getElementById('btn-test-sub')?.addEventListener('click', () => {
    const subName = document.getElementById('input-alert-sub-name')?.value || 'alex_prime';
    const subTier = document.getElementById('select-alert-sub-tier')?.value || 'TIER 1';
    window.streamBus.emit('TRIGGER_ALERT', {
      type: 'SUB',
      user: subName,
      amount: subTier
    });
    showToast(`Fired Sub Alert: ${subName} (${subTier})`);
  });

  document.getElementById('btn-test-donation')?.addEventListener('click', () => {
    const donor = document.getElementById('input-donor-name')?.value || 'elena.eth';
    const amt = document.getElementById('input-donor-amount')?.value || '$25.00';
    const msg = document.getElementById('input-donor-msg')?.value || 'Love the stream setup! Keep cooking!';
    window.streamBus.emit('TRIGGER_ALERT', {
      type: 'DONATION',
      user: donor,
      amount: amt,
      message: msg
    });
    showToast(`Fired Donation Alert: ${donor} (${amt})`);
  });

  document.getElementById('btn-test-raid')?.addEventListener('click', () => {
    window.streamBus.emit('TRIGGER_ALERT', {
      type: 'RAID',
      user: 'neon_valkyrie',
      amount: '420 RAIDERS'
    });
    showToast('Fired Raid Alert: neon_valkyrie');
  });

  // Topic Update
  document.getElementById('btn-update-topic')?.addEventListener('click', () => {
    const topic = document.getElementById('input-topic')?.value;
    if (topic) {
      window.streamBus.emit('UPDATE_TOPIC', { topic });
      showToast('Stream Topic Updated on Overlays');
    }
  });

  // Goal Update
  document.getElementById('btn-update-goal')?.addEventListener('click', () => {
    const cur = parseInt(document.getElementById('input-goal-cur')?.value || '850', 10);
    const tar = parseInt(document.getElementById('input-goal-tar')?.value || '1000', 10);
    window.streamBus.emit('UPDATE_GOAL', { current: cur, target: tar });
    showToast(`Community Goal Updated: ${cur}/${tar}`);
  });

  // Chat message send
  document.getElementById('btn-send-chat')?.addEventListener('click', () => {
    const author = document.getElementById('input-chat-author')?.value || 'uncompiled.om';
    const text = document.getElementById('input-chat-text')?.value;
    const role = document.getElementById('select-chat-role')?.value || 'MOD';
    if (text) {
      window.streamBus.emit('NEW_CHAT_MESSAGE', { author, text, role, isHighlighted: role === 'MOD' });
      document.getElementById('input-chat-text').value = '';
      showToast(`Sent Chat as ${author}`);
    }
  });

  // Set Countdown Timer
  document.getElementById('btn-set-timer')?.addEventListener('click', () => {
    const seconds = parseInt(document.getElementById('input-timer-seconds')?.value || '300', 10);
    window.streamBus.emit('SET_TIMER', { seconds });
    showToast(`Countdown Timer set to ${seconds}s`);
  });

  // Connect Twitch Live Chat
  document.getElementById('btn-connect-twitch')?.addEventListener('click', () => {
    const channel = document.getElementById('input-twitch-channel')?.value.trim();
    if (channel) {
      window.streamBus.emit('CONNECT_TWITCH', { channel });
      showToast(`Connected overlays to Twitch: #${channel}`);
    }
  });
}

function copyObsUrl(relativePath) {
  // Compute absolute file URI or local http URI
  const path = window.location.href.replace('/dashboard/index.html', '') + '/' + relativePath;
  navigator.clipboard.writeText(path).then(() => {
    showToast(`Copied to Clipboard: ${relativePath}`);
  });
}

function showToast(msg) {
  let toast = document.getElementById('dash-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dash-toast';
    toast.className = 'dash-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
