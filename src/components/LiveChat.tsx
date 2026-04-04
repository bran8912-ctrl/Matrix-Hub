import { useEffect, useRef, useState } from "react";

// ─── Self-hosted chat server connection ───────────────────────────────────────
// Connects to the standalone server.mjs WebSocket endpoint on the same origin.
// No env vars or configuration needed — host and port are auto-detected from
// the browser URL. Gracefully falls back to BroadcastChannel + localStorage
// when the server is not reachable (e.g. static hosting without server.mjs).

const WEBSOCKET_CONNECT_TIMEOUT_MS = 3000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  room_id: string;
  username: string;
  message: string;
  created_at: string;
  _isBot?: boolean;
}

interface LiveChatProps {
  roomId: string;
  roomLabel: string;
  allowedTopics: string[];
  /** Optional array of tips the bot will broadcast periodically in the feed. */
  botTips?: string[];
  /** Display name for the bot. Defaults to "💡 TipBot". */
  botName?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_TOPIC_CHECK_LENGTH = 20;
const BOT_TIP_INITIAL_DELAY_MS = 12_000;
const BOT_TIP_INTERVAL_MS = 35_000;
const MAX_USERNAME_LENGTH = 24;
const DEFAULT_BOT_NAME = "💡 TipBot";
// Random suffix: chars at positions 2–6 of a base-36 string (4 chars)
const RANDOM_SUFFIX_START = 2;
const RANDOM_SUFFIX_END = 6;
const MAX_STORED_MESSAGES = 200;

// ─── Moderation ───────────────────────────────────────────────────────────────

const PROFANITY_LIST = [
  "fuck", "shit", "ass", "bitch", "cunt", "dick", "pussy", "cock",
  "bastard", "prick", "twat", "wanker", "asshole", "arsehole",
  "motherfucker", "fucker", "bullshit", "horseshit",
  "nigger", "nigga", "faggot", "fag", "retard", "spic", "kike",
  "whore", "slut", "damn", "crap",
];

const HARASSMENT_LIST = [
  "kill yourself", "kys", "go die", "i will kill", "i'll kill",
  "you're trash", "youre trash", "kill you", "hurt you",
];

const SCAM_LIST = [
  "seed phrase", "private key", "guaranteed 100x", "guaranteed gains",
  "send me your", "dm me for", "get rich quick", "double your crypto",
  "click this link", "wire transfer", "send money", "send btc",
  "send eth", "send crypto", "invest now", "limited offer",
  "free money", "risk free", "zero risk",
];

const URL_RE = /https?:\/\/\S+/gi;
const EXCESSIVE_CAPS_RE = /[A-Z]{8,}/;
const SPAM_RE = /(.)\1{6,}/;

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countUrls(text: string): number {
  return (text.match(URL_RE) || []).length;
}

interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

function moderateMessage(
  raw: string,
  allowedTopics: string[]
): ModerationResult {
  const text = raw.trim();
  const norm = normalise(text);

  // Length checks
  if (text.length === 0) return { allowed: false, reason: "Message is empty." };
  if (text.length > 500)
    return { allowed: false, reason: "Message is too long (max 500 characters)." };

  // URL spam
  if (countUrls(text) > 1)
    return { allowed: false, reason: "Too many links. Please limit to one URL." };

  // Excessive caps
  if (EXCESSIVE_CAPS_RE.test(text))
    return { allowed: false, reason: "Please avoid shouting (excessive caps)." };

  // Repeated characters (spam)
  if (SPAM_RE.test(norm))
    return { allowed: false, reason: "Repeated characters detected. Please write normally." };

  // Profanity
  for (const word of PROFANITY_LIST) {
    const re = new RegExp(`\\b${word}\\b`, "i");
    if (re.test(norm))
      return {
        allowed: false,
        reason: "Message contains inappropriate language.",
      };
  }

  // Harassment
  for (const phrase of HARASSMENT_LIST) {
    if (norm.includes(phrase))
      return { allowed: false, reason: "Message contains harassment or threats." };
  }

  // Scam / phishing patterns
  for (const phrase of SCAM_LIST) {
    if (norm.includes(phrase))
      return {
        allowed: false,
        reason: "Message resembles a scam or phishing attempt.",
      };
  }

  // Topic check — skip for very short acks ("ok", "lol", "👍" etc.)
  if (norm.length > MIN_TOPIC_CHECK_LENGTH) {
    const hasTopicKeyword = allowedTopics.some((kw) =>
      norm.includes(kw.toLowerCase())
    );
    if (!hasTopicKeyword) {
      return {
        allowed: false,
        reason: `Please keep chat on topic. Allowed topics: ${allowedTopics.slice(0, 6).join(", ")}…`,
      };
    }
  }

  return { allowed: true };
}

// ─── Username helpers ─────────────────────────────────────────────────────────

const LS_KEY = "matrix_hub_chat_username";

function getOrCreateUsername(): string {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return stored;
    const rand = Math.random().toString(36).slice(RANDOM_SUFFIX_START, RANDOM_SUFFIX_END).toUpperCase();
    const name = `Anon-${rand}`;
    localStorage.setItem(LS_KEY, name);
    return name;
  } catch {
    return "Anon-???";
  }
}

