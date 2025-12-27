const CHAT_ENDPOINT = "/api/chat";
const CHAT_PROMPT = "secretary";

const STORAGE_KEY = "matrixHubOracleSecretary.v1";
const TASKS_KEY = "matrixHubOracleTasks.v1";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return {
    voiceEnabled: false,
    lastGreetAt: 0,
    ...safeJsonParse(raw, {})
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadTasks() {
  return safeJsonParse(localStorage.getItem(TASKS_KEY) || "[]", []).filter(
    (t) => t && typeof t.text === "string"
  );
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function normalize(text) {
  return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
}

const MTX_INFO = `⚡ MTX SYSTEM FLOW — HOW IT POWERS SITE GROWTH

1. ENTRY (FREE → MTX)
• Site is usable without MTX
• MTX unlocks deeper layers
• No hard paywalls — only progression
Result: Low friction, high retention

2. ACTION → REWARD
Users earn MTX by:
• Creating accounts
• Using tools
• Testing beta features
• Reporting issues (GitHub → MTX rewards)
Result: Activity becomes growth fuel

3. MTX AS FUEL (NOT STORAGE)
MTX is consumed by:
• Advanced tools
• Compute-heavy actions
• Priority queues
• Experimental modules
Result: Constant circulation, no hoarding

4. FEEDBACK LOOP
USE → EARN → UNLOCK → BUILD → REPEAT
• Usage increases value
• Value attracts contributors
• Contributors build modules
• Modules increase usage
Result: Self-reinforcing ecosystem

5. GITHUB INTEGRATION
Tie MTX to GitHub actions:
• PR merged → MTX reward
• Bug labeled 'confirmed' → MTX reward
• Feature accepted → MTX grant
Result: Developers are directly incentivized

6. FUTURE EXPANSION PATH
MTX later enables:
• Plugin marketplace
• App-to-app payments
• Partner integrations
• DAO-lite governance
Only after real usage exists.

🧠 DESIGN RULES
• MTX never required for basic access
• MTX never marketed as profit
• MTX only unlocks real function
• Growth follows usage, not hype

SYSTEM GROWS BY USE.
MTX FLOWS WHERE SIGNAL EXISTS.`;

function scrollToSelector(selector) {
  const el = document.querySelector(selector);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function clickSelector(selector) {
  const el = document.querySelector(selector);
  if (!el) return false;
  el.click();
  return true;
}

function oracleToast(title, body, ttlMs = 4200) {
  const container = document.getElementById("oracleMatrixToasts");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "oracle-toast";

  const t = document.createElement("div");
  t.className = "oracle-toast__title";
  t.textContent = title;

  const b = document.createElement("div");
  b.className = "oracle-toast__body";
  b.textContent = body;

  toast.appendChild(t);
  toast.appendChild(b);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-6px)";
    toast.style.transition = "160ms ease-out";
    setTimeout(() => toast.remove(), 220);
  }, ttlMs);
}

function getSpeechVoice() {
  const select = document.getElementById("oracleVoiceSelect");
  const selectedVoice = select?.value || "default";
  const voices = window.speechSynthesis?.getVoices?.() || [];
  
  // Matrix-themed voice selection
  let preferred;
  if (selectedVoice === "matrix") {
    // Matrix: Lower pitch, slower rate for that digital voice effect
    preferred = voices.find((v) => /en/i.test(v.lang) && /male|david|alex|tom/i.test(v.name))
      || voices.find((v) => /en/i.test(v.lang));
  } else if (selectedVoice === "cyber") {
    // Cyber: Mid-range, slightly robotic
    preferred = voices.find((v) => /en/i.test(v.lang) && /female|samantha|victoria/i.test(v.name))
      || voices.find((v) => /en/i.test(v.lang));
  } else if (selectedVoice === "oracle") {
    // Oracle: Deep, authoritative voice
    preferred = voices.find((v) => /en/i.test(v.lang) && /male.*us|alex|daniel/i.test(v.name))
      || voices.find((v) => /en/i.test(v.lang));
  } else if (selectedVoice === "neon") {
    // Neon: Higher pitch, faster rate
    preferred = voices.find((v) => /en/i.test(v.lang) && /female|zira|hazel/i.test(v.name))
      || voices.find((v) => /en/i.test(v.lang));
  } else {
    // Default
    preferred = voices.find((v) => /en/i.test(v.lang) && /female|woman|zira|samantha|victoria/i.test(v.name))
      || voices.find((v) => /en/i.test(v.lang));
  }
  
  return preferred || voices[0] || null;
}

