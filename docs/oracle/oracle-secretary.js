// Matrix MP3 Player Playlist - Royalty-Free Music from Mixkit
// All tracks are 100% free under the Mixkit Stock Music Free License
// No attribution required - free for commercial and personal use
const matrixPlaylist = [
  { title: "Cyberpunk City", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/140/140.mp3" },
  { title: "Deep Techno Ambience", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/134/134.mp3" },
  { title: "Techno Fest Vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/124/124.mp3" },
  { title: "Hazy After Hours", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/132/132.mp3" },
  { title: "Minimal Techno 01", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/162/162.mp3" },
  { title: "Minimal Emotion", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/160/160.mp3" },
  { title: "Machine Drum Vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/117/117.mp3" },
  { title: "Dub Techno Groove", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/133/133.mp3" },
  { title: "Trance Party", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/166/166.mp3" },
  { title: "Infected Vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/157/157.mp3" },
  { title: "Goa Trance Mantra", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/137/137.mp3" },
  { title: "Tech House vibes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/130/130.mp3" },
  { title: "Kodama Night Town", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/114/114.mp3" },
  { title: "Digital Clouds", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/175/175.mp3" },
  { title: "Slow Rain", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/122/122.mp3" },
  { title: "Sun in Your Eyes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/131/131.mp3" },
  { title: "Better Times are Coming", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/173/173.mp3" },
  { title: "Lonerism", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/159/159.mp3" },
  { title: "B.O.R.N", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/620/620.mp3" },
  { title: "Deep Urban", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/623/623.mp3" },
  { title: "Feedback Dreams", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/588/588.mp3" },
  { title: "Fragments Of Bangkok", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/625/625.mp3" },
  { title: "Skyline", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/601/601.mp3" },
  { title: "Silent Descent", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/614/614.mp3" },
  { title: "Echoes", artist: "Andrew Ev", url: "https://assets.mixkit.co/music/188/188.mp3" },
  { title: "Sci-Fi Game", artist: "Arulo", url: "https://assets.mixkit.co/music/395/395.mp3" },
  { title: "Sci-Fi Score", artist: "Arulo", url: "https://assets.mixkit.co/music/464/464.mp3" },
  // --- Added songs ---
  { title: "Neon Skyline", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/626/626.mp3" },
  { title: "Digital Mirage", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/627/627.mp3" },
  { title: "Night Drive", artist: "Arulo", url: "https://assets.mixkit.co/music/396/396.mp3" },
  { title: "Retro Future", artist: "Arulo", url: "https://assets.mixkit.co/music/397/397.mp3" },
  { title: "Dream Sequence", artist: "Andrew Ev", url: "https://assets.mixkit.co/music/189/189.mp3" }
];

// Layers playlist for secondary track
const layersPlaylist = [
  { title: "Deep Techno Ambience", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/134/134.mp3", tags: ["ambient", "techno"] },
  { title: "Hazy After Hours", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/132/132.mp3", tags: ["ambient"] },
  { title: "Minimal Emotion", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/160/160.mp3", tags: ["minimal", "ambient"] },
  { title: "Dub Techno Groove", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/133/133.mp3", tags: ["dub", "techno"] },
  { title: "Digital Clouds", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/175/175.mp3", tags: ["ambient"] },
  { title: "Slow Rain", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/122/122.mp3", tags: ["ambient"] },
  { title: "Sun in Your Eyes", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/131/131.mp3", tags: ["ambient"] },
  { title: "Better Times are Coming", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/173/173.mp3", tags: ["ambient"] },
  { title: "Lonerism", artist: "Alejandro Magaña", url: "https://assets.mixkit.co/music/159/159.mp3", tags: ["minimal", "ambient"] },
  { title: "Sci-Fi Score", artist: "Arulo", url: "https://assets.mixkit.co/music/464/464.mp3", tags: ["sci-fi", "ambient"] },
  // --- Added layer tracks ---
  { title: "Neon Skyline", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/626/626.mp3", tags: ["ambient", "techno"] },
  { title: "Digital Mirage", artist: "Eugenio Mininni", url: "https://assets.mixkit.co/music/627/627.mp3", tags: ["ambient"] },
  { title: "Night Drive", artist: "Arulo", url: "https://assets.mixkit.co/music/396/396.mp3", tags: ["ambient"] },
  { title: "Retro Future", artist: "Arulo", url: "https://assets.mixkit.co/music/397/397.mp3", tags: ["sci-fi", "ambient"] },
  { title: "Dream Sequence", artist: "Andrew Ev", url: "https://assets.mixkit.co/music/189/189.mp3", tags: ["ambient"] }
];
const CHAT_ENDPOINT = null; // Static site - no API
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
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const preferred = voices.find((v) => /en/i.test(v.lang) && /female|woman|zira|samantha|victoria/i.test(v.name))
    || voices.find((v) => /en/i.test(v.lang))
    || voices[0];
  return preferred || null;
}

function speakIfEnabled(state, text) {
  if (!state.voiceEnabled) return;
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return;

  // Speech often requires a user gesture; this will be a no-op if blocked.
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.92;
  utter.pitch = 0.92;
  utter.volume = 0.95;

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
  // Static site fallback - provide helpful local responses
  if (!CHAT_ENDPOINT) {
    const lastMsg = conversation[conversation.length - 1]?.content?.toLowerCase() || "";
    
    const responses = {
      help: "I can help you navigate Matrix Hub:\n\n• Run deal scanner\n• Refresh daily drops\n• Play/pause music\n• Generate art\n• Manage tasks with /tasks\n\nJust ask!",
      greeting: "Welcome to Matrix Hub. I am here to assist you.\n\nTry commands like:\n- 'run deal scanner'\n- 'refresh daily drops'\n- 'play music'\n- '/tasks' to manage your list",
      deals: "To access deals:\n• Say 'refresh daily drops' for latest offers\n• Say 'run deal scanner' to scan for deals\n• Check the Deal Scanner section on the page",
      music: "Music Player controls:\n• 'play music' - Start playback\n• 'pause music' - Pause\n• 'next track' - Skip forward\n• 'previous track' - Go back",
      art: "To generate art:\n• Scroll to the Art Generator section\n• Say 'open art generator'\n• Or say 'generate art' to create",
      telegram: "Join our Telegram channel @matrixhuborg for:\n• Exclusive deals\n• Community updates\n• Real-time notifications\n\nScroll down to the Telegram section!",
      mtx: "⚡ MTX SYSTEM FLOW — HOW IT POWERS SITE GROWTH\n\n1. ENTRY (FREE → MTX)\n• Site is usable without MTX\n• MTX unlocks deeper layers\n• No hard paywalls — only progression\nResult: Low friction, high retention\n\n2. ACTION → REWARD\nUsers earn MTX by:\n• Creating accounts\n• Using tools\n• Testing beta features\n• Reporting issues (GitHub → MTX rewards)\nResult: Activity becomes growth fuel\n\n3. MTX AS FUEL (NOT STORAGE)\nMTX is consumed by:\n• Advanced tools\n• Compute-heavy actions\n• Priority queues\n• Experimental modules\nResult: Constant circulation, no hoarding\n\n4. FEEDBACK LOOP\nUSE → EARN → UNLOCK → BUILD → REPEAT\n• Usage increases value\n• Value attracts contributors\n• Contributors build modules\n• Modules increase usage\nResult: Self-reinforcing ecosystem\n\n5. GITHUB INTEGRATION\nTie MTX to GitHub actions:\n• PR merged → MTX reward\n• Bug labeled 'confirmed' → MTX reward\n• Feature accepted → MTX grant\nResult: Developers are directly incentivized\n\n6. FUTURE EXPANSION PATH\nMTX later enables:\n• Plugin marketplace\n• App-to-app payments\n• Partner integrations\n• DAO-lite governance\nOnly after real usage exists.\n\n🧠 DESIGN RULES\n• MTX never required for basic access\n• MTX never marketed as profit\n• MTX only unlocks real function\n• Growth follows usage, not hype\n\nSYSTEM GROWS BY USE.\nMTX FLOWS WHERE SIGNAL EXISTS.",
      default: "I understand. Try these commands:\n• 'help' for assistance\n• 'refresh daily drops'\n• 'run deal scanner'\n• 'play music'\n• '/tasks' to manage tasks"
    };
    
    if (/\b(hi|hello|hey|greetings)\b/i.test(lastMsg)) {
      return responses.greeting;
    } else if (/\b(help|what can you do|commands)\b/i.test(lastMsg)) {
      return responses.help;
    } else if (/\b(deal|discount|offer|drop)\b/i.test(lastMsg)) {
      return responses.deals;
    } else if (/\b(music|song|play|track)\b/i.test(lastMsg)) {
      return responses.music;
    } else if (/\b(art|image|picture|generate)\b/i.test(lastMsg)) {
      return responses.art;
    } else if (/\b(telegram|channel|community)\b/i.test(lastMsg)) {
      return responses.telegram;
    } else if (/\b(mtx|matrix-hubcoin|matrixhubcoin|coin|crypto|currency|token|earn|reward)\b/i.test(lastMsg)) {
      return responses.mtx;
    } else {
      return responses.default;
    }
  }
  
  // Original API call (not used in static deployment)
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
      const greet = "The door is already open.\n\nTry: “run deal scanner”, “refresh daily drops”, “play music”, or “/tasks”.";
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
