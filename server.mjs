/**
 * Matrix Hub — Standalone Server
 * ───────────────────────────────
 * Serves the built Astro static site AND hosts the WebSocket chat on the
 * same port. No separate process, no port 4000, no environment variables.
 *
 * Static files are served by serve-handler (github.com/vercel/serve-handler),
 * a free MIT-licensed library used by Vercel's own `serve` CLI.
 *
 * Usage (after `npm run build`):
 *   node server.mjs            # default port 3000
 *   PORT=8080 node server.mjs  # custom port
 *
 * WebSocket chat endpoint: ws[s]://YOUR_HOST/chat/<roomId>
 */

import { createServer } from "node:http";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import handler from "serve-handler";
import { WebSocket, WebSocketServer } from "ws";

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = join(dirname(fileURLToPath(import.meta.url)), "dist");

// ─── Chat WebSocket ───────────────────────────────────────────────────────────

const MAX_MESSAGES = 200;
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 64;
const MAX_ID_LENGTH = 128;

const MAX_ROOMS = 500;
const MAX_ROOM_ID_LENGTH = 128;

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

/** Delete room state when no clients remain. */
function cleanupRoom(roomId) {
  const clients = roomClients.get(roomId);
  if (clients && clients.size === 0) {
    roomClients.delete(roomId);
    roomMessages.delete(roomId);
  }
}

// ─── HTTP + WebSocket server ──────────────────────────────────────────────────

const server = createServer((req, res) => {
  // serve-handler (github.com/vercel/serve-handler) handles static files,
  // MIME types, clean URL rewrites, and 404 pages from the dist/ folder.
  handler(req, res, {
    public: DIST_DIR,
    cleanUrls: true,
    trailingSlash: false,
  });
});

// 4 MB payload limit — truncation happens in the message handler
const wss = new WebSocketServer({ noServer: true, maxPayload: 4 * 1024 * 1024 });

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
  const rawRoom = decodeURIComponent(
    (req.url ?? "").replace(/^\/chat\//, "").split("?")[0]
  ).slice(0, MAX_ROOM_ID_LENGTH) || "default";
  const roomId = rawRoom;

  // Reject connection if already at max room count and this is a new room
  if (!roomClients.has(roomId) && roomClients.size >= MAX_ROOMS) {
    ws.close(1013, "Too many rooms");
    return;
  }

  getRoomClients(roomId).add(ws);

  // Send existing history to new connection
  ws.send(JSON.stringify({ type: "history", messages: getRoomMessages(roomId) }));

  ws.on("message", (raw) => {
    let parsed;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      return;
    }

    // Validate required fields
    if (
      typeof parsed.id !== "string" || parsed.id.trim() === "" ||
      typeof parsed.username !== "string" || parsed.username.trim() === "" ||
      typeof parsed.message !== "string" || parsed.message.trim() === "" ||
      typeof parsed.created_at !== "string"
    ) return;

    // Construct a sanitized object — discard any extra client-supplied fields.
    // room_id is always taken from the URL path, not from the client payload.
    /** @type {{ id: string; room_id: string; username: string; message: string; created_at: string; }} */
    const msg = {
      id:         parsed.id.slice(0, MAX_ID_LENGTH),
      room_id:    roomId,
      username:   parsed.username.slice(0, MAX_USERNAME_LENGTH),
      message:    parsed.message.slice(0, MAX_MESSAGE_LENGTH),
      created_at: parsed.created_at.slice(0, 64),
    };

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
    // Free memory once the room is empty
    cleanupRoom(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Matrix Hub server running at http://localhost:${PORT}`);
  console.log(`WebSocket chat: ws://localhost:${PORT}/chat/<roomId>`);
  console.log("Press Ctrl+C to stop.");
});
