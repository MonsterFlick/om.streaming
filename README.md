# `uncompiled.om` — Live Streaming Production Suite & Automations

Welcome to the official streaming and broadcast production setup for **`uncompiled.om`**. 
This suite moves away from dated gamer/hacker tropes and gives you an **Editorial Broadcast & Studio Design** aesthetic (inspired by high-end design houses, A24, and Boiler Room) with kinetic typography, smoked acrylic glassmorphism, responsive spring animations, automated sponsor showcases, and a real-time Streamer Control Deck.

---

## 1. Curated Tools & Plugins Matrix

### Primary Streaming Software & Plugins
| Software / Plugin | Download & Setup | Why It's Essential For Your Stream |
| :--- | :--- | :--- |
| **OBS Studio (v30+)** | [obsproject.com](https://obsproject.com/) | Industry-standard open-source broadcaster. Stable 60fps NVENC encoder. |
| **OBS-WebSocket** | Built-in (OBS 28+) | Allows local automations, Streamer.bot, and hotkey controllers to switch scenes and mute mics automatically. |
| **Aitum Vertical** | [aitum.tv/vertical](https://aitum.tv/vertical) | Simultaneously stream to YouTube/Twitch (16:9) and TikTok/Shorts (9:16) with zero duplicate effort. |
| **Source Record** | OBS Forums Plugin | Records clean gameplay & webcam VODs without overlays for high-res YouTube video editing. |
| **Advanced Scene Switcher**| OBS Forums Plugin | Automates scene changes: auto-switches to "In-Game" when your game launches, and "Talk/Chatting" when on desktop. |
| **Streamer.bot** | [streamer.bot](https://streamer.bot/) | Powerful, lightweight event-driven automation for Twitch/YouTube channel points, soundboard, and hotkey macros. |

### Professional Audio Separation & Enhancement
| Tool | What It Does |
| :--- | :--- |
| **SteelSeries Sonar** *(or Elgato Wave Link)* | Free virtual mixer. Splits audio into **Game**, **Chat (Discord)**, **Media (Spotify/YouTube)**, and **Mic**. This ensures Spotify music never gets DMCA striked on VODs. |
| **Reaper ReaPlugs VST (ReaFIR & ReaComp)** | Broadcast-grade microphone EQ and compression for radio-quality voice. |
| **NVIDIA Broadcast / RNNoise** | AI noise suppression that removes keyboard clicks and fan hum without muddying your voice. |

---

## 2. Directory Structure

```
d:\Progency\om.streaming\
├── assets/
│   ├── css/
│   │   └── editorial-design.css   # Studio typography (Syne, Plus Jakarta Sans), smoked acrylic & animations
│   └── js/
│       ├── channel-bus.js         # Realtime cross-source BroadcastChannel event sync
│       ├── sponsor-engine.js      # Automated sponsor rotation, promo codes & luxury audio chime
│       ├── alert-engine.js        # Typographic queue-based Follower/Sub/Donation popups
│       └── chat-widget.js         # Smooth on-screen stream chat with role tags
├── config/
│   └── stream-config.json         # Channel meta, socials, sponsors, discount codes & timings
├── overlays/
│   ├── game-overlay.html          # Clean in-game HUD (16:9 cam, event chip, timed sponsor lower-third)
│   ├── chatting-react.html        # Talk / React / Browser review split scene with sponsor spotlight
│   ├── starting-soon.html         # Ambient fluid mesh, live countdown, stream agenda & sponsor bar
│   ├── brb.html                   # Intermission screen with rotating sponsor card
│   └── stream-ending.html         # Outro credits roll, top gifters & next stream date
├── dashboard/
│   ├── index.html                 # Streamer Control Deck UI
│   ├── dashboard.js               # Event trigger handlers & live metric updater
│   └── dashboard.css              # Dark studio control panel styling
├── server.js                      # Local streaming & webhook server (POST /api/chat, /api/alert)
├── CHAT_INTEGRATION_GUIDE.md      # Step-by-step Twitch, YouTube & OBS Dock setup guide
└── README.md
```

---

## 3. Quick Start & Setup in OBS Studio

### Option A: Local Dev Server (Recommended)
1. In your terminal, run:
   ```bash
   node server.js
   ```
2. Your server will run at `http://localhost:3000`. You can also open the dashboard on your phone or tablet by typing `http://<YOUR_PC_IP>:3000/dashboard/index.html`.

### Option B: Direct File Mode (Zero Server Needed)
You can directly load the files into OBS using `file:///d:/Progency/om.streaming/overlays/...`.

---

## 4. Configuring OBS Scenes (Step-by-Step)

In OBS Studio, set your **Base Canvas** to `1920x1080` (Settings -> Video).

### Scene 1: Starting Soon
1. Create a scene named **`01_STARTING_SOON`**.
2. Add a **Browser Source**:
   - **URL**: `http://localhost:3000/overlays/starting-soon.html` (or browse to local file).
   - **Width**: `1920`, **Height**: `1080`.
   - Check: `Shutdown source when not visible`.
   - Check: `Refresh browser when scene becomes active`.

### Scene 2: Talk & React (Just Chatting)
1. Create a scene named **`02_TALK_REACT`**.
2. Layer Order (Top to Bottom):
   - **Top Layer**: Browser Source (`http://localhost:3000/overlays/chatting-react.html`, `1920x1080`).
   - **Underneath Camera Slot (Right Top)**: **Video Capture Device** (Your Camera). Resize and position within the camera cutout frame.
   - **Underneath Main Viewport (Left)**: **Window Capture** or **Display Capture** (YouTube video, Reddit, Game preview).

### Scene 3: In-Game Session
1. Create a scene named **`03_IN_GAME`**.
2. Layer Order (Top to Bottom):
   - **Top Layer**: Browser Source (`http://localhost:3000/overlays/game-overlay.html`, `1920x1080`).
   - **Bottom-Right Corner**: **Video Capture Device** (Your Camera) resized to fit inside the minimal webcam frame.
   - **Bottom Layer**: **Game Capture** (Set to "Capture any fullscreen application").

### Scene 4: Intermission (BRB)
1. Create a scene named **`04_BRB`**.
2. Add Browser Source (`http://localhost:3000/overlays/brb.html`, `1920x1080`).

### Scene 5: Stream Ending
1. Create a scene named **`05_ENDING`**.
2. Add Browser Source (`http://localhost:3000/overlays/stream-ending.html`, `1920x1080`).

---

## 5. Sponsor Automation & Control Deck

### Automated Rotation
- The system automatically reads `config/stream-config.json`.
- Every **3-4 minutes**, a luxury brand collaboration card slides smoothly onto the screen with a clean 3-tone studio chime, displaying:
  - Brand name (e.g., Nothing, Keychron, MOFT, Modern Creative).
  - Collab badge (`[ OFFICIAL AUDIO PARTNER ]`).
  - Headline and description.
  - Discount code pill (e.g., `UNCOMPILED - 15% OFF`).
  - Linear countdown timer bar.

### Streamer Control Deck (`/dashboard/index.html`)
Open `http://localhost:3000/dashboard/index.html` on your second monitor or tablet:
- **Instant Sponsor Broadcast**: Click on any sponsor button to immediately force that sponsor on screen during a shoutout.
- **Alert Testing**: Simulate Followers, Tier 1/2/3 Subs, Donations ($), and Raids in real time to test your overlay popups.
- **Live Stream Topic**: Change what topic/game you are reacting to; it synchronizes instantly across all active OBS overlays.
- **Countdown Adjuster**: Change the Starting Soon countdown timer duration on the fly.
