# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
npm run lint      # ESLint (flat config, React hooks + refresh plugins)
```

## Architecture

MindSpace is a React + Vite SPA — a mental wellness companion targeted at teenagers (11–18).

**No backend.** The entire app runs client-side:
- All state is persisted in `localStorage` (keys prefixed with `ms_`)
- The only external call is to the Groq API (`https://api.groq.com/openai/v1/chat/completions`, model `llama-3.3-70b-versatile`) for the AI chat feature (Milo the companion)
- The API key is read from `import.meta.env.VITE_GROQ_API_KEY` (set in `.env`, never committed)

**Single-component design.** Nearly all UI and logic lives in [src/mindspace.jsx](src/mindspace.jsx). `App.jsx` is just a thin wrapper that renders `<MindSpace />`.

### Key Features and State

| Feature | localStorage key | Description |
|---|---|---|
| Mood log | `ms_entries` | Array of `{id, mood, tags, note, timestamp}` |
| XP points | `ms_xp` | Integer, drives level progression (7 levels) |
| Quest completion | `ms_quests` | Which weekly/monthly quests are done |
| Daily quests | `ms_daily_quests` | Daily challenge state with date-based reset |
| GAD-7 history | `ms_gad7` | Array of `{id, date, score, severity, answers}` |
| Worry entries | `ms_worries` | Array of `{id, date, worry, likelihood, worst, best, realistic}` |

Level thresholds and quest XP rewards are defined as constants near the top of `mindspace.jsx`. GAD-7 severity thresholds are in `getGad7Severity()`.

### Tabs

7 tabs in order: Today, Quests, History, Chat, Tips, Check-in (GAD-7), Worries (CBT journal).

### Styling

Inline React styles throughout — no CSS framework. Global styles in `src/index.css` (dark theme, `100dvh` for mobile viewport). The color palette is manually consistent: `#6366f1` (indigo), `#8b5cf6` (purple), `#22c55e` (green), `#f97316` (orange), `#0f0f1a` (bg).

### API Call Pattern

The Groq API is OpenAI-compatible. `sendChat()` in `mindspace.jsx` sends a `messages` array with a system prompt (Milo's persona + safe-messaging guidelines) followed by the conversation history. Response is at `data.choices[0].message.content`.
