/**
 * Matrix Hub — Standalone Server
 * ───────────────────────────────
 * Serves the built Astro static site AND hosts the WebSocket chat on the
 * same port. No separate process, no port 4000, no environment variables.
 *
 * Usage (after `npm run build`):
 *   node server.mjs            # default port 3000
 *   PORT=8080 node server.mjs  # custom port
 *
 * WebSocket chat endpoint: ws[s]://YOUR_HOST/chat/<roomId>
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocket, WebSocketServer } from "ws";

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = join(fileURLToPath(import.meta.url), "..", "dist");

// ─── MIME types ───────────────────────────────────────────────────────────────

const MIME = {
  ".html":  "text/html; charset=utf-8",
  ".js":    "application/javascript",
  ".mjs":   "application/javascript",
  ".css":   "text/css",
  ".json":  "application/json",
  ".xml":   "application/xml",
  ".txt":   "text/plain",
  ".svg":   "image/svg+xml",
  ".ico":   "image/x-icon",
  ".png":   "image/png",
  ".jpg":   "image/jpeg",
  ".jpeg":  "image/jpeg",
  ".gif":   "image/gif",
  ".webp":  "image/webp",
  ".avif":  "image/avif",
  ".woff":  "font/woff",
  ".woff2": "font/woff2",
  ".ttf":   "font/ttf",
  ".otf":   "font/otf",
  ".mp3":   "audio/mpeg",
  ".mp4":   "video/mp4",
  ".webm":  "video/webm",
  ".ogg":   "audio/ogg",
  ".pdf":   "application/pdf",
};

// ─── Static file handler ──────────────────────────────────────────────────────

async function serveStatic(req, res) {
  const urlPath = new URL(req.url, "http://localhost").pathname;

  // Try: exact path, path + .html, path/index.html
  const candidates = [
    join(DIST_DIR, urlPath),
    join(DIST_DIR, urlPath + ".html"),
    join(DIST_DIR, urlPath, "index.html"),
  ];

  for (const filePath of candidates) {
    try {
      const s = await stat(filePath);
      if (!s.isFile()) continue;
      const body = await readFile(filePath);
      const contentType = MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(body);
      return;
    } catch {
      // try next candidate
    }
  }

  // Fall back to 404.html if available
  try {
    const body = await readFile(join(DIST_DIR, "404.html"));
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

// ─── Chat WebSocket ───────────────────────────────────────────────────────────

const MAX_MESSAGES = 200;
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 64;
const MAX_ID_LENGTH = 128;

/** @type {Map<string, Array<object>>} */
const roomMessages = new Map();

/** @type {Map<string, Set<import('ws').WebSocket>>} */
const roomClients = new Map();

function getRoomMessages(roomId) {
  if (!roomMessages.has(roomId)) roomMessages.set(roomId, []);
  return roomMessages.get(roomId);
}

function getRoomClients(roomId) {
  if (!roomClients.has(roomId)) roomClients.set(roomId, new Set());
  return roomClients.get(roomId);
}

// ─── HTTP + WebSocket server ──────────────────────────────────────────────────

const server = createServer((req, res) => {
  serveStatic(req, res);
});

const wss = new WebSocketServer({ noServer: true });

// Upgrade WebSocket connections on /chat/* — everything else is rejected
server.on("upgrade", (req, socket, head) => {
  if ((req.url ?? "").startsWith("/chat/")) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", (ws, req) => {
  const roomId = (req.url ?? "").replace(/^\/chat\//, "").split("?")[0] || "default";

  getRoomClients(roomId).add(ws);

  // Send existing history to new connection
  ws.send(JSON.stringify({ type: "history", messages: getRoomMessages(roomId) }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    // Validate required fields
    if (
      typeof msg.id !== "string" || msg.id.trim() === "" ||
      typeof msg.username !== "string" || msg.username.trim() === "" ||
      typeof msg.message !== "string" || msg.message.trim() === "" ||
      typeof msg.room_id !== "string" ||
      typeof msg.created_at !== "string"
    ) return;

    // Sanitize lengths
    msg.id         = msg.id.slice(0, MAX_ID_LENGTH);
    msg.username   = msg.username.slice(0, MAX_USERNAME_LENGTH);
    msg.message    = msg.message.slice(0, MAX_MESSAGE_LENGTH);
    msg.room_id    = msg.room_id.slice(0, MAX_ID_LENGTH);
    msg.created_at = msg.created_at.slice(0, 64);

    // Deduplicate
    const messages = getRoomMessages(roomId);
    if (messages.some((m) => m.id === msg.id)) return;

    // Store and cap
    messages.push(msg);
    if (messages.length > MAX_MESSAGES) {
      messages.splice(0, messages.length - MAX_MESSAGES);
    }

    // Broadcast to all clients in this room
    const payload = JSON.stringify({ type: "message", message: msg });
    getRoomClients(roomId).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  });

  ws.on("close", () => {
    getRoomClients(roomId).delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`Matrix Hub server running at http://localhost:${PORT}`);
  console.log(`WebSocket chat: ws://localhost:${PORT}/chat/<roomId>`);
  console.log("Press Ctrl+C to stop.");
});
