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
3. `src/data/terminalContent.ts` (long-form copy: about, skills, help, contact) or `src/data/terminalMessages.ts` (short status/error strings, some as functions taking an argument). Both are keyed by language, so **every string needs an `en` and an `es` entry**.

Easter-egg commands live in `src/hooks/useEasterEggs.ts` and are spread into the `commands` object; that hook also owns the visual-effect flags (`digitalRainMode`, `isSnowing`, `isGlitching`) and the Konami sequence tracker.

**`executeCommand` special-cases some inputs before the map lookup**: `show project <name>` (prefix parse), `download resume` and `connect` (both call `window.open`), `back`, and `cls`. Everything else falls through to `commands[lowerInput]`, then to a not-found message.

**Command output is `string[]`, rendered line by line with a 150ms stagger** (`addCommandToHistory`). Each `Command` carries a `crypto.randomUUID()` `id` and the staggered updates target that id — never the last array element, since the user can submit another command mid-reveal and the entries would interleave. Keep that invariant if you touch the history updates.

`executeCommand` clears `isProcessing` *before* awaiting the reveal, then awaits it. So the input stays responsive while lines print, but the returned promise only settles once the command has finished printing. `runTour` depends on that to chain `TOUR_COMMANDS` (`about me` → `skills` → `show projects`) without their outputs overlapping — it backs the "Show me everything" button that `MainTerminal` renders as an empty state for visitors who will not type.

`CommandOutputRenderer` scans those lines for marker syntax and swaps in a real table:

```
TABLE:<title>
HEADERS:<col> | <col>
<cell> | <cell>
END_TABLE
```

Blank line or `END_TABLE` closes the block. This is how `skills` and similar commands produce tables — write the markers into the data file, don't build JSX.

**Sound is synthesized, not sampled.** `useSoundEffects` builds each effect from Web Audio oscillators; there are no audio assets. The `AudioContext` is a module-level singleton shared by every caller of the hook and is resumed on demand, since the autoplay policy starts it suspended. `useEasterEggs(soundEnabled)` takes the mute flag as an argument — it has no other way to reach that state, which lives in `useTerminal`.

**Keyboard ownership is split and easy to break.** `useTerminal.handleKeyDown` owns ↑/↓ (command history), Tab (completion), Esc and Enter. `Shift+Tab` is deliberately *not* intercepted so keyboard users can move focus out of the input. Do not add a competing `document`-level key listener — an earlier one in `Suggestions` fought the history navigation.

**Visual effects** (`src/components/effects/`) are full-screen overlays toggled by an `isActive` prop from `useTerminal`.

**The site is bilingual (en/es) without an i18n library.** `src/i18n.ts` holds the `Language` type, the UI chrome strings, and a React context; `useTerminal` owns the `language` state and `App` publishes it through `LanguageProvider`. Components read copy with `useUi()`. Content lives beside the data it belongs to: `terminalContent[lang]`, `terminalMessages[lang]`, and `getProjects(lang)` — which merges each project's language-independent fields (id, tech, status, year, links) with its `en`/`es` block.

Three rules when touching this:
- Command names are never translated. `help`, `show projects` and `lang es` are commands, like `ls`. Only their *descriptions* in the help table are.
- Anything that reads a project must take the language: `findProjectByName(name, lang)`, `getCommandSuggestions(input, lang)`. `useTerminal` stores `selectedProjectId`, not the project object, so switching language re-localises the open project instead of leaving a stale one in state.
- `Project['status']` stays `'Production' | 'Beta' | 'Development'` because it drives badge colours and the type union; the translated label comes from `ui.statusLabels[status]`.

Initial language resolves in this order: **the URL path** (`/my-portfolio/es/` forces Spanish), then a saved `localStorage` choice, then `navigator.language`, then English. The URL wins because it is what a crawler, a shared link, or an hreflang hit is asking for. Already-printed command output keeps the language it was printed in — history is history.

