import { useState, useEffect, useRef } from "react";

const MOODS = [
  { id: 5, emoji: "😄", label: "Great", color: "#22c55e", bg: "#f0fdf4" },
  { id: 4, emoji: "🙂", label: "Good", color: "#84cc16", bg: "#f7fee7" },
  { id: 3, emoji: "😐", label: "Okay", color: "#eab308", bg: "#fefce8" },
  { id: 2, emoji: "😔", label: "Low", color: "#f97316", bg: "#fff7ed" },
  { id: 1, emoji: "😢", label: "Rough", color: "#ef4444", bg: "#fef2f2" },
];

const TAGS = [
  "stress", "school", "friends", "family", "sports",
  "sleep", "food", "loneliness", "anxiety", "joy",
  "motivation", "tired", "love", "work", "hobbies"
];

const TIPS = [
  { icon: "🌬️", title: "4-7-8 Breathing", desc: "Inhale 4s, hold 7s, exhale 8s. Repeat 3-4 times to calm down instantly." },
  { icon: "🚶", title: "5-Minute Walk", desc: "A short walk outside resets your thoughts and lowers cortisol levels." },
  { icon: "📵", title: "Digital Detox", desc: "Leave your phone 30 minutes before sleep for better rest quality." },
  { icon: "💧", title: "Hydration", desc: "Dehydration directly affects mood. Drink a glass of water right now." },
  { icon: "🎵", title: "Music Therapy", desc: "Play your favourite song. Music changes brain chemistry in just 3 minutes." },
  { icon: "✍️", title: "Gratitude List", desc: "Each evening write 3 things you're grateful for — rewires your brain." },
  { icon: "🧘", title: "Body Scan", desc: "Close your eyes, notice where you feel tension, breathe into that spot." },
  { icon: "🌿", title: "Nature Break", desc: "Even 10 minutes near trees or grass reduces anxiety by 20% (HBSC data)." },
];

const CRISIS_RESOURCES = [
  { name: "SOS Line Macedonia", number: "0800 1 2345", available: "24/7 free", flag: "🇲🇰" },
  { name: "Mental Health Centre", number: "02 3109 774", available: "Mon-Fri 8-20h", flag: "🇲🇰" },
  { name: "Youth Support Line", number: "0800 77 000", available: "24/7 free", flag: "🇲🇰" },
];

// HBSC-inspired daily quests
const ALL_QUESTS = [
  { id: "q1", icon: "🚶", title: "Move for 30 min", desc: "HBSC: Only 20% of teens meet daily activity goals. Beat the statistic!", xp: 30, category: "physical" },
  { id: "q2", icon: "🛌", title: "Sleep 8+ hours tonight", desc: "HBSC: 40% of teens sleep less than 8 hours. Plan your bedtime tonight.", xp: 25, category: "sleep" },
  { id: "q3", icon: "📵", title: "1 hour screen-free", desc: "HBSC: Teens average 6+ hours of screen time daily. Take a real break.", xp: 20, category: "digital" },
  { id: "q4", icon: "💬", title: "Talk to a friend today", desc: "HBSC: Social connection is the #1 predictor of teen wellbeing.", xp: 15, category: "social" },
  { id: "q5", icon: "🥗", title: "Eat a fruit or vegetable", desc: "HBSC: 68% of teens skip fruits/vegetables daily. Choose better today.", xp: 10, category: "nutrition" },
  { id: "q6", icon: "🌬️", title: "Do the 4-7-8 breathing", desc: "Spend 5 minutes on mindful breathing to reset your nervous system.", xp: 15, category: "mental" },
  { id: "q7", icon: "✍️", title: "Write 3 grateful things", desc: "Gratitude journaling reduces anxiety by up to 27% over 8 weeks.", xp: 15, category: "mental" },
  { id: "q8", icon: "🌿", title: "Spend time in nature", desc: "HBSC: Teens who spend time outdoors report 35% better mental health.", xp: 20, category: "physical" },
  { id: "q9", icon: "📚", title: "Read for 20 minutes", desc: "Reading reduces stress by 68% within 6 minutes (Sussex University).", xp: 15, category: "mental" },
  { id: "q10", icon: "💧", title: "Drink 8 glasses of water", desc: "Mild dehydration causes mood drops and concentration issues.", xp: 10, category: "nutrition" },
  { id: "q11", icon: "🎨", title: "Do something creative", desc: "Draw, write, play music — creative expression boosts dopamine.", xp: 20, category: "mental" },
  { id: "q12", icon: "🤝", title: "Help someone today", desc: "HBSC: Acts of kindness improve the giver's mood for up to 24 hours.", xp: 25, category: "social" },
];

