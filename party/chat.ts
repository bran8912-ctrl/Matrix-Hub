import type * as Party from "partykit/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  room_id: string;
  username: string;
  message: string;
  created_at: string;
}

type ServerMessage =
  | { type: "history"; messages: ChatMessage[] }
  | { type: "message"; message: ChatMessage };

// ─── ChatRoom server ──────────────────────────────────────────────────────────

const MAX_MESSAGES = 200;

export default class ChatRoom implements Party.Server {
  private messages: ChatMessage[] = [];

  constructor(readonly room: Party.Room) {}

  /** Send message history to a newly connected client. */
  onConnect(conn: Party.Connection) {
    const payload: ServerMessage = { type: "history", messages: this.messages };
    conn.send(JSON.stringify(payload));
  }

  /** Receive a message from a client, persist it, and broadcast to all. */
  onMessage(raw: string, _sender: Party.Connection) {
    let msg: ChatMessage;
    try {
      msg = JSON.parse(raw) as ChatMessage;
    } catch {
      return; // Ignore non-JSON frames
    }

    // Basic server-side validation — reject empty, missing, or overlong fields
    if (
      typeof msg.id !== "string" || msg.id.trim() === "" ||
      typeof msg.username !== "string" || msg.username.trim() === "" ||
      typeof msg.message !== "string" || msg.message.trim() === "" ||
      typeof msg.room_id !== "string" ||
      typeof msg.created_at !== "string"
    ) {
      return;
    }
    // Clamp field lengths to prevent storage abuse
    msg.id = msg.id.slice(0, 128);
    msg.username = msg.username.slice(0, 64);
    msg.message = msg.message.slice(0, 500);
    msg.room_id = msg.room_id.slice(0, 128);
    msg.created_at = msg.created_at.slice(0, 64);

    // Prevent duplicates (e.g. client retries)
    if (this.messages.some((m) => m.id === msg.id)) return;

    this.messages = [...this.messages, msg].slice(-MAX_MESSAGES);

    const payload: ServerMessage = { type: "message", message: msg };
    this.room.broadcast(JSON.stringify(payload));
  }
}

export const onFetch: Party.FetchHandler = () =>
  new Response("Matrix Hub Chat Server", { status: 200 });
