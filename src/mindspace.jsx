import { useEffect, useMemo, useRef, useState } from "react";

const COLORS = {
  cream: "#FFFBF2",
  white: "#FFFFFF",
  coral: "#FF6F61",
  coralDark: "#E85A4F",
  text: "#24212B",
  muted: "#746B7E",
  line: "#EFE4D6",
  amber: "#FFE7A8",
  mint: "#B9F2E5",
  lavender: "#DCD3FF",
  pink: "#FFD6E0",
  green: "#CFF7D3",
  sky: "#CDEBFF",
  blue: "#AFCBFF",
};

const MOODS = [
  { id: "great", emoji: "😄", mk: "Одлично", color: "#22C55E", score: 5, advice: ["Продолжи со тоа што денес ти носи енергија.", "Запиши што ти помогна денес — ќе ти користи и утре.", "Сподели мала добра работа со некој близок."] },
  { id: "calm", emoji: "🙂", mk: "Мирно", color: "#14B8A6", score: 4, advice: ["Ова е добар момент за кратка прошетка или омилена песна.", "Зачувај ја оваа рутина — мирните денови се важни.", "Направи нешто креативно 5 минути."] },
  { id: "okay", emoji: "😐", mk: "Океј", color: "#EAB308", score: 3, advice: ["Избери една мала задача и заврши ја без притисок.", "Океј ден е сосема валиден ден.", "Пробај 2 минути фокус игра за полесен старт."] },
  { id: "sad", emoji: "😔", mk: "Тажно", color: "#8B5CF6", score: 2, advice: ["Напиши 3 мали работи што барем малку биле добри.", "Прати порака на личност на која ѝ веруваш.", "Пробај топла порака или нежна музика."] },
  { id: "stress", emoji: "😟", mk: "Стрес", color: "#EF4444", score: 1, advice: ["Пробај 4 бавни вдишувања и пауза од екранот.", "Подели ја задачата на најмал следен чекор.", "Направи дишечка вежба 2 минути."] },
  { id: "confidence", emoji: "🌟", mk: "Самодоверба", color: "#F97316", score: 4, advice: ["Напиши една работа што денес ја направи добро.", "Не мора да биде совршено — важно е што пробуваш.", "Кажи си: 'Можам да одам чекор по чекор'."] },
];

const WARM_MESSAGES = [
  "Денес не мора да бидеш совршена/совршен — доволно е да бидеш присутна/присутен.",
  "Еден мал чекор е сепак напредок.",
  "Ти вредиш и кога денот не оди по план.",
  "Пауза не е откажување, пауза е грижа за себе.",
  "Денес избери нешто нежно за себе.",
  "Не мора сè да решиш одеднаш.",
  "Твоите чувства имаат смисла, дури и кога се збунувачки.",
  "Почни со најмалата можна добра одлука.",
  "Добро е да побараш помош кога ти треба.",
  "И тешките денови поминуваат.",
  "Диши бавно — телото сака знак дека си безбедно.",
  "Ти си повеќе од еден лош момент.",
  "Денес пробај да бидеш свој најдобар другар.",
  "Не споредувај го твојот ден со туѓ highlight.",
  "Малку вода, малку воздух, малку пауза — почеток е.",
  "Секоја нова навика почнува со една мала повторена работа.",
  "Можеш да кажеш 'не' без да бидеш лоша/лош.",
  "Твоето темпо е валидно.",
  "Не си сама/сам во тоа што го чувствуваш.",
  "Напредокот понекогаш изгледа како одмор.",
  "Денес најди една мала причина за насмевка.",
  "Ти не си твојата грешка.",
  "Смирен разговор може да реши повеќе од брза реакција.",
  "Секој ден е нова шанса да се грижиш за себе.",
  "Малите победи се вистински победи.",
  "Кога е многу, врати се на едноставно: диши, вода, чекор.",
  "Ти е дозволено да растеш полека.",
  "Добрина кон себе не е слабост.",
  "Денес пробај да забележиш што ти помогна.",
  "Сè што чувствуваш може да се каже со свои зборови.",
  "Утре може да биде полесно, а денес само направи мал чекор.",
];

const ACTIVITIES = [
  { id: "breath", icon: "🌬️", title: "Дишечка вежба", time: "2 мин", bg: COLORS.mint },
  { id: "balloon", icon: "🎈", title: "Следи го балонот", time: "1 мин", bg: COLORS.lavender },
  { id: "gratitude", icon: "✨", title: "Благодарна листа", time: "3 мин", bg: COLORS.pink },
  { id: "scenario", icon: "🧩", title: "Сценарио избор", time: "3 мин", bg: COLORS.green },
  { id: "memory", icon: "🃏", title: "Меморија парови", time: "2 мин", bg: COLORS.sky },
  { id: "plan", icon: "🪴", title: "Мој мал план", time: "2 мин", bg: COLORS.amber },
  { id: "tap", icon: "⚡", title: "Брз фокус", time: "45 сек", bg: COLORS.blue },
  { id: "colors", icon: "🎨", title: "Најди ја бојата", time: "1 мин", bg: COLORS.pink },
  { id: "kind", icon: "💌", title: "Топла порака", time: "1 мин", bg: COLORS.green },
  { id: "confidence", icon: "🌟", title: "Самодоверба чекор", time: "2 мин", bg: COLORS.amber },
];

const EXTRA_TIPS = [
  "Кога си под стрес, прво смири го телото, па решавај го проблемот.",
  "Кога си тажна/тажен, не мора веднаш да се развеселиш — само направи нешто нежно.",
  "За фокус: 10 минути работа + 2 минути пауза е подобро од ништо.",
  "За самодоверба: запиши доказ дека си успеала/успеал барем во нешто мало.",
  "За пријателства: користи реченици со 'Јас се почувствував...' наместо обвинување.",
  "За сон: направи еден мал вечерен ритуал што се повторува.",
  "За мотивација: почни со задача што трае помалку од 5 минути.",
  "За дигитална рамнотежа: остави телефон 15 минути и забележи како се чувствуваш.",
];

