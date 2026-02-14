# SoulSync — Student Mental Wellness Space

> SoulSync is a lightweight React + Vite app that helps students express mood, find peer matches, and access support resources. It integrates a Gemini-backed AI service for conversational support and mood analysis.

## Key Features

- Mood selection and dashboard visualization
- Community message wall and peer matching
- Support chat powered by a Gemini API service (see `services/geminiService.ts`)
- Modular React components for quick extension: `components/MoodDashboard.tsx`, `components/SupportChat.tsx`, `components/MatchingSection.tsx`

## Tech Stack

- React (TypeScript) + Vite
- Tailwind CSS (via CDN in `index.html`)
- Recharts for charts
- Google Gemini API (via `@google/genai`)

## Quick Start

Prerequisites: Node.js (16+ recommended)

1. Install dependencies

```bash
npm install
```

2. Create a local environment file

Create a `.env.local` file in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
# Optionally set other env vars here
```

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000/ in your browser.

4. Build for production

```bash
npm run build
```

5. Preview a production build locally

```bash
npm run preview
```

## Important Files & Structure

- `index.html` — app entry HTML (Tailwind included via CDN)
- [`index.tsx`](index.tsx) — application bootstrap
- [`App.tsx`](App.tsx) — top-level app container
- `components/` — UI components (Header, MoodDashboard, MatchingSection, MessageWall, SupportChat, MoodSelector)
- `services/geminiService.ts` — Gemini API wrapper and AI integrations
- `constants.tsx`, `types.ts` — shared types and constants
- `vite.config.ts`, `tsconfig.json` — project configuration

See the folder listing in the repo root for the full layout.

## Gemini / AI Integration

The app uses a small wrapper in `services/geminiService.ts` to call the Gemini API (via `@google/genai`). Ensure `GEMINI_API_KEY` is set in `.env.local` before starting the dev server. Keep the key secret; do not commit `.env.local` to source control.

## Development Notes

- The project is TypeScript-first. Fix any type errors with `tsc` or your editor's TypeScript server.
- Vite provides fast HMR during development.
- Tailwind is included via CDN in `index.html` for simplicity — consider local Tailwind setup for production use.

## Troubleshooting

- If the app build fails with an HTML parse error, inspect `index.html` for mismatched tags. Example: an extra `</style>` can break `vite build`.
- If you see API auth errors, verify your `GEMINI_API_KEY` and network access.

## Contributing

1. Fork the repo and create a feature branch
2. Open a PR with a clear description and screenshots where helpful

## License & Credits

This project is provided as-is. Add a license file if you plan to open-source the project.