const CATEGORY_COLORS = {
  physical: "#22c55e",
  sleep: "#8b5cf6",
  digital: "#f97316",
  social: "#3b82f6",
  nutrition: "#eab308",
  mental: "#6366f1",
};

const LEVELS = [
  { level: 1, title: "Newcomer", minXp: 0, maxXp: 100 },
  { level: 2, title: "Explorer", minXp: 100, maxXp: 250 },
  { level: 3, title: "Seeker", minXp: 250, maxXp: 450 },
  { level: 4, title: "Grower", minXp: 450, maxXp: 700 },
  { level: 5, title: "Achiever", minXp: 700, maxXp: 1000 },
  { level: 6, title: "Wellness Pro", minXp: 1000, maxXp: 1400 },
  { level: 7, title: "Mind Master", minXp: 1400, maxXp: 9999 },
];

function getLevelInfo(xp) {
  return LEVELS.find((l, i) => xp >= l.minXp && (i === LEVELS.length - 1 || xp < LEVELS[i + 1].minXp)) || LEVELS[0];
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function MindSpace() {
  const [tab, setTab] = useState("home");
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ms_entries") || "[]"); } catch { return []; }
  });
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [saved, setSaved] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hey! I'm Milo, your personal wellness companion 💙\n\nThis is a safe space — tell me how you're feeling, what's on your mind, or just chat. Everything stays between us." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  // Quest / game state
  const [xp, setXp] = useState(() => {
    try { return parseInt(localStorage.getItem("ms_xp") || "0"); } catch { return 0; }
  });
  const [completedQuests, setCompletedQuests] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ms_quests") || "{}"); } catch { return {}; }
  });
  const [xpPopup, setXpPopup] = useState(null);
  const [dailyQuests, setDailyQuests] = useState(() => {
    const today = new Date().toDateString();
    try {
      const saved = JSON.parse(localStorage.getItem("ms_daily_quests") || "null");
      if (saved && saved.date === today) return saved.quests;
    } catch {}
    // Pick 4 random quests for today
    const shuffled = [...ALL_QUESTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map(q => q.id);
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem("ms_entries", JSON.stringify(entries)); } catch {}
  }, [entries]);

  useEffect(() => {
    try { localStorage.setItem("ms_xp", String(xp)); } catch {}
  }, [xp]);

  useEffect(() => {
    try { localStorage.setItem("ms_quests", JSON.stringify(completedQuests)); } catch {}
  }, [completedQuests]);

  useEffect(() => {
    const today = new Date().toDateString();
    try { localStorage.setItem("ms_daily_quests", JSON.stringify({ date: today, quests: dailyQuests })); } catch {}
  }, [dailyQuests]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function saveEntry() {
    if (!selectedMood) return;
    const entry = { id: Date.now(), mood: selectedMood, note, tags: selectedTags, date: new Date().toISOString() };
    setEntries(prev => [entry, ...prev].slice(0, 90));
    // Award XP for logging mood
    awardXP(5, "Mood logged +5 XP");
    setSaved(true);
    setTimeout(() => {
      setSaved(false); setSelectedMood(null); setNote(""); setSelectedTags([]);
      setTab("history");
    }, 1400);
  }

  function awardXP(amount, label) {
    setXp(prev => prev + amount);
    setXpPopup(label);
    setTimeout(() => setXpPopup(null), 2000);
  }

  function completeQuest(questId) {
    const today = new Date().toDateString();
    const key = `${questId}_${today}`;
    if (completedQuests[key]) return;
    const quest = ALL_QUESTS.find(q => q.id === questId);
    setCompletedQuests(prev => ({ ...prev, [key]: true }));
    awardXP(quest.xp, `+${quest.xp} XP earned!`);
  }

  function isQuestDoneToday(questId) {
    const today = new Date().toDateString();
    return !!completedQuests[`${questId}_${today}`];
  }

  async function sendChat() {
    if (!chatInput.trim() || isLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMessages);
    setIsLoading(true);
    const history = newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Milo, an empathetic wellness assistant for young people (11-18 years old). Your role is emotional support, NOT medical diagnosis.

RULES:
- Always respond in English
- Be warm, non-intrusive, understanding
- Use simple language appropriate for teenagers
- Never minimise feelings
- Suggest concrete, small steps (breathing, a pause, talking to someone close)
- If you notice serious signs of crisis (self-harm, suicidal thoughts), gently refer to professional help and mention the SOS line 0800 1 2345 (Macedonia)
- Keep responses short (3-6 sentences) unless the situation requires more
- Occasionally ask one open question to continue the conversation
- Don't be robotic — be natural, warm
- You can use emoji sparingly (1-2 per message)`,
          messages: history
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, something went wrong. Please try again.";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Oops, connection issue. Try again in a moment! 🔄" }]);
    }
    setIsLoading(false);
  }

  const avgMood = entries.length
    ? (entries.slice(0, 7).reduce((s, e) => s + e.mood, 0) / Math.min(entries.length, 7)).toFixed(1)
    : null;

  const moodCounts = MOODS.map(m => ({ ...m, count: entries.filter(e => e.mood === m.id).length }));

  const streakDays = (() => {
    if (!entries.length) return 0;
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const has = entries.some(e => { const ed = new Date(e.date); ed.setHours(0,0,0,0); return ed.getTime() === d.getTime(); });
      if (has) streak++; else if (i > 0) break;
    }
    return streak;
  })();

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0);
    const entry = entries.find(e => { const ed = new Date(e.date); ed.setHours(0,0,0,0); return ed.getTime() === d.getTime(); });
    return { date: d, entry };
  });

  const levelInfo = getLevelInfo(xp);
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.level === levelInfo.level) + 1];
  const xpProgress = nextLevel ? ((xp - levelInfo.minXp) / (nextLevel.minXp - levelInfo.minXp)) * 100 : 100;
  const todayQuestObjects = dailyQuests.map(id => ALL_QUESTS.find(q => q.id === id)).filter(Boolean);
  const todayCompleted = todayQuestObjects.filter(q => isQuestDoneToday(q.id)).length;

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      width: "100vw", maxWidth: "100%",
      minHeight: "100dvh",
      background: "#0f0f1a",
      color: "#e2e8f0",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden"
    }}>

      {/* XP Popup */}
      {xpPopup && (
        <div style={{
          position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white", padding: "8px 20px", borderRadius: 20,
          fontWeight: 700, fontSize: 14, zIndex: 200,
          animation: "fadeUp 2s ease forwards", pointerEvents: "none"
        }}>{xpPopup}</div>
      )}

      {/* Header */}
      <div style={{ padding: "env(safe-area-inset-top, 12px) 16px 0", paddingTop: "max(env(safe-area-inset-top), 12px)", background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🧠</div>
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.5px" }}>Mind<span style={{ color: "#818cf8" }}>Space</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Level badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#1e293b", borderRadius: 20, padding: "4px 10px" }}>
              <span style={{ fontSize: 11 }}>⚡</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#818cf8" }}>Lv.{levelInfo.level}</span>
              <span style={{ fontSize: 11, color: "#475569" }}>{xp} XP</span>
            </div>
            <button onClick={() => setShowCrisis(true)} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "4px 9px", color: "#fca5a5", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>🆘 Help</button>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: "#475569" }}>{levelInfo.title}</span>
            {nextLevel && <span style={{ fontSize: 10, color: "#475569" }}>{nextLevel.minXp - xp} XP to {nextLevel.title}</span>}
          </div>
          <div style={{ height: 4, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(xpProgress, 100)}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e293b", overflowX: "auto" }}>
          {[
            { id: "home", label: "Today", icon: "🏠" },
            { id: "quests", label: "Quests", icon: "⚔️", badge: `${todayCompleted}/${todayQuestObjects.length}` },
            { id: "history", label: "History", icon: "📔" },
            { id: "chat", label: "Chat", icon: "💬" },
            { id: "tips", label: "Tips", icon: "💡" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "8px 10px", fontSize: 12, fontWeight: 500,
              color: tab === t.id ? "#818cf8" : "#475569",
              borderBottom: tab === t.id ? "2px solid #818cf8" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 4, flexShrink: 0
            }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && <span style={{ background: "#4f46e5", borderRadius: 10, padding: "1px 5px", fontSize: 10, color: "#e0e7ff" }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>

        {/* TODAY TAB */}
        {tab === "home" && (
          <div>
            {entries.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Streak", value: `${streakDays} 🔥` },
                  { label: "7-day avg", value: avgMood || "—" },
                  { label: "Entries", value: entries.length },
                ].map(s => (
                  <div key={s.label} style={{ background: "#1e293b", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#e2e8f0" }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {entries.length >= 3 && (
              <div style={{ background: "#1e293b", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Last 7 days</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 44 }}>
                  {last7.map((d, i) => {
                    const h = d.entry ? (d.entry.mood / 5) * 100 : 0;
                    const m = d.entry ? MOODS.find(x => x.id === d.entry.mood) : null;
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ width: "100%", borderRadius: 3, height: `${Math.max(h, 6)}%`, minHeight: d.entry ? 6 : 2, background: m ? m.color : "#1e3a4a", opacity: d.entry ? 1 : 0.3, alignSelf: "flex-end" }} />
                        <div style={{ fontSize: 8, color: "#475569" }}>{["Su","Mo","Tu","We","Th","Fr","Sa"][d.date.getDay()]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ background: "#1e293b", borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>How are you feeling <span style={{ color: "#e2e8f0" }}>today?</span></p>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 5 }}>
                {MOODS.map(m => (
                  <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{
                    flex: 1, background: selectedMood === m.id ? m.bg : "#0f172a",
                    border: `2px solid ${selectedMood === m.id ? m.color : "#1e293b"}`,
                    borderRadius: 10, padding: "9px 2px", cursor: "pointer", transition: "all 0.15s",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3
                  }}>
                    <span style={{ fontSize: 20 }}>{m.emoji}</span>
                    <span style={{ fontSize: 8, color: selectedMood === m.id ? m.color : "#475569", fontWeight: 500 }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedMood && (
              <>
                <div style={{ background: "#1e293b", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>What's affecting your mood? (optional)</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {TAGS.map(tag => (
                      <button key={tag} onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} style={{
                        padding: "4px 9px", borderRadius: 20, fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                        background: selectedTags.includes(tag) ? "#4f46e5" : "#0f172a",
                        border: `1px solid ${selectedTags.includes(tag) ? "#818cf8" : "#334155"}`,
                        color: selectedTags.includes(tag) ? "#e0e7ff" : "#64748b",
                      }}>{tag}</button>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 14, padding: 14, marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Write something (optional)</p>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What's on your mind? How did the day go..." style={{ width: "100%", minHeight: 70, background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: 9, color: "#e2e8f0", fontSize: 12, resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.5, fontFamily: "inherit" }} />
                </div>
                <button onClick={saveEntry} style={{ width: "100%", padding: "13px", background: saved ? "#16a34a" : "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, cursor: "pointer", color: "white", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
                  {saved ? "✓ Saved! +5 XP" : "Save entry"}
                </button>
              </>
            )}

            {!entries.length && !selectedMood && (
              <div style={{ textAlign: "center", padding: "28px 0", color: "#475569" }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>💙</div>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>Welcome to MindSpace.<br />Start each day with one mood entry.</p>
              </div>
            )}
          </div>
        )}

        {/* QUESTS TAB */}
        {tab === "quests" && (
          <div>
            {/* Level card */}
            <div style={{ background: "linear-gradient(135deg, #1e1b4b, #1e293b)", border: "1px solid #4f46e5", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 500, marginBottom: 2 }}>YOUR LEVEL</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>Lv.{levelInfo.level} — {levelInfo.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#818cf8" }}>{xp} XP</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>total earned</div>
                </div>
              </div>
              <div style={{ height: 6, background: "#0f172a", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(xpProgress, 100)}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 3, transition: "width 0.5s" }} />
              </div>
              {nextLevel && <div style={{ fontSize: 10, color: "#475569", marginTop: 4, textAlign: "right" }}>{nextLevel.minXp - xp} XP until {nextLevel.title}</div>}
            </div>

            {/* HBSC info */}
            <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12, padding: "10px 13px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 600, marginBottom: 3 }}>📊 About these quests</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>Each quest is inspired by HBSC (Health Behaviour in School-aged Children) research data. Complete them to earn XP and build healthy habits that research shows actually work.</div>
            </div>

            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, fontWeight: 500 }}>Today's quests — {todayCompleted}/{todayQuestObjects.length} done</div>

            {todayQuestObjects.map(quest => {
              const done = isQuestDoneToday(quest.id);
              const catColor = CATEGORY_COLORS[quest.category] || "#6366f1";
              return (
                <div key={quest.id} style={{ background: done ? "#0f2a1a" : "#1e293b", border: `1px solid ${done ? "#16a34a40" : "#334155"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: done ? "#16a34a20" : `${catColor}20`, border: `1px solid ${done ? "#16a34a40" : `${catColor}40`}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{done ? "✅" : quest.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#86efac" : "#e2e8f0" }}>{quest.title}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: catColor }}>+{quest.xp} XP</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, marginBottom: done ? 0 : 8 }}>{quest.desc}</div>
                      {!done && (
                        <button onClick={() => completeQuest(quest.id)} style={{ background: `${catColor}20`, border: `1px solid ${catColor}40`, borderRadius: 8, padding: "5px 12px", color: catColor, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                          Mark as done ✓
                        </button>
                      )}
                      {done && <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>Completed today! 🎉</div>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* All quests section */}
            <div style={{ fontSize: 12, color: "#64748b", margin: "20px 0 10px", fontWeight: 500 }}>All quests ({ALL_QUESTS.length})</div>
            {ALL_QUESTS.map(quest => {
              const done = isQuestDoneToday(quest.id);
              const catColor = CATEGORY_COLORS[quest.category] || "#6366f1";
              return (
                <div key={quest.id} style={{ background: "#1e293b", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, opacity: done ? 0.6 : 1 }}>
                  <span style={{ fontSize: 18 }}>{done ? "✅" : quest.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{quest.title}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{quest.category}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: catColor }}>+{quest.xp} XP</div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div>
            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>📔</div>
                <p>No entries yet.<br />Start with today!</p>
              </div>
            ) : (
              <>
                <div style={{ background: "#1e293b", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>Mood distribution</div>
                  {moodCounts.filter(m => m.count > 0).map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{ width: 20, textAlign: "center", fontSize: 14 }}>{m.emoji}</span>
                      <div style={{ flex: 1, height: 5, background: "#0f172a", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 3, background: m.color, width: `${(m.count / entries.length) * 100}%`, transition: "width 0.5s" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#64748b", minWidth: 16, textAlign: "right" }}>{m.count}</span>
                    </div>
                  ))}
                </div>
                {entries.map(entry => {
                  const m = MOODS.find(x => x.id === entry.mood);
                  return (
                    <div key={entry.id} style={{ background: "#1e293b", borderRadius: 10, padding: "11px 12px", marginBottom: 8, borderLeft: `3px solid ${m?.color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 18 }}>{m?.emoji}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: m?.color }}>{m?.label}</span>
                        </div>
                        <span style={{ fontSize: 10, color: "#475569" }}>{formatDate(entry.date)}</span>
                      </div>
                      {entry.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: entry.note ? 5 : 0 }}>
                          {entry.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: "#0f172a", borderRadius: 20, color: "#64748b", border: "1px solid #334155" }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {entry.note && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{entry.note}</p>}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 200px)", minHeight: 350 }}>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginRight: 7, marginTop: 2 }}>🧠</div>
                  )}
                  <div style={{ maxWidth: "78%", background: msg.role === "user" ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#1e293b", borderRadius: msg.role === "user" ? "13px 13px 3px 13px" : "13px 13px 13px 3px", padding: "9px 12px", fontSize: 13, lineHeight: 1.6, color: "#e2e8f0" }}>
                    {msg.content.split("\n").map((line, j) => <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🧠</div>
                  <div style={{ background: "#1e293b", borderRadius: "13px 13px 13px 3px", padding: "9px 13px", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 150, 300].map(delay => (
                      <div key={delay} style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366f1", animation: "bounce 1s infinite", animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: 7, paddingTop: 8 }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()} placeholder="How are you feeling..." style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 11, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
              <button onClick={sendChat} disabled={isLoading || !chatInput.trim()} style={{ background: chatInput.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#1e293b", border: "none", borderRadius: 11, padding: "0 15px", cursor: chatInput.trim() ? "pointer" : "default", color: "white", fontSize: 17 }}>→</button>
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {tab === "tips" && (
          <div>
            <div style={{ background: "#1a1a2e", border: "1px solid #4f46e5", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: "#818cf8", marginBottom: 5 }}>📊 HBSC Research Highlights</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7 }}>
                • 28% of teens feel stressed <em>every single day</em><br/>
                • Only 20% meet recommended daily physical activity<br/>
                • 40% sleep less than 8 hours on school nights<br/>
                • Teens with strong social connections report 2x better wellbeing<br/>
                <span style={{ color: "#475569", fontSize: 10 }}>Source: HBSC International Study, WHO</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, fontWeight: 500 }}>EVIDENCE-BASED TIPS</div>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: 11, padding: "12px 14px", marginBottom: 9, display: "flex", alignItems: "flex-start", gap: 11 }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, color: "#e2e8f0" }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crisis Modal */}
      {showCrisis && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", zIndex: 100 }} onClick={() => setShowCrisis(false)}>
          <div style={{ background: "#1e293b", borderRadius: "18px 18px 0 0", padding: "20px 16px", paddingBottom: "max(env(safe-area-inset-bottom), 20px)", width: "100%", maxWidth: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 32, height: 4, background: "#334155", borderRadius: 2, margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0", marginBottom: 5 }}>Asking for help is brave</h3>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14, lineHeight: 1.6 }}>If you're going through a tough time, these lines are here for you — free, confidential and available.</p>
            {CRISIS_RESOURCES.map((r, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 11, padding: "11px 13px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#e2e8f0", marginBottom: 2 }}>{r.flag} {r.name}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{r.available}</div>
                </div>
                <a href={`tel:${r.number.replace(/\s/g, "")}`} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 11px", color: "#fca5a5", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{r.number}</a>
              </div>
            ))}
            <button onClick={() => setShowCrisis(false)} style={{ width: "100%", marginTop: 6, padding: 11, background: "#334155", border: "none", borderRadius: 11, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
        @keyframes fadeUp { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 80% { opacity: 1; } 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder, input::placeholder { color: #334155; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        html, body { height: 100%; overflow: hidden; background: #0f0f1a; }
      `}</style>
    </div>
  );
}