const TIP_GROUPS = [
  {
    title: "Кога чувствуваш стрес",
    icon: "🌬️",
    items: [
      "Прво смири го телото: направи 4 бавни вдишувања.",
      "Подели ја задачата на еден мал следен чекор.",
      "Направи кратка пауза од екранот и напиј се вода.",
    ],
  },
  {
    title: "Кога си тажна/тажен",
    icon: "💛",
    items: [
      "Не мора веднаш да се развеселиш — пробај нешто нежно.",
      "Запиши три мали работи што денес биле барем малку добри.",
      "Прати порака на личност на која ѝ веруваш.",
    ],
  },
  {
    title: "За фокус и учење",
    icon: "🎯",
    items: [
      "Работи 10 минути, па направи 2 минути пауза.",
      "Тргни една работа што ти го одзема вниманието.",
      "Почни со најлесниот дел за да влезеш во ритам.",
    ],
  },
  {
    title: "За самодоверба",
    icon: "🌟",
    items: [
      "Запиши еден доказ дека денес си се потрудила/потрудил.",
      "Не мора да биде совршено — важно е што пробуваш.",
      "Кажи си: ‘Можам чекор по чекор’."
    ],
  },
  {
    title: "За пријателства",
    icon: "🤝",
    items: [
      "Почни со ‘Јас се почувствував...’ наместо со обвинување.",
      "Ако си вознемирена/вознемирен, почекај малку пред да одговориш.",
      "Разговорот е полесен кога прашуваш смирено што се случило.",
    ],
  },
];

const PLAN_OPTIONS = [
  { label: "Ми треба смирување", advice: "Пробај 4 бавни вдишувања и избери една мала работа што можеш да ја направиш сега." },
  { label: "Ми треба фокус", advice: "Стави тајмер на 10 минути и работи само на една задача. Потоа направи кратка пауза." },
  { label: "Ми треба самодоверба", advice: "Запиши една работа што ја направи добро денес. Малите докази градат самодоверба." },
  { label: "Ми треба разговор", advice: "Избери личност на која ѝ веруваш и почни со: ‘Сакам да ти кажам нешто што ми тежи.’" },
];

const SORT_THOUGHTS = [
  { text: "Имам тест утре и треба да повторам.", suggested: "Важно сега", feedback: "Ова е добра мисла за 'Важно сега' затоа што има конкретна задача што можеш да ја започнеш со мал чекор." },
  { text: "Некој не ми врати порака веднаш.", suggested: "Може да почека", feedback: "Ова најчесто може да почека. Не мора веднаш да претпоставиш нешто лошо." },
  { text: "Врне дожд и не можам да излезам надвор.", suggested: "Не е моја контрола", feedback: "Ова не е во твоја контрола. Можеш да избереш што ќе направиш дома, но не и времето." },
  { text: "Треба да ја средам собата.", suggested: "Важно сега", feedback: "Ова може да стане мал чекор: намести кревет или среди една маса, не мора цела соба одеднаш." },
  { text: "Се грижам што мислат другите за мене.", suggested: "Може да почека", feedback: "Оваа мисла може да почека. Корисно е да се прашаш: дали имам доказ или само претпоставка?" },
  { text: "Имам домашна за утре.", suggested: "Важно сега", feedback: "Ова е важно сега затоа што има рок. Почни со најлесниот дел за да влезеш во ритам." },
  { text: "Другарка ми беше чудна денес.", suggested: "Може да почека", feedback: "Може да почека додека не се смириш. Подоцна можеш смирено да прашаш што се случило." },
  { text: "Не можам да променам што се случило вчера.", suggested: "Не е моја контрола", feedback: "Минатото не е во твоја контрола. Во твоја контрола е следниот мал чекор денес." },
];

function formatEntryTime(date) {
  return new Date(date).toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" });
}

const DEFAULT_PROFILE = { nick: "Јована", avatar: "🦊" };

function normalizeEmail(email) {
  return String(email || "guest@demo.local").trim().toLowerCase();
}

function userKey(email, key) {
  return `mindspace_${normalizeEmail(email)}_${key}`;
}

function loadUserData(email) {
  const safeEmail = normalizeEmail(email);
  return {
    profile: load(userKey(safeEmail, "profile"), { ...DEFAULT_PROFILE }),
    entries: load(userKey(safeEmail, "entries"), []),
    loginDays: load(userKey(safeEmail, "loginDays"), []),
    gratitudes: load(userKey(safeEmail, "gratitudes"), []),
    xp: load(userKey(safeEmail, "xp"), 0),
  };
}

function saveUserData(email, key, value) {
  if (!email) return;
  save(userKey(email, key), value);
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function dayKey(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function formatStreak(n) {
  if (n === 1) return "1 ден по ред";
  return `${n} денови по ред`;
}
function getStreak(entries, loginDays = []) {
  const unique = new Set([
    ...entries.map(e => dayKey(e.date)),
    ...loginDays
  ]);
  unique.add(dayKey());
  let count = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (unique.has(dayKey(d))) count += 1;
    else break;
  }
  return Math.max(count, 1);
}
function todayWarmMessage() {
  const d = new Date().getDate();
  return WARM_MESSAGES[(d - 1) % WARM_MESSAGES.length];
}

async function askGemini(text, history) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("Нема VITE_GEMINI_API_KEY во .env");
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError = "";
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "Ти си Другар AI, топол wellness асистент за млади. Одговарај кратко, на македонски, практично и без дијагнози." }] },
          ...history.slice(-6).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
          { role: "user", parts: [{ text }] },
        ],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Не добив текст од Gemini.";
    lastError = `Gemini ${model}: ${res.status} ${data?.error?.message || res.statusText}`;
    if (res.status !== 404) break;
  }
  throw new Error(lastError || "Gemini не одговори.");
}