function speakIfEnabled(state, text) {
  if (!state.voiceEnabled) return;
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return;

  // Speech often requires a user gesture; this will be a no-op if blocked.
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  
  // Get selected voice mode for custom settings
  const select = document.getElementById("oracleVoiceSelect");
  const selectedVoice = select?.value || "default";
  
  // Apply voice-specific settings
  if (selectedVoice === "matrix") {
    utter.rate = 0.80;
    utter.pitch = 0.70;
    utter.volume = 0.90;
  } else if (selectedVoice === "cyber") {
    utter.rate = 0.90;
    utter.pitch = 0.85;
    utter.volume = 0.95;
  } else if (selectedVoice === "oracle") {
    utter.rate = 0.75;
    utter.pitch = 0.60;
    utter.volume = 1.00;
  } else if (selectedVoice === "neon") {
    utter.rate = 1.10;
    utter.pitch = 1.10;
    utter.volume = 0.95;
  } else {
    utter.rate = 0.92;
    utter.pitch = 0.92;
    utter.volume = 0.95;
  }

  const voice = getSpeechVoice();
  if (voice) utter.voice = voice;

  synth.speak(utter);
}

function buildApps() {
  return [
    {
      id: "music-player",
      name: "Matrix MP3 Player",
      description: "Play, pause, and skip tracks.",
      open: () => scrollToSelector("#matrix-player"),
      actions: [
        { id: "play", label: "Play", run: () => (window["playMatrix"]?.(), true) },
        { id: "pause", label: "Pause", run: () => (window["pauseMatrix"]?.(), true) },
        { id: "next", label: "Next", run: () => (window["nextTrack"]?.(), true) },
        { id: "prev", label: "Previous", run: () => (window["prevTrack"]?.(), true) }
      ]
    },
    {
      id: "deal-scanner",
      name: "Deal Scanner Terminal",
      description: "Run a scan and reveal rotating offers.",
      open: () => scrollToSelector(".deal-scanner-panel"),
      actions: [
        { id: "scan", label: "Initiate Scan", run: () => (window["runScanner"]?.(), true) },
        { id: "scan-btn", label: "Press Scan Button", run: () => clickSelector("#scan-btn") }
      ]
    },
    {
      id: "daily-drops",
      name: "Daily Drops",
      description: "Fetch the latest daily deal drops.",
      open: () => scrollToSelector(".daily-drops-panel"),
      actions: [
        { id: "refresh", label: "Refresh Drops", run: () => (window["loadDailyDrops"]?.(), true) },
        { id: "refresh-btn", label: "Press Refresh", run: () => clickSelector("#refresh-drops") }
      ]
    },
    {
      id: "art-generator",
      name: "Matrix AI Generator (Art)",
      description: "Generate Matrix-themed visuals on-canvas.",
      open: () => scrollToSelector(".image-generator-panel"),
      actions: [
        { id: "generate", label: "Generate", run: () => (window["generateImage"]?.(), true) }
      ]
    },
    {
      id: "video-generator",
      name: "Matrix AI Video Generator",
      description: "Switch tabs and open the generator section.",
      open: () => scrollToSelector(".matrix-ai-video-panel"),
      actions: [
        { id: "t2v", label: "Text → Video", run: () => (window["switchVideoTab"]?.("text2video"), true) },
        { id: "i2v", label: "Image → Video", run: () => (window["switchVideoTab"]?.("image2video"), true) },
        { id: "adv", label: "Advanced", run: () => (window["switchVideoTab"]?.("advanced"), true) }
      ]
    },
    {
      id: "themes",
      name: "Theme Console",
      description: "Change the Matrix theme presets.",
      open: () => scrollToSelector(".theme-customizer-panel"),
      actions: [
        { id: "classic", label: "Classic", run: () => (window["setTheme"]?.("classic"), true) },
        { id: "cyber-purple", label: "Cyber Purple", run: () => (window["setTheme"]?.("cyber-purple"), true) },
        { id: "neon-blue", label: "Neon Blue", run: () => (window["setTheme"]?.("neon-blue"), true) }
      ]
    }
  ];
}

function findAppByText(apps, text) {
  const t = normalize(text);
  return apps.find((a) => t.includes(a.id.replace(/-/g, " ")) || t.includes(a.name.toLowerCase().replace(/\s+/g, " ")));
}