**There are two build entry points, and hreflang depends on them.** `index.html` (English) and `es/index.html` (Spanish) are both listed in `build.rollupOptions.input`, producing `dist/index.html` and `dist/es/index.html` — two real crawlable URLs, which is the whole reason hreflang can work on a static host. Consequences:

- Any `<head>` change must be made in **both** files. They each carry a self-referencing `canonical` plus the full `hreflang` set (`en`, `es`, `x-default`), localized title/description/OG, and their own OG image (`og-image.png` / `og-image-es.png`).
- Switching language in-app does not reload; it `replaceState`s the URL to match and sets `document.title` by hand (`persistLanguage`), because the served `<head>` belongs to whichever document loaded.
- `public/sitemap.xml` lists both URLs with their `xhtml:link` alternates. Update it if a URL is ever added or renamed.

**The indexable content is generated, never hand-written.** The terminal renders nothing until a visitor types a command, so both HTML files would otherwise ship an empty page. `scripts/seo-html.ts` builds a semantic block (`h1`, sections, one `<article>` per project, contact links) from the *same* `terminalContent` and `getProjects` the app uses, and the `inject-seo-content` plugin in `vite.config.ts` splices it in after `<div id="root"></div>` — in dev as well as build. Never edit the block by hand; change the data and it regenerates.

Two properties it must keep: it lives **outside `#root`** so React never unmounts it, and it is hidden with the **clip pattern, not `display:none`** — the text has to stay in the accessibility tree, since it doubles as the only screen-reader-usable version of the portfolio.

Because that script is imported by `vite.config.ts`, everything it reaches must stay free of runtime `@/` imports (the config is bundled before aliases exist). That is why `projects.ts` inlines its `status` literals instead of importing a constant, and why `scripts/seo-html.ts` keeps its own copy of the status labels rather than importing `src/i18n.ts`, which would drag React into the config bundle.

**Reduced motion is honoured in two layers.** A blanket `@media (prefers-reduced-motion: reduce)` block in `src/index.css` neutralises every CSS animation and transition (the always-on flicker and scanlines are the reason it exists). GSAP is JavaScript and escapes that, so entrance animations are guarded at their call sites with `prefersReducedMotion()` — `MainTerminal`, `WelcomeMessage` and `ProjectDetail`. Any new GSAP animation needs its own guard. The canvas easter eggs (snow, digital rain) are left running: the user typed a command to summon them.

## Conventions

- `@/` aliases `src/` (configured in both `vite.config.ts` and the `paths` entry in `tsconfig.json`).
- `src/types/terminal.d.ts` declares `Command`, `Project`, `TableData`, etc. as **global ambient types** — do not import them. `src/types/ui.d.ts` holds exported component prop interfaces and is imported normally.
- Biome enforces tabs, single quotes, no semicolons, 100-char lines, and a custom import-group order (packages → `@/utils` → `@/components` → `@/hooks` → types, blank line between groups). Run `pnpm format` rather than hand-arranging imports.
- Tailwind v4 via `@tailwindcss/vite`, but `src/index.css` still pulls in the legacy `tailwind.config.js` with `@config`. Theme-specific utilities (`glow`, `flicker`, `pipboy-bg`, `pipboy-card`, `scanlines`) are defined in `src/index.css`.
- Scrolling in both terminals is native `overflow-y: auto`. Lenis was removed — the main terminal's smooth scroll had never worked (`App.tsx` imported `useLenis` from `lenis/react`, which needs a `ReactLenis` provider that did not exist) and both init paths leaked an uncancelled `requestAnimationFrame` loop.

## Known dead scaffolding

- `src/components/effects/RainEffect.tsx` is not imported anywhere.
- `useGsapAnimations.ts` exports several animation helpers but only `ProjectDetail` consumes the hook.
- `terminalHelpers.ts` exports `validateCommand` and `formatTimestamp` (unused) and `shouldPlaySound`, which is an identity function called ~15 times.
