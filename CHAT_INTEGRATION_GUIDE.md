# Live Chat Integration Guide for `uncompiled.om`

There are two distinct types of chat in a streaming setup:
1. **Private Chat in OBS Studio (For You to Read While Gaming)**: Docked directly in OBS so you never have to look at your phone.
2. **On-Screen Styled Chat (For Your Viewers)**: Rendered inside your overlays with editorial typography, role badges, and animations.

---

## 1. Showing Chat On-Screen (In Your Custom Overlays)

Your overlay suite already includes **`chat-widget.js`** which is integrated into `game-overlay.html` and `chatting-react.html`. Here is how to feed real live chat into it:

### Method A: Twitch Chat (100% Native — Zero API Keys or Setup Needed!)
Because Twitch supports open IRC over WebSockets, our overlay can connect directly to your live chat anonymously.
- **Option 1 (From Dashboard)**: Open `http://localhost:3000/dashboard/index.html`, enter your Twitch username in the **Live Chat Connect** box, and click **Connect Twitch**.
- **Option 2 (Permanent Config)**: Open `config/stream-config.json` and add:
  ```json
  "integrations": {
    "twitchChannel": "uncompiled_om"
  }
  ```
  Every time your OBS scene opens, it will automatically connect to your chat, display real user comments, and detect VIP, MOD, and Subscriber badges automatically!

---

### Method B: YouTube Live Chat & Multi-Streaming (Via Streamer.bot or Webhook)

YouTube Live Chat requires a live stream broadcast ID. The easiest, most robust way streamers handle YouTube & Kick chat is via **Streamer.bot** or a simple local webhook.

#### 1. The Local API Webhook (Built into `server.js`)
Your server provides a direct endpoint:
`POST http://localhost:3000/api/chat`
```json
{
  "author": "Marcus",
  "text": "Yo Om, that shot was insane!",
  "role": "VIP",
  "isHighlighted": false
}
```
Any incoming POST immediately appears on screen in your overlays with zero lag.

#### 2. Connecting YouTube with Streamer.bot (Recommended Standard)
1. Download **Streamer.bot** (Free, portable, no installation needed from [streamer.bot](https://streamer.bot/)).
2. Go to **Platforms** -> **YouTube** -> Click **Connect / Authorize**.
3. Go to **Actions** tab -> Create a new Action named `Send to OBS Chat Overlay`.
4. In **Sub-Actions**, right-click -> **Network** -> **Fetch URL**:
   - **URL**: `http://localhost:3000/api/chat`
   - **Method**: `POST`
   - **Headers**: `Content-Type: application/json`
   - **Body**:
     ```json
     {"author":"%user%","text":"%rawInput%","role":"VIEWER"}
     ```
5. In **Triggers**, right-click -> **YouTube** -> **Message**. Select the action you just created.
6. Done! Whenever someone chats on your YouTube live stream, Streamer.bot pushes it to your custom overlay instantly.

#### 3. Alternative: Social Stream Ninja (Multi-Platform in 1 Click)
If you stream to **YouTube + Twitch + Kick** simultaneously:
1. Install the free Chrome extension **Social Stream Ninja** ([socialstream.ninja](https://socialstream.ninja/)).
2. Open your YouTube / Twitch chat popout tabs.
3. In Social Stream Ninja settings, enable **Webhook Push** -> set URL to `http://localhost:3000/api/chat`.
4. All messages from every platform will appear seamlessly in the same sleek chat box!

---

## 2. Setting Up Private Chat in OBS Studio (For You to Read)

If you want a dockable chat panel inside OBS Studio itself so you can read comments without any browser open:

### For Twitch:
1. Open OBS Studio.
2. Go to **Settings** -> **Stream** -> Connect your Twitch account.
3. OBS will automatically generate a **Stream Chat** dock on the left or right of your preview window!

### For YouTube (or Custom Docks):
1. In OBS Studio, click the top menu: **Docks** -> **Custom Browser Docks...**
2. In the Dock Name column, type: `YouTube Live Chat`.
3. In the URL column, paste your YouTube pop-out chat URL:
   - *(Go to YouTube Studio -> View Live Stream -> Click the 3 dots on the chat -> "Popout Chat" -> Copy the URL)*.
4. Click **Apply**.
5. A native chat window will pop up inside OBS. You can drag and snap it right next to your OBS preview screen!

---

## 3. Quick Summary of What to Use

| Platform | Best Method for On-Screen Styled Overlay | Best Method for Streamer to Read Privately |
| :--- | :--- | :--- |
| **Twitch** | **Native WebSocket in our code** (Type name in Dashboard or config) | **OBS Built-in Twitch Dock** (Settings -> Connect Account) |
| **YouTube** | **Streamer.bot -> POST `http://localhost:3000/api/chat`** | **OBS Custom Browser Dock** (Docks -> Custom Browser Docks) |
| **Multi-Stream (Both)** | **Social Stream Ninja or Streamer.bot** | **OBS Custom Browser Docks** |
