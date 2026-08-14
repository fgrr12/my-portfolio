# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # vite dev server
pnpm build            # vite build -> dist/ (does NOT type-check)
pnpm preview          # serve the built output
pnpm lint             # biome lint
pnpm format           # biome format --write .
pnpm exec tsc -b      # type-check (run manually; the build skips it)
```

No test suite exists. Package manager is pnpm (`pnpm-workspace.yaml` pins `@tailwindcss/oxide` as the only allowed build dependency); lockfiles are gitignored and CI uses `npm install`.

Deploy: `.github/workflows/ci.yml` builds and publishes to GitHub Pages on every push to `main`. Vite `base` is `/my-portfolio/`, so any hardcoded asset URL must include that prefix.

## Architecture

A single-page fake terminal portfolio. There is no router, no backend, no persisted state — everything lives in React state for the session.

**`src/hooks/useTerminal.ts` is the hub.** It owns all terminal state (input, history, suggestions, open project, sound, language) and the `commands` object mapping command string → `() => string[]`. `App.tsx` destructures its return value and wires it into the presentational components. Adding or changing a command usually means touching three places:

1. `src/constants/terminal.ts` — `COMMANDS.AVAILABLE` / `.HIDDEN` / `.EASTER_EGGS` drive autocomplete, Tab completion, and the quick-command buttons. A command missing here still runs but is undiscoverable.
2. The `commands` object in `useTerminal.ts` — the actual handler.
3. `src/data/terminalContent.ts` (long-form copy: about, skills, help, contact) or `src/data/terminalMessages.ts` (short status/error strings, some as functions taking an argument).

Easter-egg commands live in `src/hooks/useEasterEggs.ts` and are spread into the `commands` object; that hook also owns the visual-effect flags (`digitalRainMode`, `isSnowing`, `isGlitching`) and the Konami sequence tracker.

**`executeCommand` special-cases some inputs before the map lookup**: `show project <name>` (prefix parse), `download resume` and `connect` (both call `window.open`), `back`, and `cls`. Everything else falls through to `commands[lowerInput]`, then to a not-found message.

**Command output is `string[]`, rendered line by line with a 150ms stagger** (`addCommandToHistory`). `CommandOutputRenderer` scans those lines for marker syntax and swaps in a real table:

```
TABLE:<title>
HEADERS:<col> | <col>
<cell> | <cell>
END_TABLE
```

Blank line or `END_TABLE` closes the block. This is how `skills` and similar commands produce tables — write the markers into the data file, don't build JSX.

**Sound is synthesized, not sampled.** `useSoundEffects` builds each effect from Web Audio oscillators; there are no audio assets. Note `useEasterEggs` calls `useSoundEffects` independently, so it holds a second `AudioContext`.

**Visual effects** (`src/components/effects/`) are full-screen overlays toggled by an `isActive` prop from `useTerminal`.

## Conventions

- `@/` aliases `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- `src/types/terminal.d.ts` declares `Command`, `Project`, `TableData`, etc. as **global ambient types** — do not import them. `src/types/ui.d.ts` holds exported component prop interfaces and is imported normally.
- Biome enforces tabs, single quotes, no semicolons, 100-char lines, and a custom import-group order (packages → `@/utils` → `@/components` → `@/hooks` → types, blank line between groups). Run `pnpm format` rather than hand-arranging imports.
- Tailwind v4 via `@tailwindcss/vite`, but `src/index.css` still pulls in the legacy `tailwind.config.js` with `@config`. Theme-specific utilities (`glow`, `flicker`, `pipboy-bg`, `pipboy-card`, `scanlines`) are defined in `src/index.css`, and `.terminal-scroll-area` is the hook `useLenis` looks for when attaching smooth scrolling.

## Known dead scaffolding

- `src/i18n.ts` initializes i18next with `i18next-http-backend`, but no locale files exist and nothing calls `useTranslation`. The `lang en` / `lang es` commands and the `ControlPanel` toggle only flip a state flag; all content is English-only.
- `src/components/effects/RainEffect.tsx` is not imported anywhere.
- `useGsapAnimations.ts` exports several animation helpers but only `ProjectDetail` consumes the hook.
