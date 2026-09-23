/**
 * Lightweight Zero-Dependency Local Dev Server for uncompiled.om
 * Serves overlays and control dashboard with proper MIME types.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Connected SSE clients (for streaming chat & alerts to browser sources)
const sseClients = new Set();

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: Server-Sent Events stream
  if (req.url === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('data: {"type":"CONNECTED"}\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // API Route: Incoming Chat Webhook (POST /api/chat)
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        broadcastSSE('NEW_CHAT_MESSAGE', payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, received: payload }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // API Route: Incoming Alert Webhook (POST /api/alert)
  if (req.url === '/api/alert' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        broadcastSSE('TRIGGER_ALERT', payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // API Route: Trigger Sponsor Webhook (POST /api/sponsor)
  if (req.url === '/api/sponsor' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        broadcastSSE('TRIGGER_SPONSOR', payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        broadcastSSE('TRIGGER_SPONSOR', {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      }
    });
    return;
  }

  // Normalize URL for static files
  let parsedUrl = req.url.split('?')[0];
  if (parsedUrl === '/') {
    parsedUrl = '/dashboard/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, decodeURIComponent(parsedUrl));

  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function broadcastSSE(type, payload) {
  const data = JSON.stringify({ type, payload, timestamp: Date.now() });
  const msg = `data: ${data}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ★ UNCOMPILED.OM STREAM OVERLAY & AUTOMATION SERVER ★`);
  console.log(`======================================================`);
  console.log(`  > Dashboard:     http://localhost:${PORT}/dashboard/index.html`);
  console.log(`  > Game Overlay:  http://localhost:${PORT}/overlays/game-overlay.html`);
  console.log(`  > React/Chat:    http://localhost:${PORT}/overlays/chatting-react.html`);
  console.log(`  > Starting Soon: http://localhost:${PORT}/overlays/starting-soon.html`);
  console.log(`  > Intermission:  http://localhost:${PORT}/overlays/brb.html`);
  console.log(`  > Stream Ending: http://localhost:${PORT}/overlays/stream-ending.html`);
  console.log(`======================================================\n`);
});