// ─── LiveChat component ───────────────────────────────────────────────────────

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsMessagesKey(roomId: string): string {
  return `livechat_messages_${roomId}`;
}

function loadMessages(roomId: string): ChatMessage[] {
  try {
    const stored = localStorage.getItem(lsMessagesKey(roomId));
    if (stored) {
      const parsed: ChatMessage[] = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

function saveMessages(roomId: string, msgs: ChatMessage[]): void {
  try {
    localStorage.setItem(lsMessagesKey(roomId), JSON.stringify(msgs));
  } catch {
    // localStorage unavailable — in-memory only
  }
}

function capMessages(msgs: ChatMessage[]): ChatMessage[] {
  return msgs.length > MAX_STORED_MESSAGES
    ? msgs.slice(msgs.length - MAX_STORED_MESSAGES)
    : msgs;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: combine timestamp + multiple random segments for lower collision probability
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

// ─── LiveChat component ───────────────────────────────────────────────────────

export default function LiveChat({ roomId, roomLabel, allowedTopics, botTips, botName }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [username, setUsername] = useState("Anon");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  // Track whether initial localStorage load has occurred so we don't
  // overwrite stored messages with an empty array before load completes.
  const loadedRef = useRef(false);

  // Initialise username from localStorage
  useEffect(() => {
    const name = getOrCreateUsername();
    setUsername(name);
    setNameInput(name);
  }, []);

  // Connect: self-hosted WebSocket (cross-user) when reachable, otherwise
  // fall back to BroadcastChannel + localStorage (same-browser only)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let usedFallback = false;

    function startFallback() {
      if (usedFallback) return;
      usedFallback = true;

      loadedRef.current = false;
      setMessages(capMessages(loadMessages(roomId)));
      loadedRef.current = true;
      setStatus("live");

      try {
        const bc = new BroadcastChannel(`livechat-${roomId}`);
        bc.onmessage = (event: MessageEvent<ChatMessage>) => {
          const msg = event.data;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return capMessages([...prev, msg]);
          });
        };
        bcRef.current = bc;
      } catch {
        // BroadcastChannel not supported — single-tab only
        bcRef.current = null;
      }
    }

    // Derive the WebSocket URL from the current page's origin — same host and
    // port as the site (server.mjs serves both static files and WebSocket chat).
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const encodedRoomId = encodeURIComponent(roomId);
    const wsUrl = `${proto}//${window.location.host}/chat/${encodedRoomId}`;

    setStatus("connecting");

    // Attempt to connect to the self-hosted chat server.
    // If the server is not running, the connection will fail and we fall back.
    try {
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      // Time out quickly so the fallback kicks in without a long wait
      const connectTimer = setTimeout(() => {
        if (ws && ws.readyState !== WebSocket.OPEN) {
          ws.close();
          startFallback();
        }
      }, WEBSOCKET_CONNECT_TIMEOUT_MS);

      ws.onopen = () => {
        clearTimeout(connectTimer);
        setStatus("live");
        loadedRef.current = true;
      };

      ws.onerror = () => {
        clearTimeout(connectTimer);
        startFallback();
      };

      ws.onclose = () => {
        if (!usedFallback) startFallback();
      };

      ws.onmessage = (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as
            | { type: "history"; messages: ChatMessage[] }
            | { type: "message"; message: ChatMessage };

          if (data.type === "history") {
            setMessages(data.messages);
          } else if (data.type === "message") {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.message.id)) return prev;
              return capMessages([...prev, data.message]);
            });
          }
        } catch (err) {
          if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
            console.warn("[LiveChat] Failed to parse server message:", err);
          }
        }
      };
    } catch {
      // WebSocket constructor failed (e.g., SSR context)
      startFallback();
    }

    return () => {
      loadedRef.current = false;
      ws?.close();
      socketRef.current = null;
      try {
        bcRef.current?.close();
      } catch {}
      bcRef.current = null;
    };
  }, [roomId]);

  // Persist messages to localStorage whenever they change (after initial load)
  useEffect(() => {
    if (!loadedRef.current) return;
    saveMessages(roomId, messages);
  }, [roomId, messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Bot tip broadcaster — periodically injects a random tip as a bot message
  useEffect(() => {
    if (!botTips || botTips.length === 0) return;
    const tips = botTips;
    const name = botName ?? DEFAULT_BOT_NAME;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    function postTip() {
      const tip = tips[Math.floor(Math.random() * tips.length)];
      const msg: ChatMessage = {
        id: `bot-tip-${roomId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        room_id: roomId,
        username: name,
        message: tip,
        created_at: new Date().toISOString(),
        _isBot: true,
      };
      setMessages((prev) => capMessages([...prev, msg]));
    }

    const timeoutId = setTimeout(() => {
      postTip();
      intervalId = setInterval(postTip, BOT_TIP_INTERVAL_MS);
    }, BOT_TIP_INITIAL_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [roomId, botTips, botName]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setFeedback(null);
    const mod = moderateMessage(trimmed, allowedTopics);
    if (!mod.allowed) {
      setFeedback(mod.reason ?? "Message blocked.");
      return;
    }

    setSending(true);

    const newMsg: ChatMessage = {
      id: generateId(),
      room_id: roomId,
      username,
      message: trimmed,
      created_at: new Date().toISOString(),
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Self-hosted WebSocket path — server broadcasts the message back to all clients
      try {
        socketRef.current.send(JSON.stringify(newMsg));
        setInput("");
        // On success, rely on the server echoing the message back; no local append here.
        return;
      } catch {
        // If send fails (socket closed between readyState check and send), fall through
        // to the BroadcastChannel + localStorage fallback below.
      }
    }

    // BroadcastChannel + localStorage fallback
    try {
      bcRef.current?.postMessage(newMsg);
    } catch {
      // BroadcastChannel fallback — channel may be unsupported or already closed
    }
    setMessages((prev) => capMessages([...prev, newMsg]));
    setInput("");
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function saveName() {
    const trimmed = nameInput.trim().slice(0, MAX_USERNAME_LENGTH);
    if (!trimmed) return;
    // Allow only alphanumeric characters, underscores, hyphens, periods, and spaces
    const safeName = trimmed.replace(/[^a-zA-Z0-9_\-. ]/g, "");
    if (!safeName) return;
    setUsername(safeName);
    try {
      localStorage.setItem(LS_KEY, safeName);
    } catch {}
    setEditingName(false);
  }

  function formatTime(iso: string) {
    try {
      return new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  return (
    <div style={styles.container}>
      {/* Locally-scoped keyframe for the live indicator dot */}
      <style>{PULSE_KEYFRAMES}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={status === "live" ? styles.liveDot : styles.connectingDot} />
          <span style={styles.headerLabel}>{roomLabel}</span>
          <span style={status === "live" ? styles.liveBadge : styles.connectingBadge}>
            {status === "connecting" ? "CONNECTING…" : status === "error" ? "ERROR" : "LIVE"}
          </span>
        </div>
        <div style={styles.headerRight}>
          {editingName ? (
            <span style={styles.nameEditRow}>
              <input
                style={styles.nameInput}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                maxLength={MAX_USERNAME_LENGTH}
                autoFocus
              />
              <button style={styles.nameBtn} onClick={saveName}>✓</button>
              <button style={styles.nameBtn} onClick={() => setEditingName(false)}>✕</button>
            </span>
          ) : (
            <button
              style={styles.setNameBtn}
              onClick={() => setEditingName(true)}
              title="Change display name"
            >
              👤 {username}
            </button>
          )}
        </div>
      </div>

      {/* Message feed */}
      <div style={styles.feed}>
        {status === "live" && messages.length === 0 && (
          <p style={styles.statusMsg}>
            No messages yet. Be the first to chat!<br />
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {socketRef.current?.readyState === WebSocket.OPEN
                ? "⚡ Cross-user real-time chat"
                : "💬 Messages are stored locally in your browser"}
            </span>
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={msg._isBot ? styles.botMsgRow : styles.msgRow}>
            <span style={styles.msgTime}>{formatTime(msg.created_at)}</span>
            <span style={msg._isBot ? styles.botMsgUser : styles.msgUser}>{msg.username}</span>
            <span style={msg._isBot ? styles.botMsgText : styles.msgText}>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Feedback */}
      {feedback && <div style={styles.feedback}>{feedback}</div>}

      {/* Input row */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message…"
          aria-label="Chat message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          disabled={status !== "live" || sending}
        />
        <button
          style={sending ? { ...styles.sendBtn, opacity: 0.5 } : styles.sendBtn}
          onClick={handleSend}
          disabled={status !== "live" || sending}
          aria-label="Send message"
        >
          {sending ? "…" : "SEND"}
        </button>
      </div>
    </div>
  );
}

// ─── Inline styles (Matrix/hacker theme) ─────────────────────────────────────
// CSS custom properties are used with var() — they resolve correctly in inline
// styles because browsers evaluate var() at paint time.

const PRIMARY = "var(--theme-primary, #00ff99)";
const GLOW = "var(--theme-glow, rgba(0,255,153,0.4))";
const BORDER = "var(--theme-border, rgba(0,255,153,0.2))";
const TEXT = "var(--theme-text, #c8ffd4)";
const FONT = "'Courier New', monospace";

// @keyframes pulse for the live indicator dot — defined locally so this
// component doesn't depend on any external global stylesheet.
const PULSE_KEYFRAMES = `
@keyframes livechat-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--theme-glow, rgba(0,255,153,0.4)); }
  50%       { opacity: 0.4; box-shadow: 0 0 2px var(--theme-glow, rgba(0,255,153,0.2)); }
}
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "rgba(0, 255, 153, 0.04)",
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    boxShadow: `0 0 12px ${GLOW}`,
    fontFamily: FONT,
    fontSize: "0.85rem",
    color: TEXT,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.6rem 1rem",
    borderBottom: `1px solid ${BORDER}`,
    background: "rgba(0, 255, 153, 0.06)",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  liveDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: PRIMARY,
    boxShadow: `0 0 6px ${GLOW}`,
    animation: "livechat-pulse 1.5s ease-in-out infinite",
  },
  connectingDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#888",
  },
  headerLabel: {
    color: PRIMARY,
    fontWeight: "bold",
    letterSpacing: "1px",
    textShadow: `0 0 8px ${GLOW}`,
  },
  liveBadge: {
    fontSize: "0.7rem",
    padding: "2px 6px",
    borderRadius: "3px",
    background: "rgba(0,255,153,0.15)",
    border: `1px solid ${BORDER}`,
    color: PRIMARY,
    letterSpacing: "1px",
  },
  connectingBadge: {
    fontSize: "0.7rem",
    padding: "2px 6px",
    borderRadius: "3px",
    background: "rgba(128,128,128,0.15)",
    border: "1px solid rgba(128,128,128,0.3)",
    color: "#aaa",
    letterSpacing: "1px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  setNameBtn: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    color: TEXT,
    fontFamily: FONT,
    fontSize: "0.75rem",
    padding: "2px 8px",
    cursor: "pointer",
  },
  nameEditRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  nameInput: {
    background: "rgba(0,0,0,0.4)",
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    color: TEXT,
    fontFamily: FONT,
    fontSize: "0.8rem",
    padding: "2px 6px",
    width: "120px",
    outline: "none",
  },
  nameBtn: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: "0.8rem",
    padding: "2px 6px",
    cursor: "pointer",
  },
  feed: {
    flex: 1,
    maxHeight: "340px",
    minHeight: "120px",
    overflowY: "auto",
    padding: "0.75rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    scrollbarWidth: "thin",
    scrollbarColor: `${BORDER} transparent`,
  },
  statusMsg: {
    color: "#7a9e8a",
    fontStyle: "italic",
    textAlign: "center",
    margin: "auto",
  },
  msgRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.5rem",
    lineHeight: 1.5,
    flexWrap: "wrap",
    wordBreak: "break-word",
  },
  msgTime: {
    color: "#3a6a4a",
    fontSize: "0.75rem",
    flexShrink: 0,
  },
  msgUser: {
    color: PRIMARY,
    fontWeight: "bold",
    flexShrink: 0,
    textShadow: `0 0 4px ${GLOW}`,
  },
  msgText: {
    color: TEXT,
  },
  botMsgRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.5rem",
    lineHeight: 1.5,
    flexWrap: "wrap" as const,
    wordBreak: "break-word" as const,
    background: "rgba(0, 210, 255, 0.05)",
    borderLeft: "2px solid rgba(0, 210, 255, 0.35)",
    paddingLeft: "0.5rem",
    borderRadius: "0 3px 3px 0",
  },
  botMsgUser: {
    color: "#00d2ff",
    fontWeight: "bold",
    flexShrink: 0,
    textShadow: "0 0 6px rgba(0,210,255,0.5)",
  },
  botMsgText: {
    color: "#b0e8f0",
  },
  feedback: {
    padding: "0.4rem 1rem",
    background: "rgba(255, 80, 80, 0.1)",
    borderTop: "1px solid rgba(255,80,80,0.3)",
    color: "#ff8888",
    fontSize: "0.8rem",
  },
  inputRow: {
    display: "flex",
    borderTop: `1px solid ${BORDER}`,
  },
  input: {
    flex: 1,
    background: "rgba(0,0,0,0.3)",
    border: "none",
    borderRight: `1px solid ${BORDER}`,
    color: TEXT,
    fontFamily: FONT,
    fontSize: "0.85rem",
    padding: "0.6rem 0.8rem",
    outline: "none",
  },
  sendBtn: {
    background: "rgba(0,255,153,0.1)",
    border: "none",
    color: PRIMARY,
    fontFamily: FONT,
    fontWeight: "bold",
    fontSize: "0.8rem",
    padding: "0.6rem 1rem",
    cursor: "pointer",
    letterSpacing: "1px",
    transition: "background 0.2s",
  },
};
