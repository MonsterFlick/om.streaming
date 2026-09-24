# OBS Studio Architecture & Setup Guide (Suite 2.0)

This guide reviews your updated **`obs_scene_collection_uncompiled.json`**, evaluates whether this is the **best way to use it**, and walks you step-by-step through both **Separated** and **Integrated** webcam workflows.

---

## 1. Executive Verdict: Is This Right & Is It the Best Way?

### ✅ Verdict: **YES — With the New Dual-Mode Architecture, You Have the Gold Standard Setup.**

Here is why your updated setup is the most powerful and flexible in live streaming:

1. **Separated vs. Integrated (You Now Have Both)**:
   - **Separated Nested Scene (`06_SEPARATED_CAM_NEST`)**: This is what top esports broadcasts and professional studios use. Your physical camera and the animated HTML camera frame are grouped into **one standalone nested scene**. You can drop that scene into any game, scale it down, hold `ALT` to crop, or move it to any corner instantly.
   - **Integrated Scenes (`02_TALK_REACT`, `03_IN_GAME`)**: Still fully supported! If you ever want a classic all-in-one overlay with camera bounding boxes pre-locked, it works out of the box.
2. **Next.js 15 Native Browser Sources**:
   - Zero flicker, instant hardware acceleration via CEF (Chromium Embedded Framework).
   - Real-time event bus synchronization across all scenes without refreshing OBS.
   - Backward-compatible rewrites: both `/overlays/game` and `/overlays/game-overlay.html` work seamlessly.
3. **Multi-Device Virtual Stream Deck**:
   - You can control your entire stream from your PC, or open `http://<your-pc-ip>:3000/deck` on your phone or iPad on the same Wi-Fi with instant haptic touch buttons.

---

## 2. Quick Import: Loading into OBS Studio

Your pre-configured file is located at:
`c:\Users\Admin\Desktop\om-projects\pro-testing\om.streaming\obs_scene_collection_uncompiled.json`

### Step-by-Step Import:
1. Open **OBS Studio**.
2. Click the top menu bar: **Scene Collection** -> **Import**.
3. A popup will appear. Click the **`...`** (browse) button next to "Collection File".
4. Select `obs_scene_collection_uncompiled.json` from your project folder.
5. Click **Import**.
6. In OBS top menu, go to **Scene Collection** and select **`uncompiled.om Production Suite`**.
7. **Configure Your Physical Devices**:
   - In scene `02_TALK_REACT` or `06_SEPARATED_CAM_NEST`, double-click **`Webcam (Video Capture Device)`**.
   - Select your physical webcam from the "Device" dropdown list and click **OK**.
   - In scene `02_TALK_REACT`, double-click **`Display Capture (Primary)`** and pick your active gaming monitor.

---

## 3. Which Webcam Setup Should You Use? (Separated vs. Integrated)

Your collection now provides both options. Here is how and when to use each:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        WHICH WORKFLOW TO USE?                          │
├───────────────────────────────────┬────────────────────────────────────┤
│ WORKFLOW A: SEPARATED (RECOMMENDED)│ WORKFLOW B: INTEGRATED (TRADITIONAL)│
├───────────────────────────────────┼────────────────────────────────────┤
│ • Uses Scene:                     │ • Uses Scenes:                     │
│   "06_SEPARATED_CAM_NEST"         │   "02_TALK_REACT" / "03_IN_GAME"   │
│ • Best For:                       │ • Best For:                        │
│   Moving your camera to different │   Streamers who want exactly one   │
│   corners depending on game HUDs  │   browser source per scene.        │
│   (e.g. mini-map or health bars). │                                    │
│ • How to use:                     │ • How to use:                      │
│   In any scene, click [+] ->      │   Your webcam is already locked    │
│   "Scene" -> select               │   to the bottom-right coordinate   │
│   "06_SEPARATED_CAM_NEST".        │   with "Scale to inner bounds".    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Pro Tip for Moving Your Camera Anywhere:
When using `06_SEPARATED_CAM_NEST` as a source inside `03_IN_GAME`:
1. Click the nested camera source on your OBS preview canvas.
2. Drag it anywhere (top-left, bottom-left, top-right).
3. Drag the corner red handles to make it bigger or smaller.
4. **Hold `ALT`** while dragging any edge to crop out unwanted room background (the edge turns green).
5. Both the physical camera and the animated luxury studio border will scale and move together in 100% perfect lockstep!

---

## 4. How the Layer Stack Works in OBS

In OBS, sources render from **top to bottom** (like layers in Photoshop). Here is how your **`03_IN_GAME`** scene is arranged:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. [TOP]     Overlay: In-Game HUD (Browser Source)                     │
│              -> 100% transparent background with floating top event    │
│                 pill, bottom-left sponsor dock, and auto-fading chat.   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. [MIDDLE]  Webcam (or 06_SEPARATED_CAM_NEST)                         │
│              -> Placed in the camera slot or anywhere you want.        │
├────────────────────────────────────────────────────────────────────────┤
│ 3. [BOTTOM]  Game Capture (or Display Capture)                         │
│              -> Fullscreen 1920x1080 display of your gameplay.         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Starting the Studio Suite & Stream Deck

Before opening OBS, make sure the Next.js broadcast server is running:

```powershell
# Open terminal in project directory:
cd c:\Users\Admin\Desktop\om-projects\pro-testing\om.streaming

# Start the high-performance studio server:
npm run start
```

### Streamer Command URLs:

| Tool | URL | Description |
| :--- | :--- | :--- |
| **Executive Dashboard** | `http://localhost:3000/dashboard` | Mission control deck with live 16:9 previews, text animation studio, alert tests, sponsor cards, and chat broadcaster. |
| **Wireless Stream Deck** | `http://localhost:3000/deck` | Touch macro pad for phone, iPad, or PC with haptics and 1-touch scene switching. |
| **Mobile Access** | `http://<your-pc-ip>:3000/deck` | Connect your smartphone over local Wi-Fi to use as an Elgato Stream Deck replacement. |
| **Standalone Webcam Frame** | `http://localhost:3000/overlays/webcam` | Dedicated modular camera dock for OBS nested scenes. |
| **In-Game HUD** | `http://localhost:3000/overlays/game` | Transparent HUD with ticker, sponsor, and chat. |
| **Talk & React HUD** | `http://localhost:3000/overlays/chatting` | Split-screen reaction layout. |
| **Starting Soon** | `http://localhost:3000/overlays/starting` | Fluid mesh, kinetic title, and countdown timer. |
| **BRB Intermission** | `http://localhost:3000/overlays/brb` | Sponsor spotlight and chat dock. |
| **Stream Ending** | `http://localhost:3000/overlays/ending` | Credits roll and next broadcast schedule. |

---

## 6. Keyboard Shortcuts Reference

You can switch scenes and mute audio without touching OBS by pressing these physical keys while on the Dashboard:

- `1` or `Num 1`: Switch to **Starting Soon**
- `2` or `Num 2`: Switch to **Talk / React**
- `3` or `Num 3`: Switch to **In-Game HUD**
- `4` or `Num 4`: Switch to **Be Right Back**
- `5` or `Num 5`: Switch to **Stream Ending**
- `M`: Toggle **Mic Mute** (updates on-screen overlay badge & plays audio cue)
- `P`: Trigger **Panic Shield** (emergency cut to BRB + audio mute + camera blur)
- `S`: Rotate **Next Sponsor** card