function buildQuickChips(container, onClick) {
  const chips = [
    { label: "Show Daily Drops", value: "show daily drops" },
    { label: "Run Deal Scanner", value: "run deal scanner" },
    { label: "Play Music", value: "play music" },
    { label: "About MTX Coin", value: "what is mtx" },
    { label: "Open Video Generator", value: "open video generator" }
  ];

  container.innerHTML = "";
  for (const c of chips) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "oracle-chip";
    btn.textContent = c.label;
    btn.addEventListener("click", () => onClick(c.value));
    container.appendChild(btn);
  }
}

function renderAppsPanel(panel, apps, onRun) {
  panel.innerHTML = "";

  const header = document.createElement("div");
  header.className = "oracle-apps__header";
  header.textContent = "SITE APPS";

  const list = document.createElement("div");
  list.className = "oracle-apps__list";

  for (const app of apps) {
    const item = document.createElement("div");
    item.className = "oracle-apps__item";

    const name = document.createElement("div");
    name.className = "oracle-apps__name";
    name.textContent = app.name;

    const desc = document.createElement("div");
    desc.className = "oracle-apps__desc";
    desc.textContent = app.description;

    const actions = document.createElement("div");
    actions.className = "oracle-apps__actions";

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "oracle-apps__action";
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", () => onRun({ type: "open", app }));
    actions.appendChild(openBtn);

    for (const action of app.actions || []) {
      const aBtn = document.createElement("button");
      aBtn.type = "button";
      aBtn.className = "oracle-apps__action";
      aBtn.textContent = action.label;
      aBtn.addEventListener("click", () => onRun({ type: "action", app, action }));
      actions.appendChild(aBtn);
    }

    item.appendChild(name);
    item.appendChild(desc);
    item.appendChild(actions);
    list.appendChild(item);
  }

  panel.appendChild(header);
  panel.appendChild(list);
}

function createMessageEl(role, text) {
  const div = document.createElement("div");
  div.className = `bot-msg ${role === "user" ? "bot-msg--user" : "bot-msg--oracle"}`;

  const name = document.createElement("div");
  name.className = "bot-msg__name";
  name.textContent = role === "user" ? "You" : "Oracle";

  const body = document.createElement("div");
  body.textContent = text;

  div.appendChild(name);
  div.appendChild(body);
  return div;
}

async function callOracle(conversation) {
  const resp = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: CHAT_PROMPT,
      messages: conversation.slice(-12)
    })
  });
  const data = await resp.json().catch(() => ({}));
  const reply = data && typeof data.reply === "string" ? data.reply : "Response unavailable. Please try again.";
  return reply;
}

function formatTasks(tasks) {
  if (!tasks.length) return "No tasks stored.\n\nTry: /task add Follow up on Daily Drops";
  const lines = tasks.map((t, idx) => `${idx + 1}. ${t.done ? "[done] " : ""}${t.text}`);
  return `Tasks:\n${lines.join("\n")}\n\nCommands:\n- /task add <text>\n- /task done <#>\n- /task clear`;
}

