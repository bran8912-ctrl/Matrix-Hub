/**
 * Matrix Hub Chat Server
 * ─────────────────────
 * A self-hosted WebSocket chat server — no external service, no API keys,
 * no environment variables required.
 *
 * Usage:
 *   node chat-server.mjs          # listens on port 4000 (default)
 *   PORT=5000 node chat-server.mjs
 *
 * The Astro site’s LiveChat client connects to a same-origin WebSocket
 * endpoint at /chat (e.g. ws[s]://your-site/chat/<roomId>). In production,
 * configure your reverse proxy so that /chat is forwarded to this server’s
 * port (4000 by default).
 */

import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT) || 4000;
const MAX_MESSAGES = 200;
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 64;
const MAX_ID_LENGTH = 128;

/**
 * @typedef {{ id: string, room_id: string, username: string, message: string, created_at: string }} ChatMessage
 */

// ─── In-memory rooms ─────────────────────────────────────────────────────────

/** @type {Map<string, ChatMessage[]>} */
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

// ─── WebSocket server ─────────────────────────────────────────────────────────

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Matrix Hub Chat Server");
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  // Room is identified from the URL path: /chat/<roomId>
  const roomId = (req.url ?? "").replace(/^\/chat\//, "").split("?")[0] || "default";

  // Register client in this room
  getRoomClients(roomId).add(ws);

  // Send existing history to the new connection
  const history = getRoomMessages(roomId);
  ws.send(JSON.stringify({ type: "history", messages: history }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return; // Ignore non-JSON frames
    }

    // Validate and sanitize
    if (
      typeof msg.id !== "string" || msg.id.trim() === "" ||
      typeof msg.username !== "string" || msg.username.trim() === "" ||
      typeof msg.message !== "string" || msg.message.trim() === "" ||
      typeof msg.room_id !== "string" ||
      typeof msg.created_at !== "string"
    ) return;

    msg.id = msg.id.slice(0, MAX_ID_LENGTH);
    msg.username = msg.username.slice(0, MAX_USERNAME_LENGTH);
    msg.message = msg.message.slice(0, MAX_MESSAGE_LENGTH);
    msg.room_id = msg.room_id.slice(0, MAX_ID_LENGTH);
    msg.created_at = msg.created_at.slice(0, 64);

    // Deduplicate
    const messages = getRoomMessages(roomId);
    if (messages.some((m) => m.id === msg.id)) return;

    // Store and cap
    messages.push(msg);
    if (messages.length > MAX_MESSAGES) messages.splice(0, messages.length - MAX_MESSAGES);

    // Broadcast only to clients in this room
    const payload = JSON.stringify({ type: "message", message: msg });
    getRoomClients(roomId).forEach((client) => {
      if (client.readyState === 1 /* OPEN */) {
        client.send(payload);
      }
    });
  });

  ws.on("close", () => {
    getRoomClients(roomId).delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`Matrix Hub Chat Server listening on ws://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop.");
});
