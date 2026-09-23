# OBS Studio Import & Core Architecture Guide

This guide answers your four core questions and gives you the exact steps to import and run your new streaming setup.

---

## 1. How to Import the Ready-Made Scene Collection into OBS

We generated a complete, pre-configured file for you:
`d:\Progency\om.streaming\obs_scene_collection_uncompiled.json`

It already contains all 5 scenes (`01_STARTING_SOON`, `02_TALK_REACT`, `03_IN_GAME`, `04_BRB`, `05_STREAM_ENDING`) with pre-aligned camera slots, your specific monitor ID, and transparent overlay HUDs.

### Step-by-Step Import:
1. Open **OBS Studio**.
2. Click the top menu bar: **Scene Collection** -> **Import**.
3. A popup will appear. Click the **`...`** (browse) button next to "Collection File".
4. Navigate to:
   `D:\Progency\om.streaming\obs_scene_collection_uncompiled.json`
5. Click **Import**.
6. Now go to **Scene Collection** on the top menu and select **`uncompiled.om Production Suite`**.
7. **Select your camera**:
   - In scene `02_TALK_REACT` or `03_IN_GAME`, double-click **`Webcam (Video Capture Device)`**.
   - Select your physical webcam from the "Device" dropdown list and click **OK**.
   - Because we pre-configured the bounding box, your webcam will **automatically fit perfectly into the frame without spilling off the screen!**

---

## 2. Should You Use Image/Media Files or HTML for Overlays?

### Verdict: **HTML (Browser Sources) is the Gold Standard.**

Here is the comparison:

| Feature | Static Image / Video Media (`.png` / `.mp4`) | HTML5 Browser Sources (Our System) |
| :--- | :--- | :--- |
| **Live Chat On Screen** | ❌ **Impossible**. Static images cannot show live comments. | ✅ **Real-time animated chat** with user badges. |
| **Alert Popups (Subs/Tips)** | ❌ **Impossible** without separate complex alert widgets. | ✅ **Built-in queue system** with editorial animations & chimes. |
| **Rotating Sponsors** | ❌ Requires rendering and re-rendering heavy video loops. | ✅ **Automatic rotation** with live promo codes & countdown bars. |
| **Performance / GPU Load** | ⚠️ Constant 1080p 60fps video decoding stresses your GPU during heavy gaming. | ⚡ **Negligible CPU/GPU load**. Chromium Embedded Framework (CEF) is hardware-accelerated. |
| **Realtime Editing** | ❌ Must open Photoshop or Premiere, export, and reload. | ✅ Change topic or discount code live from your **Control Deck** without refreshing OBS. |
| **Crispness at 1080p / 4K** | ⚠️ Raster images blur or lose quality when scaled. | ✅ **Vector typography & CSS** stay razor-sharp at any resolution. |

*Summary*: Use HTML for the overlay structure, and use images/PNGs *inside* the HTML for sponsor logos or channel badges.

---

## 3. Why Does the Webcam Go Out of Screen & How to Fix It?

### The Problem:
When you add a camera to OBS as a "Video Capture Device", OBS pulls the camera's raw feed (usually `1920x1080` or `1280x720`). If you move it to the bottom-right corner, the camera boundary overflows past the edge of the 1920x1080 canvas, cutting off your face or stretching weirdly.

### The Solution: "Scale to Inner Bounds"
In our imported `obs_scene_collection_uncompiled.json`, we have already pre-set this. If you ever need to adjust it manually, here is the professional trick:

1. Right-click the **Webcam** source in OBS -> **Transform** -> **Edit Transform** (Shortcut: `Ctrl + E`).
2. Look for **Bounding Box Type**:
   - Change it from *None* to **`Scale to inner bounds`**.
3. Under **Bounding Box Size**:
   - For **In-Game Scene**: Width: `380`, Height: `214`.
   - For **Talk / React Scene**: Width: `560`, Height: `380`.
4. Now, no matter what native resolution your webcam sends, OBS will **never** allow it to spill outside that box!
5. **Cropping Trick**: If you want to cut off unwanted background from the sides of your camera, **hold the `ALT` key** while dragging any red handle in OBS. The handle turns green, indicating a clean crop!

---

## 4. In-Game Overlay: Is It Transparent & Where Does the Game Go?

### Yes, It Is 100% Transparent!
If you open `overlays/game-overlay.html`, you will see:
```css
body {
  background-color: transparent;
}
```
There is **no black background**. The only things drawn on the screen are:
- Top-center event pill (`alex_prime`, `elena.eth ($50)`).
- Bottom-left sponsor banner (when active).
- Left-side chat box.
- Bottom-right webcam border outline.
**The entire middle and background is completely see-through.**

### The 3-Layer Stack in OBS:
In OBS, sources render from **top to bottom** (like Photoshop layers). The order in your **`03_IN_GAME`** scene must be:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. [TOP]     Overlay: In-Game HUD  (Browser Source)         │ <- Transparent HTML
├─────────────────────────────────────────────────────────────┤
│ 2. [MIDDLE]  Webcam (Video Capture Device)                  │ <- Fits in bottom-right slot
├─────────────────────────────────────────────────────────────┤
│ 3. [BOTTOM]  Game Capture (or Display Capture)              │ <- Fullscreen 1920x1080
└─────────────────────────────────────────────────────────────┘
```

Because **Layer 1 (The Overlay)** is transparent, your **Layer 3 (The Game)** shows through 100% clearly across your entire monitor, with the sleek editorial status pills floating cleanly over the game.