async function handleLocalIntent(apps, rawText) {
  const text = rawText.trim();
  const t = normalize(text);
  if (!t) return { handled: true, reply: "Say it plainly." };

  if (t === "/apps" || t === "apps") {
    return { handled: true, reply: "Open the Apps panel above, or ask: “open daily drops”, “run deal scanner”, “play music”." };
  }

  if (t === "/tasks" || t === "tasks") {
    const tasks = loadTasks();
    return { handled: true, reply: formatTasks(tasks) };
  }

  if (t.startsWith("/task add ")) {
    const taskText = text.slice("/task add ".length).trim();
    if (!taskText) return { handled: true, reply: "Task text missing. Example: /task add Refresh drops at 9am" };
    const tasks = loadTasks();
    tasks.unshift({ text: taskText, done: false, at: Date.now() });
    saveTasks(tasks.slice(0, 50));
    return { handled: true, reply: `Stored.\n\n${formatTasks(loadTasks())}` };
  }

  if (t.startsWith("/task done ")) {
    const n = Number(text.slice("/task done ".length).trim());
    const tasks = loadTasks();
    if (!Number.isFinite(n) || n < 1 || n > tasks.length) {
      return { handled: true, reply: `Invalid task number.\n\n${formatTasks(tasks)}` };
    }
    tasks[n - 1].done = true;
    saveTasks(tasks);
    return { handled: true, reply: `Marked done.\n\n${formatTasks(loadTasks())}` };
  }

  if (t === "/task clear") {
    saveTasks([]);
    return { handled: true, reply: "Cleared. The slate is clean." };
  }

  const wantsOpen = /\b(open|show|go to|take me to|navigate)\b/.test(t);
  const wantsRun = /\b(run|start|initiate|refresh|scan|generate|play|pause|next|previous|prev)\b/.test(t);

  // Dedicated shortcuts
  if (/\b(daily drops|drops)\b/.test(t) && /\b(refresh|reload)\b/.test(t)) {
    const app = apps.find((a) => a.id === "daily-drops");
    app?.open?.();
    const ok = app?.actions?.find((a) => a.id === "refresh")?.run?.() ?? false;
    return { handled: true, reply: ok ? "Daily Drops refreshed. Watch the feed." : "Daily Drops found, but refresh was blocked." };
  }

  if (/\b(deal scanner|scanner)\b/.test(t) && /\b(run|scan|initiate|start)\b/.test(t)) {
    const app = apps.find((a) => a.id === "deal-scanner");
    app?.open?.();
    const ok = app?.actions?.find((a) => a.id === "scan")?.run?.() ?? false;
    return { handled: true, reply: ok ? "Scan initiated. The terminal will reveal what it finds." : "Scanner found, but scan could not be started." };
  }

  if (/\b(play|pause|next|previous|prev)\b/.test(t) && /\b(music|player|track)\b/.test(t)) {
    const app = apps.find((a) => a.id === "music-player");
    app?.open?.();
    const action =
      /\bpause\b/.test(t) ? "pause" :
      /\bnext\b/.test(t) ? "next" :
      /\b(prev|previous)\b/.test(t) ? "prev" :
      "play";
    const ok = app?.actions?.find((a) => a.id === action)?.run?.() ?? false;
    return { handled: true, reply: ok ? `Music: ${action}.` : "Music controls unavailable on this page." };
  }

  if (/\b(generate)\b/.test(t) && /\b(art|image|generator)\b/.test(t)) {
    const app = apps.find((a) => a.id === "art-generator");
    app?.open?.();
    const ok = app?.actions?.find((a) => a.id === "generate")?.run?.() ?? false;
    return { handled: true, reply: ok ? "Generating. Watch the canvas." : "Generator found, but it did not respond." };
  }

  if (/\b(video generator|video)\b/.test(t) && (wantsOpen || wantsRun)) {
    const app = apps.find((a) => a.id === "video-generator");
    app?.open?.();
    if (/\bimage\b/.test(t)) app?.actions?.find((a) => a.id === "i2v")?.run?.();
    if (/\btext\b/.test(t)) app?.actions?.find((a) => a.id === "t2v")?.run?.();
    return { handled: true, reply: "Video generator opened. Choose your tab and begin." };
  }

  // MTX cryptocurrency info
  if (/\b(mtx|matrix-hubcoin|matrixhubcoin|coin|crypto|currency|token|earn|reward)\b/.test(t)) {
    return { handled: true, reply: MTX_INFO };
  }

  if (wantsOpen) {
    const app = findAppByText(apps, text);
    if (app) {
      const ok = app.open?.() ?? false;
      return { handled: true, reply: ok ? `Opened: ${app.name}.` : `Could not locate: ${app.name}.` };
    }
  }

  // Not handled locally; fall back to AI.
  if (wantsOpen || wantsRun) {
    return {
      handled: false,
      reason: "action-unknown"
    };
  }

  return { handled: false };
}

