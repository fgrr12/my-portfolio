# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # vite dev server
pnpm cv               # rebuild, then print the CV PDFs from src/data/cv.ts
pnpm build            # vite build -> dist/ (does NOT type-check)
pnpm preview          # serve the built output
pnpm lint             # biome lint
pnpm format           # biome format --write .
pnpm exec tsc -b      # type-check (run manually; the build skips it)
```

No test suite exists. Package manager is pnpm (`pnpm-workspace.yaml` pins `@tailwindcss/oxide` as the only allowed build dependency); lockfiles are gitignored and CI uses `npm install`.

Deploy: `.github/workflows/ci.yml` builds and publishes to GitHub Pages on every push to `main`. Vite `base` is `/my-portfolio/`, so any hardcoded asset URL must include that prefix.

## Architecture

A portfolio built as a **terminal application**, not as a web page with terminal styling. That distinction drives the whole layout, so keep it: `App.tsx` is an app shell — `TitleBar` (window controls + pane tabs), the active pane, `ActionBar`, `StatusLine` — and the terminal viewport contains *only what the shell printed*. Buttons, status readouts and CTAs live in the chrome. Putting an affordance back inside the scroll area is the one change that undoes the redesign.

There is no router, no backend, no persisted state beyond the language choice — everything lives in React state for the session.

**Design tokens live in `src/index.css`** as CSS custom properties (Tokyo Night). The accents are an information system, not a palette: blue is identity, cyan is location, green is state/success, amber is running, pink is failure, purple is the single brand accent. Never pick one because it looks right in that spot — pick it because of what it means. Components read them via `style={{ color: 'var(--…)' }}` or the semantic classes (`.block`, `.card`, `.chip`, `.action`, `.data-table`, `.status-line`).

Typography is one monospace family end to end, chrome included, which is what a terminal app actually looks like. Hierarchy comes from size, weight and `.label-micro` (uppercase, tracked, muted) — not from a second face.

**The sidebar is a directory listing, not a session list.** `FileTree` renders exactly the entries `ls` prints, and every node maps to a command that already exists — clicking one calls `handleQuickCommand`, so the terminal keeps the trace and the visitor learns the keyboard path. Deliberately *not* built: a Warp-style session list, or letting visitors open more terminals. Warp lists the many working directories you have open; a portfolio has one subject, and a second terminal would run the same commands against the same content — UI and state with no new information.

Below `lg` the sidebar hides and `ActionBar` takes over with the same commands as chips. Keep those two in sync: they are one navigation in two forms, not two navigations.

**Panes are tmux windows.** `activePane: 'main' | 'projects'` in `useTerminal`; both the top tabs and the status line's `[0:main*]` window list write to it. `show projects` and `show project <name>` switch panes as a side effect, and `back` walks detail → list → main.

**`src/hooks/useTerminal.ts` is the hub.** It owns all terminal state (input, history, suggestions, open project, sound, language) and the `commands` object mapping command string → `() => string[]`. `App.tsx` destructures its return value and wires it into the presentational components. Adding or changing a command usually means touching three places:

1. `src/constants/terminal.ts` — `COMMANDS.AVAILABLE` / `.HIDDEN` / `.EASTER_EGGS` drive autocomplete, Tab completion, and the quick-command buttons. A command missing here still runs but is undiscoverable. `.HIDDEN` also holds the real shell commands (`ls`, `pwd`, `whoami`, `date`, `man`, `exit`, `sudo`, `clear`) — a developer types those at any prompt by reflex, and answering them is what keeps the terminal from reading as a menu in disguise.
2. The `commands` object in `useTerminal.ts` — the actual handler.
3. `src/data/terminalContent.ts` (long-form copy: about, skills, help, contact) or `src/data/terminalMessages.ts` (short status/error strings, some as functions taking an argument). Both are keyed by language, so **every string needs an `en` and an `es` entry**.

Easter-egg commands live in `src/hooks/useEasterEggs.ts` and are spread into the `commands` object; that hook also owns the visual-effect flags (`digitalRainMode`, `isSnowing`, `isGlitching`) and the Konami sequence tracker.

**Anything that prints must bring the terminal with it.** `executeCommand` switches `activePane` back to `main` before running, except for the three commands that own the pane themselves (`back`, `show projects`, `show project <name>`). Without that, a command fired from the sidebar or the palette while the projects pane was open wrote its output to a window the visitor could not see.

**`executeCommand` special-cases some inputs before the map lookup**: `show project <name>` (prefix parse), `download resume` and `connect` (both call `window.open`), `back`, and `cls`. Everything else falls through to `commands[lowerInput]`, then to a not-found message.

**Command output is `string[]`, revealed line by line at `TERMINAL_CONFIG.LINE_REVEAL` (35ms)** (`addCommandToHistory`), and rendered as one `CommandBlock` per command. The block's left rail stays transparent until hover, and only a failure keeps it lit — Warp groups commands the same way, invisibly until you reach for it, so the scrollback reads as continuous output.

**The login banner is output, not chrome.** `useTerminal` seeds `commandHistory` with one entry whose `input` is `''`; `CommandBlock` reads that as the MOTD and renders the body with no prompt line. Because it is an ordinary history entry it scrolls away as commands pile up and `clear` / `cls` / `Ctrl+L` wipe it, which is the whole point — a banner pinned outside the scroll would be chrome pretending to be output.

**The prompt scrolls with the history, it is not pinned below it.** `MainTerminal` is a single scroll container holding history → suggestions → input, so the cursor sits directly under the last line of output and only reaches the bottom of the window once the scrollback has filled it. Clicking anywhere in the viewport refocuses the prompt, unless there is a text selection or the click landed on a link or button. Each `Command` carries a `crypto.randomUUID()` `id` and the staggered updates target that id — never the last array element, since the user can submit another command mid-reveal and the entries would interleave. Keep that invariant if you touch the history updates.

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

**⌘K opens the command palette** (`CommandPalette`), built on the native `<dialog>` so focus trapping, Esc and top-layer painting come from the platform rather than from custom code. Its listener is the one legitimate `document`-level key handler in the app: ⌘K/Ctrl+K is an app shortcut, unlike arrows and Tab which the prompt owns. Its list is curated on purpose — easter eggs stay out, and `show project` with no argument is dropped because each project is offered individually. Selecting an entry calls `handleQuickCommand`, so like the sidebar it runs the real command and leaves the trace in the terminal.

**Keyboard ownership is split and easy to break.** `useTerminal.handleKeyDown` owns ↑/↓ (command history), Tab (completion), Esc, Enter, `Ctrl+L` (clear) and `Ctrl+C` (cancel line). Two deliberate non-interceptions: `Shift+Tab` passes through so keyboard users can move focus out of the input, and `Ctrl+C` only interrupts when the input has no selection — otherwise it stays the browser's copy shortcut. Do not add a competing `document`-level key listener — an earlier one in `Suggestions` fought the history navigation.

**Never let content depend on an animation finishing.** The project detail used to type its `<h1>` in with GSAP's TextPlugin, which cleared the DOM text first — React then considered that text current and would not restore it, so any interruption (a backgrounded tab suspending `requestAnimationFrame`, an error before the tween) left the heading permanently blank. Animate opacity and transform; leave the text alone.

**The CRT flicker and scanline scroll are gone.** They cost readability on long text and were the loudest "hobby project" signal. What remains is a nearly invisible static scanline texture. Do not reintroduce animation on text that is meant to be read.

**Visual effects** (`src/components/effects/`) are full-screen overlays toggled by an `isActive` prop from `useTerminal`.

**`tico` is a terminal pet, and it is chrome.** `src/components/companion/` renders a draggable creature drawn as a miniature terminal window — the same window chrome as `TitleBar`, a dark screen with the scanline texture, and a face on it. It is positioned `absolute` inside the pane row in `App.tsx` (which is why that row is `relative`), so it floats *over* the viewport and never prints into the scrollback; the container itself is `pointer-events: none` so click-to-focus still reaches the prompt everywhere except on the pet and its speech bubble.

Five rules hold it together:

- **It reads state, it does not own any.** Every reaction is derived from props already flowing through `App`: `isProcessing` → thinking, `currentInput` → it leans left and reads along, the last non-loading `commandHistory` entry → happy or (on `failed`) error, `selectedProject` → the project's glyph and line, `soundEnabled` → hands over its ears, the easter-egg flags → its theme. The one piece of state it added is `companionVisible` in `useTerminal`, toggled by the `tico` command. A history entry keeps its id while its output reveals line by line but is a **new object on every one of those updates**, so the reaction effect dedupes on `id` — never on object identity.
- **Everything unprompted runs on one poll.** Dozing off, the chatter, the strolls and the small behaviours (a yawn, a stretch, a look around the room) all live in a single interval, each behind its own floor — `SLEEP_AFTER`, `CHATTER_EVERY`, `WANDER_EVERY`, `MOMENT_EVERY` — so they never land at once and however many behaviours it grows there is still one timer. Add new idle behaviour to the `moments` array, not to a new interval. It only wanders while the pointer has been still, so it never walks out from under a cursor that is using the site.
- **Travel is a CSS transition, not an animation loop.** `moveTo` sets the target offset and computes the duration from the distance, so one pace covers a step aside, a walk across the pane and a drop to the floor after being dropped in mid-air. Dragging sets that duration to `0ms`, which makes the same property follow the pointer exactly. There is no rAF loop anywhere in the pet.
- **Its copy is data, in `src/data/companion.ts`, keyed by language like everything else.** Lines about a project are keyed by `Project['id']`; lines about a command are keyed by the command as typed. Both need an `en` and an `es` entry, and the lines describe the real work — the pet is a guide to the portfolio, not a character with a script of its own. Lines are typed into the bubble at `SAY_REVEAL`, the same idiom as the terminal's own output reveal, so the bubble's own timer starts only once the line has finished being said.
- **Motion is CSS only.** The `prefers-reduced-motion` block already flattens all of it, which is the whole reason none of it is written in JavaScript. What survives that block is blinking and talking, which is the part worth keeping. The antenna LED is the only informational colour on it and follows the palette rule: amber running, pink failed, green ready.

**The site is bilingual (en/es) without an i18n library.** `src/i18n.ts` holds the `Language` type, the UI chrome strings, and a React context; `useTerminal` owns the `language` state and `App` publishes it through `LanguageProvider`. Components read copy with `useUi()`. Content lives beside the data it belongs to: `terminalContent[lang]`, `terminalMessages[lang]`, and `getProjects(lang)` — which merges each project's language-independent fields (id, tech, status, year, links) with its `en`/`es` block.

Three rules when touching this:
- Command names are never translated. `help`, `show projects` and `lang es` are commands, like `ls`. Only their *descriptions* in the help table are.
- Anything that reads a project must take the language: `findProjectByName(name, lang)`, `getCommandSuggestions(input, lang)`. `useTerminal` stores `selectedProjectId`, not the project object, so switching language re-localises the open project instead of leaving a stale one in state.
- `Project['status']` stays `'Production' | 'Beta' | 'Development'` because it drives badge colours and the type union; the translated label comes from `ui.statusLabels[status]`.

Initial language resolves in this order: **the URL path** (`/my-portfolio/es/` forces Spanish), then a saved `localStorage` choice, then `navigator.language`, then English. The URL wins because it is what a crawler, a shared link, or an hreflang hit is asking for. Already-printed command output keeps the language it was printed in — history is history.

**There are two build entry points, and hreflang depends on them.** `index.html` (English) and `es/index.html` (Spanish) are both listed in `build.rollupOptions.input`, producing `dist/index.html` and `dist/es/index.html` — two real crawlable URLs, which is the whole reason hreflang can work on a static host. Consequences:

- Any `<head>` change must be made in **both** files. They each carry a self-referencing `canonical` plus the full `hreflang` set (`en`, `es`, `x-default`), localized title/description/OG, and their own OG image (`og-image.png` / `og-image-es.png`).
- Switching language in-app does not reload. **`useTerminal` holds the only writer for the address bar** — one effect keyed on `[language, selectedProjectId]` that rebuilds the whole URL (`languageHref(lang)` + `?project=<id>`) and retitles the tab. Language owns the path, the open project owns the query; writing either one alone would drop the other. `persistLanguage` only touches localStorage.
- A `?project=<id>` link opens straight into that project's detail view; unknown ids are ignored. The id is language-independent, so the same link works from either page.
- `public/sitemap.xml` lists both URLs with their `xhtml:link` alternates. Update it if a URL is ever added or renamed.

**The CV PDF is generated, never hand-edited.** `scripts/cv-html.ts` builds a printable page from `src/data/cv.ts` *plus* the same `terminalContent` skills and `getProjects` list the site renders, so the CV cannot disagree with the portfolio. A Vite plugin emits `dist/cv-en.html` and `dist/cv-es.html`; `pnpm cv` then prints both with headless Chrome into `public/assets/documents/`. The PDFs are committed so CI stays a plain `vite build` with no browser step — re-run `pnpm cv` after touching `cv.ts` or any project copy.

Its palette is deliberately not the site's: a CV is printed and opened in light PDF viewers, where Tokyo Night becomes a black rectangle. Sections with no data are omitted rather than rendered empty, so an unfinished `cv.ts` yields a shorter PDF instead of a wrong one.

**The indexable content is generated, never hand-written.** The terminal renders nothing until a visitor types a command, so both HTML files would otherwise ship an empty page. `scripts/seo-html.ts` builds a semantic block (`h1`, sections, one `<article>` per project, contact links) from the *same* `terminalContent` and `getProjects` the app uses, and the `inject-seo-content` plugin in `vite.config.ts` splices it in after `<div id="root"></div>` — in dev as well as build. Never edit the block by hand; change the data and it regenerates.

Two properties it must keep: it lives **outside `#root`** so React never unmounts it, and it is hidden with the **clip pattern, not `display:none`** — the text has to stay in the accessibility tree, since it doubles as the only screen-reader-usable version of the portfolio.

