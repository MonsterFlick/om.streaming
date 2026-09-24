# `uncompiled.om` — Next.js 15 Streaming Production Suite & Virtual Stream Deck

Welcome to the official streaming and broadcast production setup for **`uncompiled.om`**. 
This suite moves away from dated gamer/hacker tropes and gives you an **Editorial Studio Design** aesthetic (inspired by high-end design houses, Nothing Tech, and Teenage Engineering) with kinetic typography, smoked acrylic glassmorphism, responsive spring animations, automated sponsor showcases, an **Executive Control Deck** with live 16:9 screen previews, and a **Wireless Virtual Stream Deck** for mobile devices.

---

## 1. Core Architecture & Feature Matrix

| Feature | Description | Access URL |
| :--- | :--- | :--- |
| **Executive Dashboard** | Master mission control with live multi-screen iframe previews, text animation studio, alert simulator, sponsor broadcaster, and goal trackers. | `http://localhost:3000/dashboard` |
| **Wireless Virtual Stream Deck** | Touch macro pad with haptic feedback for phone, iPad, or desktop. 1-touch scene switching, mic mutes, soundboard, and panic shield. | `http://localhost:3000/deck` *(or `http://<ip>:3000/deck`)* |
| **Standalone Webcam Overlay** | Dedicated modular camera dock for OBS **Nested Scenes**. Allows scaling, moving, and cropping without breaking layout bounds! | `http://localhost:3000/overlays/webcam` |
| **03 In-Game HUD** | Transparent gaming overlay with top event ticker, floating auto-fade chat, and timed sponsor lower-third. | `http://localhost:3000/overlays/game` |
| **02 Talk / React HUD** | Split-screen reaction layout with primary media capture frame, camera box, and live chat feed. | `http://localhost:3000/overlays/chatting` |
| **01 Starting Soon** | Ambient fluid gradient mesh, kinetic title reveal, live countdown timer, and episode agenda cards. | `http://localhost:3000/overlays/starting` |
| **04 Be Right Back** | Intermission screen with breathing studio lighting, sponsor spotlight loop, and chat feed. | `http://localhost:3000/overlays/brb` |
| **05 Stream Ending** | Outro screen with scrolling supporter credits, session top donor, and next broadcast schedule. | `http://localhost:3000/overlays/ending` |

---

## 2. Directory Structure (Next.js 15 App Router)

```
om.streaming/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Syne, Plus Jakarta Sans & Space Mono
│   │   ├── page.tsx                   # Studio Landing Gateway
│   │   ├── globals.css                # Industrial minimalist CSS tokens & tactile button physics
│   │   ├── dashboard/page.tsx         # Executive Control Deck with 16:9 Live Previews
│   │   ├── deck/page.tsx              # Virtual Stream Deck (Mobile & Tablet touch pad)
│   │   ├── overlays/
│   │   │   ├── layout.tsx             # 1920x1080 transparent canvas layout + AlertBox
│   │   │   ├── game/page.tsx          # 03_IN_GAME HUD overlay
│   │   │   ├── chatting/page.tsx      # 02_TALK_REACT Just Chatting overlay
│   │   │   ├── starting/page.tsx      # 01_STARTING_SOON Countdown overlay
│   │   │   ├── brb/page.tsx           # 04_BRB Intermission overlay
│   │   │   ├── ending/page.tsx        # 05_STREAM_ENDING Outro overlay
│   │   │   ├── webcam/page.tsx        # ★ Dedicated Standalone Webcam Overlay ★
│   │   │   ├── chat/page.tsx          # Dedicated transparent chat widget
│   │   │   ├── alerts/page.tsx        # Dedicated transparent alert popup
│   │   │   ├── ticker/page.tsx        # Dedicated transparent event ticker
│   │   │   └── sponsor/page.tsx       # Dedicated transparent sponsor lower-third
│   │   └── api/                       # Webhooks for chat, alerts, sponsors & deck actions
│   ├── components/
│   │   ├── dashboard/                 # Previews, Webcam settings, Text studio, Alert simulator
│   │   ├── deck/                      # Full-screen mobile touch matrix with haptics
│   │   └── overlays/                  # WebcamFrame, AnimatedText, AlertBox, SponsorCard, ChatWidget
│   ├── lib/
│   │   ├── stream-bus.ts              # Universal event bus (BroadcastChannel + SSE + localStorage)
│   │   ├── sound-effects.ts           # Web Audio API synthesizer for luxury chimes & SFX
│   │   ├── twitch-irc.ts              # Zero-token anonymous Twitch IRC WebSocket client
│   │   └── hotkeys.ts                 # Keyboard shortcuts engine (Num 1-5, M, P, S)
│   └── config/
│       └── stream-config.ts           # Channel metadata, default goals, and sponsor data
├── obs_scene_collection_uncompiled.json # Ready-to-import OBS Scene Collection
├── OBS_IMPORT_AND_SETUP_GUIDE.md      # Step-by-step OBS import and camera alignment guide
├── CHAT_INTEGRATION_GUIDE.md          # Live chat and Twitch connector guide
├── package.json                       # Next.js 15, React 19, TypeScript, Tailwind, Framer Motion
└── tsconfig.json
```

---

## 3. Quick Start

### 1. Launch the Studio Suite:
```powershell
# In the project directory:
npm run start   # Or npm run dev
```

### 2. Open OBS Studio:
- Go to **Scene Collection** -> **Import** -> Select `obs_scene_collection_uncompiled.json`.
- Select **`uncompiled.om Production Suite`** from the Scene Collection menu.
- Your camera and display will automatically be bound with zero overflow!

### 3. Open Controls:
- On your PC: `http://localhost:3000/dashboard`
- On your phone or iPad: `http://<your-pc-ip>:3000/deck`