function init() {
  const botBtn = document.getElementById("matrixBotButton");
  const botWin = document.getElementById("matrixBotWindow");
  const sendBtn = document.getElementById("matrixBotSend");
  const input = document.getElementById("matrixBotInput");
  const messages = document.getElementById("matrixBotMessages");
  const appsBtn = document.getElementById("oracleAppsBtn");
  const voiceBtn = document.getElementById("oracleVoiceBtn");
  const closeBtn = document.getElementById("oracleCloseBtn");
  const quick = document.getElementById("oracleQuickActions");
  const appsPanel = document.getElementById("oracleAppsPanel");

  if (!botBtn || !botWin || !sendBtn || !input || !messages || !appsBtn || !voiceBtn || !closeBtn || !quick || !appsPanel) {
    return;
  }

  const state = loadState();
  const conversation = [];
  const apps = buildApps();

  buildQuickChips(quick, (value) => {
    input.value = value;
    sendMessage();
  });

  renderAppsPanel(appsPanel, apps, async ({ type, app, action }) => {
    if (type === "open") {
      const ok = app.open?.() ?? false;
      oracleToast("ORACLE", ok ? `Opened: ${app.name}` : `Cannot open: ${app.name}`);
      return;
    }
    if (type === "action") {
      app.open?.();
      const ok = action?.run?.() ?? false;
      oracleToast("ORACLE", ok ? `${app.name}: ${action.label}` : `${app.name}: action blocked`);
    }
  });

  function setWindowOpen(open) {
    botWin.style.display = open ? "flex" : "none";
    if (open) setTimeout(() => input.focus(), 0);
  }

  function toggleAppsPanel() {
    const isHidden = appsPanel.hasAttribute("hidden");
    if (isHidden) appsPanel.removeAttribute("hidden");
    else appsPanel.setAttribute("hidden", "");
  }

  function setVoiceEnabled(enabled) {
    state.voiceEnabled = !!enabled;
    saveState(state);
    voiceBtn.setAttribute("aria-pressed", state.voiceEnabled ? "true" : "false");
    if (state.voiceEnabled) {
      oracleToast("VOICE", "Enabled. The Oracle will speak when permitted.");
    } else {
      oracleToast("VOICE", "Muted.");
      window.speechSynthesis?.cancel?.();
    }
  }

  voiceBtn.setAttribute("aria-pressed", state.voiceEnabled ? "true" : "false");

  botBtn.addEventListener("click", () => {
    const open = botWin.style.display !== "flex";
    setWindowOpen(open);
    if (open && conversation.length === 0) {
      const matrixGreetings = ["Wake up, Neo... The Matrix has you.\n\nFollow the white rabbit. Try asking about deals, music, or MTX tokens.", "The door is already open.\n\nI can help you navigate the system. Try: 'run deal scanner', 'play music', or 'what is mtx'.", "Welcome to the Matrix Hub.\n\nI am the Oracle. Ask me about daily drops, casino games, or site features.", "You've taken the red pill.\n\nThe path ahead reveals itself. Ask about tools, themes, or the MTX ecosystem."]; const greet = matrixGreetings[Math.floor(Math.random() * matrixGreetings.length)];
      conversation.push({ role: "assistant", content: greet });
      messages.appendChild(createMessageEl("assistant", greet));
      messages.scrollTop = messages.scrollHeight;
      speakIfEnabled(state, greet);
    }
  });

  closeBtn.addEventListener("click", () => setWindowOpen(false));
  appsBtn.addEventListener("click", toggleAppsPanel);
  voiceBtn.addEventListener("click", () => setVoiceEnabled(!state.voiceEnabled));

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    conversation.push({ role: "user", content: text });
    if (conversation.length > 20) conversation.splice(0, conversation.length - 20);

    messages.appendChild(createMessageEl("user", text));
    messages.scrollTop = messages.scrollHeight;

    const typingDiv = document.createElement("div");
    typingDiv.id = "typingIndicator";
    typingDiv.className = "bot-msg bot-msg--oracle";
    typingDiv.textContent = "Oracle is contemplating…";
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;

    try {
      const local = await handleLocalIntent(apps, text);
      if (local.handled) {
        typingDiv.remove();
        conversation.push({ role: "assistant", content: local.reply });
        messages.appendChild(createMessageEl("assistant", local.reply));
        messages.scrollTop = messages.scrollHeight;
        speakIfEnabled(state, local.reply);
        return;
      }

      const reply = await callOracle(conversation);
      typingDiv.remove();
      conversation.push({ role: "assistant", content: reply });
      messages.appendChild(createMessageEl("assistant", reply));
      messages.scrollTop = messages.scrollHeight;
      speakIfEnabled(state, reply);
    } catch (e) {
      typingDiv.remove();
      const msg = "Connection error. Try again.";
      conversation.push({ role: "assistant", content: msg });
      messages.appendChild(createMessageEl("assistant", msg));
      messages.scrollTop = messages.scrollHeight;
    }
  }

  // Matrix-style greeting popups (no auto-speech)
  const now = Date.now();
  const cooldownMs = 1000 * 60 * 60 * 6;
  if (!state.lastGreetAt || now - state.lastGreetAt > cooldownMs) {
    state.lastGreetAt = now;
    saveState(state);
    setTimeout(() => {
      oracleToast("MATRIX HUB", "A presence has entered the system.\nThe Oracle is available in the corner.");
    }, 900);
  }

  // Keep voices list warm on some browsers
  window.speechSynthesis?.getVoices?.();
  window.speechSynthesis?.addEventListener?.("voiceschanged", () => window.speechSynthesis?.getVoices?.());
}

init();
