# Master Integration & API Key Setup Guide for Kick, YouTube & OBS

This guide provides complete, step-by-step instructions for setting up **Kick**, **YouTube**, and **OBS Studio** integrations with the `om.streaming` suite.

---

## 🟢 1. Kick Platform Integration (For `uncompiled-om`)

Kick provides public chat and channel data over WebSockets without requiring developer approval or private API keys.

### Method A: Native Kick WebSocket Client (Built into `om.streaming`)
Your code includes **`KickWebSocketClient`** (`src/lib/kick-integration.ts`), which automatically connects to Kick's WebSocket server for channel `uncompiled-om`:

1. **How it works for `https://kick.com/uncompiled-om`**:
   - Channel Slug: `uncompiled-om`
   - Kick Public API Endpoint: `https://kick.com/api/v2/channels/uncompiled-om`
   - Universal Kick Pusher App Key: `eb1d5f28b05140d36377` (Cluster: `us2`)
   - Channel Chatroom: `chatrooms.{chatroom_id}.v2`

2. **Connecting from Code**:
   Add your Kick channel slug to `.env.local`:
   ```env
   NEXT_PUBLIC_KICK_CHANNEL_USERNAME="uncompiled-om"
   ```
   Your overlays and dashboard will automatically resolve the `chatroom_id` from `https://kick.com/api/v2/channels/uncompiled-om` and listen to live chat & follower alerts in real-time!

### Method B: Social Stream Ninja / Streamer.bot (1-Click Multi-Stream)
If you want to forward Kick chat & alerts via Webhook:

1. Install **Social Stream Ninja** (Free Chrome Extension from [socialstream.ninja](https://socialstream.ninja/)).
2. Open your Kick live chat popout window (`https://kick.com/popout/uncompiled-om/chat`).
3. Open Extension settings -> Enable **Webhook Push** -> Target URL:
   ```text
   http://localhost:3000/api/chat
   ```
4. Incoming messages from Kick will automatically render on your OBS screen overlay with role badges.

---

## 🔴 2. YouTube Integration & API Keys

YouTube has two ways to connect: **Official Data API v3 Key** (for Live Viewers & Subscriber Stats) or **Streamer.bot** (for Live Chat).

### Method A: Obtaining a Free YouTube Data API v3 Key (Official Google Cloud)
To display live YouTube Subscriber Counts, Channel Views, and Live Viewer Telemetry:

1. Go to **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com/)
2. Log in with your Google Account and click **Create Project** -> Name it `OM Streaming Suite`.
3. In the top search bar, type **YouTube Data API v3** and click **Enable**.
4. Go to **Credentials** tab on the left menu -> Click **+ CREATE CREDENTIALS** -> Select **API key**.
5. Copy the generated API Key.
6. Copy `.env.example` to `.env.local` in your project root and add your key:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY="AIzaSyDxbtlBtGyMJ5fpc_jzFvNP-MUvBAMYlbA"
   ```

### Method B: YouTube Live Chat (Zero API Key Setup via Streamer.bot)
To send YouTube live chat comments into `om.streaming`:

1. Download **Streamer.bot** (Free from [streamer.bot](https://streamer.bot/)).
2. Connect your YouTube account in **Platforms -> YouTube -> Authorize**.
3. Create an Action `Push YouTube Chat to OBS`.
4. Add Sub-Action -> **Fetch URL**:
   - **URL**: `http://localhost:3000/api/chat`
   - **Method**: `POST`
   - **Header**: `Content-Type: application/json`
   - **Body**: `{"author":"%user%","text":"%rawInput%","role":"VIEWER"}`
5. Trigger: **YouTube -> Message**. Done!

---

## 📡 3. Built-in Local REST API Endpoints Reference

Your local Next.js server (`http://localhost:3000`) provides built-in HTTP endpoints so any external tool (Stream Deck, Streamer.bot, MixItUp, IFTTT) can control your stream:

| Endpoint | Method | Payload Example | Description |
| :--- | :--- | :--- | :--- |
| **`/api/chat`** | `POST` | `{"author": "Marcus", "text": "Sick gameplay!", "role": "VIP"}` | Pushes live chat message to on-screen overlay |
| **`/api/alert`** | `POST` | `{"type": "sub", "username": "Alex", "message": "Subbed at Tier 1!"}` | Triggers on-screen alert modal with audio sound |
| **`/api/events`** | `GET` | *(Server-Sent Events Stream)* | SSE stream for real-time OBS overlay syncing |
| **`/api/sponsor`** | `POST` | `{"brand": "KEYCHRON", "code": "OMSTREAM"}` | Switches current on-screen sponsor banner |

---

## 🖥️ 4. Setting Up Private Docks in OBS Studio (For You to Read While Gaming)

If you want a dockable chat panel inside OBS Studio itself so you can read comments without any browser open:

### For Kick (`uncompiled-om`):
1. In OBS Studio, click **Docks** -> **Custom Browser Docks...**
2. **Dock Name**: `Kick Live Chat`
3. **URL**: `https://kick.com/popout/uncompiled-om/chat`
4. Click **Apply** -> Snap the window inside OBS next to your preview window!

### For YouTube:
1. Go to YouTube Studio -> Open your Live Stream -> Click the 3 dots on the chat -> **Popout Chat**.
2. Copy the popout URL.
3. In OBS Studio -> **Docks** -> **Custom Browser Docks...** -> Paste URL -> **Apply**.
