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
- The only external call is to the Anthropic API (`https://api.anthropic.com/v1/messages`, model `claude-sonnet-4-20250514`) for the AI chat feature (Milo the companion)
- The API key is read from `import.meta.env.VITE_ANTHROPIC_API_KEY` (set in `.env`)

**Single-component design.** Nearly all UI and logic lives in [src/mindspace.jsx](src/mindspace.jsx) (~623 lines). `App.jsx` is just a thin wrapper that renders `<MindSpace />`.

### Key Features and State

| Feature | localStorage key | Description |
|---|---|---|
| Mood log | `ms_entries` | Array of `{id, mood, tags, note, timestamp}` |
| XP points | `ms_xp` | Integer, drives level progression (7 levels) |
| Quest completion | `ms_quests` | Which weekly/monthly quests are done |
| Daily quests | `ms_daily_quests` | Daily challenge state with date-based reset |

Level thresholds and quest XP rewards are defined as constants near the top of `mindspace.jsx`.

### Styling

Inline React styles throughout — no CSS framework. Global styles in `src/index.css` (dark theme, `100dvh` for mobile viewport). The color palette is manually consistent: `#6366f1` (indigo), `#8b5cf6` (purple), `#22c55e` (green), `#f97316` (orange), `#0f0f1a` (bg).

### API Call Pattern

The Claude API is called directly from the browser in the chat handler inside `mindspace.jsx`. The system prompt contains Milo's persona and safe-messaging guidelines for teen mental health.