Because that script is imported by `vite.config.ts`, everything it reaches must stay free of runtime `@/` imports (the config is bundled before aliases exist). That is why `projects.ts` inlines its `status` literals instead of importing a constant, and why `scripts/seo-html.ts` keeps its own copy of the status labels rather than importing `src/i18n.ts`, which would drag React into the config bundle.

**Reduced motion is honoured in two layers.** A blanket `@media (prefers-reduced-motion: reduce)` block in `src/index.css` neutralises every CSS animation and transition. JavaScript escapes that, so the staggered output reveal checks `prefersReducedMotion()` and prints at once instead. The canvas easter eggs (snow, digital rain) are left running: the user typed a command to summon them.

## Conventions

- `@/` aliases `src/` (configured in both `vite.config.ts` and the `paths` entry in `tsconfig.json`).
- `src/types/terminal.d.ts` declares `Command`, `Project`, `TableData`, etc. as **global ambient types** — do not import them. `src/types/ui.d.ts` holds exported component prop interfaces and is imported normally.
- Biome enforces tabs, single quotes, no semicolons, 100-char lines, and a custom import-group order (packages → `@/utils` → `@/components` → `@/hooks` → types, blank line between groups). Run `pnpm format` rather than hand-arranging imports.
- Tailwind v4 via `@tailwindcss/vite`, but `src/index.css` still pulls in the legacy `tailwind.config.js` with `@config`. Tailwind is used for layout and spacing only; surfaces and colour come from the tokens and semantic classes in `src/index.css`.
- Scrolling in both terminals is native `overflow-y: auto`. Lenis was removed — the main terminal's smooth scroll had never worked (`App.tsx` imported `useLenis` from `lenis/react`, which needs a `ReactLenis` provider that did not exist) and both init paths leaked an uncancelled `requestAnimationFrame` loop.

## Known dead scaffolding

- `terminalHelpers.ts` exports `validateCommand` and `formatTimestamp` (unused) and `shouldPlaySound`, which is an identity function called ~15 times.