async function askOpenAI(text, history) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) throw new Error("Нема VITE_OPENAI_API_KEY во .env");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ти си Другар AI, топол wellness асистент за млади. Одговарај кратко, на македонски, практично и без дијагнози." },
        ...history.slice(-8),
        { role: "user", content: text },
      ],
      max_tokens: 350,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${data?.error?.message || res.statusText}`);
  return data?.choices?.[0]?.message?.content || "Не добив текст од OpenAI.";
}

function localReply(text) {
  const v = text.toLowerCase();
  if (v.includes("стрес") || v.includes("нерв") || v.includes("stress")) return "Изгледа дека денес има напнатост. Пробај 4 бавни вдишувања, па избери само еден мал следен чекор. Не мора сè да решиш одеднаш.";
  if (v.includes("таж") || v.includes("осамен") || v.includes("sad")) return "Жал ми е што ти е тешко. Напиши една мала работа што ти донесе барем малку мир, или јави се на личност на која ѝ веруваш.";
  if (v.includes("самодовер") || v.includes("confidence")) return "Самодовербата се гради со докази. Запиши една мала работа што ја направи добро денес, колку и да изгледа мала.";
  return "Те слушам. Кажи ми уште малку што се случи, а во меѓувреме пробај еден мал чекор: вода, дишење или кратка пауза.";
}

export default function MindSpace() {
  const [screen, setScreen] = useState("splash");
  const [authMode, setAuthMode] = useState("login");
  const [auth, setAuth] = useState({ name: "", email: "", pass: "", pass2: "" });
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE });
  const [entries, setEntries] = useState([]);
  const [loginDays, setLoginDays] = useState([]);
  const [gratitudes, setGratitudes] = useState([]);
  const [xp, setXp] = useState(0);
  const [tab, setTab] = useState("home");
  const [selectedMood, setSelectedMood] = useState(null);
  const [result, setResult] = useState(null);
  const [game, setGame] = useState(null);
  const [toast, setToast] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", content: "Здраво, јас сум Другар AI. Кажи ми што ти е на ум 💛" }]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => { const id = setTimeout(() => setScreen("auth"), 1800); return () => clearTimeout(id); }, []);
  useEffect(() => saveUserData(user?.email, "entries", entries), [entries, user]);
  useEffect(() => saveUserData(user?.email, "loginDays", loginDays), [loginDays, user]);
  useEffect(() => saveUserData(user?.email, "gratitudes", gratitudes), [gratitudes, user]);
  useEffect(() => saveUserData(user?.email, "xp", xp), [xp, user]);
  useEffect(() => saveUserData(user?.email, "profile", profile), [profile, user]);
  useEffect(() => chatEnd.current?.scrollIntoView({ behavior: "smooth" }), [chatMessages, chatOpen]);

  const streak = useMemo(() => getStreak(entries, loginDays), [entries, loginDays]);
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayEntries = entries.filter(e => dayKey(e.date) === dayKey(d));
      const avg = dayEntries.length ? dayEntries.reduce((s, e) => s + e.score, 0) / dayEntries.length : 0;
      return { date: d, avg, count: dayEntries.length };
    });
  }, [entries]);

  function loginDemo(provider = "email", overrideEmail = null) {
    const email = normalizeEmail(overrideEmail || auth.email || `${provider}@demo.local`);
    const saved = loadUserData(email);
    const today = dayKey();
    const updatedLoginDays = saved.loginDays.includes(today)
      ? saved.loginDays
      : [today, ...saved.loginDays].slice(0, 365);

    setProfile(saved.profile);
    setEntries(saved.entries);
    setGratitudes(saved.gratitudes);
    setXp(saved.xp);
    setLoginDays(updatedLoginDays);
    setUser({ email, name: saved.profile.nick || auth.name || DEFAULT_PROFILE.nick });

    saveUserData(email, "loginDays", updatedLoginDays);
    setScreen("app");
  }
  function register() {
    if (!auth.name || !auth.email || !auth.pass || auth.pass !== auth.pass2) {
      setToast("Провери име, е-пошта и лозинки.");
      setTimeout(() => setToast(""), 1600);
      return;
    }
    const email = normalizeEmail(auth.email);
    const users = load("ms_users_v7", {});
    users[email] = { name: auth.name, pass: auth.pass };
    save("ms_users_v7", users);
    saveUserData(email, "profile", { ...DEFAULT_PROFILE, nick: auth.name });
    saveUserData(email, "entries", []);
    saveUserData(email, "gratitudes", []);
    saveUserData(email, "loginDays", []);
    saveUserData(email, "xp", 0);
    setProfile(p => ({ ...p, nick: auth.name }));
    setAuth(a => ({ ...a, email }));
    setToast("Профилот е креиран. Сега најави се.");
    setAuthMode("login");
    setTimeout(() => setToast(""), 1600);
  }
  function loginWithPassword() {
    const email = normalizeEmail(auth.email);
    const users = load("ms_users_v7", {});
    if (!users[email] || users[email].pass !== auth.pass) {
      setToast("Е-поштата или лозинката не се точни.");
      setTimeout(() => setToast(""), 1600);
      return;
    }
    setAuth(a => ({ ...a, email, name: users[email].name || a.name }));
    loginDemo("email", email);
  }
  function logout() {
    setUser(null);
    setProfile({ ...DEFAULT_PROFILE });
    setEntries([]);
    setLoginDays([]);
    setGratitudes([]);
    setXp(0);
    setScreen("auth");
    setTab("home");
    setSelectedMood(null);
    setResult(null);
    setGame(null);
  }
  function addXP(amount, label) {
    setXp(v => v + amount);
    setToast(label);
    setTimeout(() => setToast(""), 1400);
  }
  function saveMood(moodId) {
    const mood = MOODS.find(m => m.id === moodId);
    if (!mood) return;
    const entry = { id: Date.now(), date: new Date().toISOString(), mood: mood.id, score: mood.score };
    setEntries(prev => [entry, ...prev].slice(0, 200));
    setResult({ type: "mood", mood: mood.id, advice: mood.advice[Math.floor(Math.random() * mood.advice.length)] });
    addXP(10, "+10 XP за внесено чувство");
    setScreen("result");
  }
  async function sendChat() {
    const msg = chatInput.trim();
    if (!msg || aiLoading) return;
    setChatInput("");
    const next = [...chatMessages, { role: "user", content: msg }];
    setChatMessages(next);
    setAiLoading(true);
    try {
      let reply;
      if (import.meta.env.VITE_GEMINI_API_KEY) reply = await askGemini(msg, next);
      else if (import.meta.env.VITE_OPENAI_API_KEY) reply = await askOpenAI(msg, next);
      else reply = localReply(msg);
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `${e.message}\n\nFallback: ${localReply(msg)}` }]);
    }
    setAiLoading(false);
  }

  if (screen === "splash") return <div style={styles.page}><div style={styles.center}><Buddy size={108} /><h1 style={styles.logo}>Мој Другар</h1><p style={styles.muted}>За твоето добро расположение 🌤️</p></div></div>;

  if (screen === "auth") return <div style={styles.page}>{toast && <Toast>{toast}</Toast>}<div style={{ maxWidth: 520, margin: "45px auto" }}><Card><Buddy /><h1 style={styles.title}>{authMode === "login" ? "Добре дојде назад 👋" : "Да се запознаеме 🌱"}</h1>{authMode === "register" && <Input placeholder="Име" value={auth.name} onChange={v => setAuth({ ...auth, name: v })} />}<Input placeholder="Е-пошта" value={auth.email} onChange={v => setAuth({ ...auth, email: v })} /><Input type="password" placeholder="Лозинка" value={auth.pass} onChange={v => setAuth({ ...auth, pass: v })} />{authMode === "register" && <Input type="password" placeholder="Потврди лозинка" value={auth.pass2} onChange={v => setAuth({ ...auth, pass2: v })} />}<Button onClick={authMode === "login" ? loginWithPassword : register}>{authMode === "login" ? "Најави се" : "Создај профил"}</Button><p style={styles.or}>или</p><Button ghost onClick={() => loginDemo("google")}>Продолжи со Google</Button><Button ghost onClick={() => loginDemo("apple")}>Продолжи со Apple</Button><p style={styles.textSmall}>{authMode === "login" ? "Немаш профил? " : "Веќе имаш профил? "}<button style={styles.link} onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? "Регистрирај се" : "Најави се"}</button></p></Card></div></div>;

  if (screen === "result") {
    const mood = MOODS.find(m => m.id === result?.mood) || MOODS[2];
    const randomTip = EXTRA_TIPS[(Date.now() + mood.score) % EXTRA_TIPS.length];
    return <div style={styles.page}>{toast && <Toast>{toast}</Toast>}<Header title="Резултат" onBack={() => setScreen("app")} /><Buddy mood={mood.id} /><Card><h2>Денес избра: <span style={{ color: mood.color }}>{mood.emoji} {mood.mk}</span></h2><p style={styles.text}>{result?.advice}</p></Card><Card><h2>Уште еден совет</h2><p style={styles.text}>{randomTip}</p></Card><Card style={{ background: COLORS.amber }}><h2>Предлог активност</h2><p>{mood.id === "stress" ? "🌬️ Дишечка вежба" : mood.id === "sad" ? "✨ Благодарна листа" : mood.id === "confidence" ? "🌟 Самодоверба чекор" : "🎈 Следи го балонот"}</p><Button onClick={() => { setGame(mood.id === "stress" ? "breath" : mood.id === "sad" ? "gratitude" : mood.id === "confidence" ? "confidence" : "balloon"); setScreen("game"); }}>Започни</Button></Card><Button ghost onClick={() => setChatOpen(true)}>Сподели со Другар AI</Button>{chatOpen && <Chat chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} loading={aiLoading} close={() => setChatOpen(false)} chatEnd={chatEnd} />}</div>;
  }

  if (screen === "game") return <Game game={game} setScreen={setScreen} addXP={addXP} gratitudes={gratitudes} setGratitudes={setGratitudes} />;

  return <div style={styles.page}>{toast && <Toast>{toast}</Toast>}<div style={styles.appTop}><div><p style={styles.muted}>{new Date().toLocaleDateString("mk-MK", { weekday: "long", day: "numeric", month: "long" })}</p><h1 style={styles.title}>Здраво, {profile.nick} 👋</h1></div><button style={styles.avatar} onClick={() => setTab("profile")}>{profile.avatar}</button></div><main style={styles.scroll}>{tab === "home" && <Home selectedMood={selectedMood} setSelectedMood={setSelectedMood} saveMood={saveMood} streak={streak} xp={xp} entries={entries} />} {tab === "games" && <Games setGame={setGame} setScreen={setScreen} />} {tab === "calendar" && <Calendar entries={entries} last7={last7} />} {tab === "tips" && <Tips />} {tab === "profile" && <Profile profile={profile} setProfile={setProfile} xp={xp} streak={streak} entries={entries} logout={logout} />}</main><Tabs tab={tab} setTab={setTab} /><button style={styles.chatFab} onClick={() => setChatOpen(true)}>💬</button>{chatOpen && <Chat chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} loading={aiLoading} close={() => setChatOpen(false)} chatEnd={chatEnd} />}</div>;
}

function Home({ selectedMood, setSelectedMood, saveMood, streak, xp, entries }) {
  const progress = Math.min((xp % 100), 100);
  const latestEntries = entries.slice(0, 4);
  return <><Card style={{ background: COLORS.amber }}><h2>{formatStreak(streak)}</h2><p style={styles.text}>Твојот дневен напредок и XP.</p><div style={styles.progress}><div style={{ ...styles.progressFill, width: `${progress}%` }} /></div><p style={styles.muted}>{xp} XP · следен беџ на секои 100 XP</p></Card><Card><h2>Како се чувствуваш денес?</h2><div style={styles.moodGrid}>{MOODS.map(m => <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{ ...styles.moodBtn, borderColor: selectedMood === m.id ? m.color : COLORS.line, background: selectedMood === m.id ? `${m.color}18` : COLORS.white }}><span>{m.emoji}</span><b>{m.mk}</b></button>)}</div><Button disabled={!selectedMood} onClick={() => saveMood(selectedMood)}>Зачувај чувство</Button></Card>{latestEntries.length > 0 && <Card><h2>Последни внесови</h2>{latestEntries.map(e => { const mood = MOODS.find(m => m.id === e.mood); return <p key={e.id} style={styles.text}>{mood?.emoji} {mood?.mk} · {new Date(e.date).toLocaleDateString("mk-MK")} во {formatEntryTime(e.date)}</p>; })}</Card>}<Card style={{ background: COLORS.green }}><h2>Топла порака за денес</h2><p style={styles.text}>{todayWarmMessage()}</p></Card></>;
}
function Games({ setGame, setScreen }) { return <><h1 style={styles.title}>Игри и активности 🎮</h1><div style={styles.gameGrid}>{ACTIVITIES.map(a => <button key={a.id} style={{ ...styles.gameCard, background: a.bg }} onClick={() => { setGame(a.id); setScreen("game"); }}><span>{a.icon}</span><b>{a.title}</b><small>{a.time}</small></button>)}</div></>; }
function Calendar({ entries, last7 }) {
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const month = now.toLocaleDateString("mk-MK", { month: "long", year: "numeric" });
  const entriesByDay = useMemo(() => {
    const map = {};
    for (const e of entries) {
      const d = new Date(e.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(e);
      }
    }
    return map;
  }, [entries]);
  return <>
    <h1 style={styles.title}>Календар</h1>
    <Card>
      <h2 style={{ textTransform: "capitalize" }}>{month}</h2>
      <div style={styles.calendarGrid}>
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const list = entriesByDay[day] || [];
          const avg = list.length ? Math.round(list.reduce((s, e) => s + e.score, 0) / list.length) : 0;
          const mood = MOODS.find(m => Math.round(m.score) === avg);
          return <div key={day} style={{ ...styles.day, background: mood ? `${mood.color}35` : COLORS.cream, borderColor: mood ? mood.color : COLORS.line }}>
            <b>{day}</b>{list.length > 0 && <small>{list.length}</small>}
          </div>;
        })}
      </div>
    </Card>
    <Card>
      <h2>Последни 7 денови</h2>
      <div style={styles.last7Bars}>
        {last7.map((d, i) => {
          const label = d.date.toLocaleDateString("mk-MK", { weekday: "short" });
          const mood = d.avg ? MOODS.reduce((best, m) => Math.abs(m.score - d.avg) < Math.abs(best.score - d.avg) ? m : best, MOODS[0]) : null;
          const height = d.count ? Math.max(24, Math.min(100, d.count * 18 + d.avg * 8)) : 8;
          return <div key={i} style={styles.last7BarItem}>
            <small style={styles.last7Label}>{label}</small>
            <div style={styles.last7BarTrack}>
              <div style={{
                ...styles.last7Bar,
                height: `${height}%`,
                background: mood ? mood.color : COLORS.line,
                opacity: d.count ? 1 : 0.35
              }}>
                {d.count > 0 && <span style={styles.last7Count}>{d.count}</span>}
              </div>
            </div>
          </div>;
        })}
      </div>
    </Card>
  </>;
}
function Tips() {
  return <>
    <h1 style={styles.title}>Совети</h1>
    {TIP_GROUPS.map(group => (
      <Card key={group.title}>
        <h2>{group.icon} {group.title}</h2>
        {group.items.map(item => <p key={item} style={styles.tipItem}>• {item}</p>)}
      </Card>
    ))}
  </>;
}
function Profile({ profile, setProfile, xp, streak, entries, logout }) {
  const badges = Math.floor(xp / 100);
  return <><div style={styles.profileHead}><div style={styles.bigAvatar}>{profile.avatar}</div><h1>{profile.nick}</h1><p style={styles.muted}>{formatStreak(streak)} · {entries.length} внесови · {xp} XP</p></div><Card><h2>Напредок</h2><div style={styles.progress}><div style={{ ...styles.progressFill, width: `${xp % 100}%` }} /></div><p style={styles.text}>Секое чувство носи 10 XP, секоја завршена игра носи XP. На секои 100 XP добиваш беџ.</p></Card><Card><h2>Беџови</h2><div style={styles.badgeGrid}>{Array.from({ length: 8 }, (_, i) => <span key={i} style={{ ...styles.badge, opacity: i < badges ? 1 : .35 }}>{i < badges ? "🏅" : "🔒"} Беџ {i + 1}</span>)}</div></Card><Card><h2>Аватар</h2><div style={styles.chips}>{["🦊", "🐸", "🐱", "🐼", "🐰", "🦉"].map(a => <button key={a} style={styles.chip} onClick={() => setProfile({ ...profile, avatar: a })}>{a}</button>)}</div></Card><Button ghost onClick={logout}>Одјави се</Button></>;
}
function Tabs({ tab, setTab }) { return <nav style={styles.tabs}>{[["home", "🏠", "Дома"], ["games", "🧩", "Игри"], ["calendar", "📅", "Календар"], ["tips", "💡", "Совети"], ["profile", "👤", "Профил"]].map(t => <button key={t[0]} onClick={() => setTab(t[0])} style={{ ...styles.tab, color: tab === t[0] ? COLORS.coral : COLORS.muted }}><span>{t[1]}</span><small>{t[2]}</small></button>)}</nav>; }
function Game({ game, setScreen, addXP, gratitudes, setGratitudes }) {
  const [breath, setBreath] = useState(0);
  const [grat, setGrat] = useState(["", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState(() => ["🌙", "🌙", "🌿", "🌿", "⭐", "⭐", "🎵", "🎵"].sort(() => Math.random() - .5));
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  useEffect(() => { if (game !== "breath") return; const id = setInterval(() => setBreath(v => v + 1), 1000); return () => clearInterval(id); }, [game]);

  useEffect(() => {
    if (game !== "memory" || open.length !== 2) return;
    const [first, second] = open;
    const id = setTimeout(() => {
      if (cards[first] === cards[second]) {
        setMatched(prev => Array.from(new Set([...prev, first, second])));
      }
      setOpen([]);
    }, 750);
    return () => clearTimeout(id);
  }, [open, cards, game]);

  const finish = (label = "Игра завршена") => { addXP(15, "+15 XP · " + label); setScreen("app"); };
  const phase = breath % 10 < 4 ? "Вдиши" : breath % 10 < 6 ? "Задржи" : "Издиши";
  if (game === "breath") return <div style={styles.page}><Header title="Дишечка вежба" onBack={() => setScreen("app")} /><div style={styles.center}><div style={{ ...styles.breath, transform: `scale(${phase === "Вдиши" ? 1.22 : phase === "Издиши" ? .86 : 1.05})` }}>{phase}</div><p>{Math.floor(breath / 10) + 1} / 6 циклуси</p><Button onClick={() => finish("дишење")}>Завршив</Button></div></div>;
  if (game === "balloon") return <div style={styles.page}><Header title="Следи го балонот" onBack={() => setScreen("app")} /><div style={styles.balloonBox}><div style={styles.movingBalloon}>🎈</div></div><p style={styles.text}>Следи го балонот со поглед. Кога вниманието ќе избега, нежно врати го назад.</p><Button onClick={() => finish("фокус")}>Завршив</Button></div>;
  if (game === "gratitude") return <div style={styles.page}><Header title="Благодарна листа" onBack={() => setScreen("app")} />{grat.map((g, i) => <Input key={i} placeholder={`${i + 1}. Нешто добро денес...`} value={g} onChange={v => setGrat(grat.map((x, idx) => idx === i ? v : x))} />)}<Button onClick={() => { const clean = grat.filter(x => x.trim()); if (clean.length) setGratitudes([{ id: Date.now(), date: new Date().toISOString(), items: clean }, ...gratitudes]); finish("благодарност"); }}>Зачувај</Button><Card><h2>Претходно зачувано</h2>{gratitudes.length ? gratitudes.slice(0, 5).map(g => <p key={g.id} style={styles.text}>• {g.items.join(" · ")}</p>) : <p style={styles.text}>Сè уште нема зачувани листи.</p>}</Card></div>;
  if (game === "scenario") return <div style={styles.page}><Header title="Сценарио избор" onBack={() => setScreen("app")} /><Card><h2>Другар те игнорира во групен чет. Што правиш?</h2>{["Прашувам смирено што се случило", "Чекам да се смирам прво", "Зборувам со возрасен ако ме повредува"].map((x, i) => <Button key={x} ghost onClick={() => setFeedback(["Ова е директен и зрел избор.", "Добро е прво да се смириш пред реакција.", "Добар избор кога ситуацијата те повредува подолго."][i])}>{x}</Button>)}{feedback && <p style={styles.text}>{feedback}</p>}</Card><Button onClick={() => finish("сценарио")}>Заврши</Button></div>;
  if (game === "memory") return <div style={styles.page}><Header title="Меморија парови" onBack={() => setScreen("app")} /><div style={styles.memory}>{cards.map((c, i) => {
    const visible = open.includes(i) || matched.includes(i);
    return <button
      key={i}
      style={{ ...styles.memCard, opacity: matched.includes(i) ? 0.75 : 1 }}
      onClick={() => {
        if (visible || open.length >= 2) return;
        setOpen(o => [...o, i]);
      }}
    >
      {visible ? c : "?"}
    </button>;
  })}</div><Button onClick={() => finish("меморија")}>Завршив</Button></div>;
  if (game === "tap") return <div style={styles.page}><Header title="Брз фокус" onBack={() => setScreen("app")} /><div style={styles.center}><button style={styles.tapBtn} onClick={() => setScore(score + 1)}>Тапни</button><h1>{score}</h1><p style={styles.text}>Тапни 20 пати за краток фокус reset.</p><Button onClick={() => finish("брз фокус")}>Завршив</Button></div></div>;
  if (game === "plan") return <div style={styles.page}><Header title="Мој мал план" onBack={() => setScreen("app")} /><Card><h2>Што ти треба денес?</h2><p style={styles.text}>Избери една опција и апликацијата ќе ти даде краток совет со мал следен чекор.</p>{PLAN_OPTIONS.map(x => <Button key={x.label} ghost onClick={() => setFeedback(x.advice)}>{x.label}</Button>)}{feedback && <div style={styles.adviceBox}>{feedback}</div>}</Card><Button onClick={() => finish("мал план")}>Заврши</Button></div>;
  if (game === "colors") return <div style={styles.page}><Header title="Најди ја бојата" onBack={() => setScreen("app")} /><Card><h2>Најди нешто околу тебе во оваа боја:</h2><div style={{ ...styles.colorPrompt, background: [COLORS.coral, COLORS.mint, COLORS.lavender, COLORS.amber][score % 4] }} /><Button onClick={() => setScore(score + 1)}>Најдов</Button></Card><Button onClick={() => finish("боја")}>Заврши</Button></div>;
  if (game === "kind") return <div style={styles.page}><Header title="Топла порака" onBack={() => setScreen("app")} /><Card style={{ background: COLORS.green }}><h2>Порака</h2><p style={styles.text}>{todayWarmMessage()}</p></Card><Button onClick={() => finish("топла порака")}>Зачувај како прочитано</Button></div>;
  if (game === "confidence") return <div style={styles.page}><Header title="Самодоверба чекор" onBack={() => setScreen("app")} /><Card><h2>Доврши ја реченицата:</h2><p style={styles.text}>Денес сум горда/горд на себе затоа што...</p><Input placeholder="Мал доказ за себе..." value={feedback} onChange={setFeedback} /></Card><Button onClick={() => finish("самодоверба")}>Зачувај</Button></div>;
  return null;
}
function Chat({ chatMessages, chatInput, setChatInput, sendChat, loading, close, chatEnd }) { return <div style={styles.overlay}><div style={styles.chat}><div style={styles.chatHead}><b>Другар AI</b><button style={styles.link} onClick={close}>✕</button></div><div style={styles.chatBody}>{chatMessages.map((m, i) => <div key={i} style={{ ...styles.msg, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? COLORS.coral : COLORS.cream, color: COLORS.text }}>{m.content}</div>)}{loading && <div style={styles.msg}>Другар пишува...</div>}<div ref={chatEnd} /></div><div style={styles.chatInput}><input style={styles.input} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Пиши му на Другар..." /><button style={styles.send} onClick={sendChat}>Испрати</button></div></div></div>; }
function Buddy({ size = 78, mood }) { const face = mood === "sad" ? "🥺" : mood === "stress" ? "😟" : "😊"; return <div style={{ width: size, height: size, borderRadius: "34% 46% 38% 42%", background: `linear-gradient(135deg, ${COLORS.coral}, #FF9A76)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .45, margin: "0 auto 14px", boxShadow: "0 18px 40px #ff6f6130" }}>{face}</div>; }
function Card({ children, style }) { return <div style={{ ...styles.card, ...style }}>{children}</div>; }
function Button({ children, onClick, ghost, disabled }) { return <button disabled={disabled} onClick={onClick} style={{ ...styles.button, ...(ghost ? styles.ghostButton : {}), ...(disabled ? styles.disabled : {}) }}>{children}</button>; }
function Input({ value, onChange, placeholder, type = "text" }) { return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={styles.inputBox} />; }
function Header({ title, onBack }) { return <div style={styles.header}><button style={styles.back} onClick={onBack}>←</button><h2>{title}</h2><span /></div>; }
function Toast({ children }) { return <div style={styles.toast}>{children}</div>; }

const styles = {
  page: { minHeight: "100dvh", background: COLORS.cream, color: COLORS.text, fontFamily: "Inter, system-ui, Arial, sans-serif", padding: 18, boxSizing: "border-box", position: "relative" },
  center: { minHeight: "75dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
  logo: { fontSize: 38, margin: "8px 0", letterSpacing: -1 }, title: { fontSize: 27, lineHeight: 1.05, margin: "8px 0 12px", letterSpacing: -1 },
  text: { color: COLORS.muted, lineHeight: 1.55, fontSize: 15 }, textSmall: { color: COLORS.muted, textAlign: "center" }, muted: { color: COLORS.muted, fontSize: 13, margin: 0 },
  card: { background: COLORS.white, border: `1px solid ${COLORS.line}`, borderRadius: 26, padding: 18, marginBottom: 14, boxShadow: "0 16px 44px #40362410" },
  button: { width: "100%", border: 0, background: COLORS.coral, color: "white", borderRadius: 18, padding: "14px 18px", fontWeight: 800, fontSize: 15, marginTop: 10, cursor: "pointer", boxShadow: "0 12px 26px #ff6f6133" },
  ghostButton: { background: COLORS.white, color: COLORS.text, border: `1px solid ${COLORS.line}`, boxShadow: "none" }, disabled: { opacity: .45, cursor: "not-allowed" },
  inputBox: { width: "100%", border: `1px solid ${COLORS.line}`, outline: 0, background: COLORS.white, borderRadius: 16, padding: 14, fontSize: 14, boxSizing: "border-box", color: COLORS.text, margin: "8px 0" },
  input: { width: "100%", border: 0, outline: 0, background: "transparent", padding: "8px 10px", margin: 0, fontSize: 14, boxSizing: "border-box", color: COLORS.text, letterSpacing: 0, lineHeight: 1.25 }, link: { border: 0, background: "transparent", color: COLORS.coral, fontWeight: 900, cursor: "pointer" },
  or: { textAlign: "center", color: COLORS.muted, margin: "14px 0 4px" }, appTop: { display: "flex", justifyContent: "space-between", alignItems: "center" }, avatar: { width: 50, height: 50, borderRadius: 20, border: 0, background: COLORS.white, fontSize: 25, boxShadow: "0 10px 25px #00000012" },
  scroll: { height: "calc(100dvh - 145px)", overflowY: "auto", paddingBottom: 96 }, tabs: { position: "fixed", left: 12, right: 12, bottom: 12, height: 68, background: COLORS.white, borderRadius: 28, border: `1px solid ${COLORS.line}`, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", boxShadow: "0 18px 50px #00000018", zIndex: 5 }, tab: { border: 0, background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontWeight: 800, cursor: "pointer" },
  progress: { height: 10, background: "#FFF5D6", borderRadius: 99, overflow: "hidden", marginTop: 12 }, progressFill: { height: "100%", background: COLORS.coral, borderRadius: 99 }, moodGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }, moodBtn: { border: `2px solid ${COLORS.line}`, borderRadius: 20, padding: 14, background: COLORS.white, display: "flex", flexDirection: "column", gap: 5, alignItems: "center", cursor: "pointer" },
  gameGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }, gameCard: { border: 0, borderRadius: 24, padding: 16, minHeight: 120, textAlign: "left", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", color: COLORS.text },
  calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 7 }, day: { minHeight: 44, borderRadius: 14, border: `1px solid ${COLORS.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 },
  chart: { height: 145, display: "flex", alignItems: "end", gap: 10, paddingTop: 16 }, chartCol: { flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "end", gap: 5 }, chartBar: { width: "100%", background: COLORS.coral, borderRadius: "10px 10px 4px 4px", minHeight: 4 },
  profileHead: { textAlign: "center", padding: 14 }, bigAvatar: { width: 92, height: 92, borderRadius: 34, background: COLORS.white, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, boxShadow: "0 12px 35px #00000012" }, badgeGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }, badge: { background: COLORS.cream, borderRadius: 14, padding: 10, fontWeight: 800 }, chips: { display: "flex", flexWrap: "wrap", gap: 8 }, chip: { border: `1px solid ${COLORS.line}`, background: COLORS.white, borderRadius: 999, padding: "9px 13px", cursor: "pointer", fontSize: 22 },
  chatFab: { position: "fixed", right: 22, bottom: 92, width: 56, height: 56, borderRadius: 22, border: 0, background: COLORS.coral, color: "white", fontSize: 24, boxShadow: "0 15px 35px #ff6f6144", zIndex: 6, cursor: "pointer" }, overlay: { position: "fixed", inset: 0, background: "#00000044", zIndex: 20, display: "flex", alignItems: "flex-end", justifyContent: "center" }, chat: { width: "100%", maxWidth: 540, height: "82dvh", background: COLORS.white, borderRadius: "28px 28px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }, chatHead: { padding: 16, display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.line}` }, chatBody: { flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#FFF9EF" }, msg: { maxWidth: "84%", padding: "10px 12px", borderRadius: 18, whiteSpace: "pre-wrap", lineHeight: 1.28, fontSize: 14, letterSpacing: 0 }, chatInput: { display: "flex", gap: 6, padding: 8, borderTop: `1px solid ${COLORS.line}`, alignItems: "center" }, send: { border: 0, borderRadius: 16, padding: "0 14px", height: 40, background: COLORS.coral, color: "white", fontWeight: 800, flexShrink: 0 },
  header: { display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center", marginBottom: 12 }, back: { width: 40, height: 40, borderRadius: 16, border: `1px solid ${COLORS.line}`, background: COLORS.white, fontSize: 20, cursor: "pointer" }, toast: { position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", background: COLORS.text, color: "white", padding: "10px 18px", borderRadius: 999, zIndex: 40 },
  breath: { width: 210, height: 210, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.mint}, #71D8C6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, transition: "transform 1s ease", boxShadow: "0 25px 60px #49cbb244" }, balloonBox: { height: 360, background: COLORS.white, borderRadius: 28, border: `1px solid ${COLORS.line}`, position: "relative", overflow: "hidden", marginBottom: 14 }, movingBalloon: { position: "absolute", fontSize: 70, animation: "moveBalloon 7s ease-in-out infinite" }, memory: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }, memCard: { height: 74, border: `1px solid ${COLORS.line}`, borderRadius: 18, background: COLORS.white, fontSize: 28 }, tapBtn: { width: 160, height: 160, borderRadius: "50%", border: 0, background: COLORS.coral, color: "white", fontWeight: 900, fontSize: 24, boxShadow: "0 18px 40px #ff6f6144" }, colorPrompt: { height: 130, borderRadius: 24, margin: "10px 0" },
  last7Bars: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6, width: "100%", height: 150, overflow: "hidden", alignItems: "end" },
  last7BarItem: { minWidth: 0, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 5 },
  last7Label: { color: COLORS.muted, fontSize: 10, fontWeight: 800, textTransform: "capitalize" },
  last7BarTrack: { width: "100%", height: 105, background: COLORS.cream, border: `1px solid ${COLORS.line}`, borderRadius: 14, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", padding: 3, boxSizing: "border-box" },
  last7Bar: { width: "100%", minHeight: 8, borderRadius: "10px 10px 8px 8px", display: "flex", alignItems: "flex-start", justifyContent: "center", transition: "height .25s ease", position: "relative" },
  last7Count: { position: "absolute", top: -9, width: 20, height: 20, borderRadius: 99, background: COLORS.white, border: `1px solid ${COLORS.line}`, color: COLORS.text, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 5px 12px #00000012" },
  tipItem: { color: COLORS.muted, lineHeight: 1.45, fontSize: 15, margin: "8px 0" },
  adviceBox: { background: COLORS.cream, border: `1px solid ${COLORS.line}`, borderRadius: 18, padding: 14, marginTop: 12, color: COLORS.text, lineHeight: 1.45, fontWeight: 700 },
};

const style = document.createElement("style");
style.innerHTML = `@keyframes moveBalloon { 0%{left:8%;top:70%;transform:scale(1)} 20%{left:65%;top:50%;transform:scale(1.08)} 40%{left:28%;top:18%;transform:scale(.95)} 60%{left:75%;top:12%;transform:scale(1.05)} 80%{left:12%;top:38%;transform:scale(.98)} 100%{left:8%;top:70%;transform:scale(1)} }`;
if (typeof document !== "undefined" && !document.getElementById("mindspace-v7-keyframes")) { style.id = "mindspace-v7-keyframes"; document.head.appendChild(style); }
