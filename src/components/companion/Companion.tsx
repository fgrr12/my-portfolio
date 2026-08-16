import { Play } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CompanionFace } from '@/components/companion/CompanionFace'

import { useSoundEffects } from '@/hooks/useSoundEffects'

import type { CompanionMood, CompanionProps } from '@/types/ui'

import { companionCopy, PROJECT_GLYPHS } from '@/data/companion'
import { useLanguage } from '@/i18n'

/**
 * `tico` — a process that watches the shell.
 *
 * It lives in the app chrome, floating over the pane and never inside the
 * scrollback: the terminal viewport still shows only what the shell printed.
 * Everything it reacts to is real state — the command that just ran and whether
 * it failed, the project that just opened, whether the shell is busy — so it is
 * a readout of the app with a face on it, not an animation playing beside it.
 *
 * Motion is CSS, so the `prefers-reduced-motion` block in `index.css` already
 * flattens all of it; what remains is a pet that blinks and talks, which is the
 * part worth keeping when someone has asked the OS for less movement.
 */

/** Goes to sleep after this long with no pointer, key or command. */
const SLEEP_AFTER = 60_000
/** Floor between two unprompted lines. The interval only polls. */
const CHATTER_EVERY = 42_000
/** Pointer travel that turns a click into a drag. */
const DRAG_THRESHOLD = 5
/** Hover this long without leaving and it counts as petting. */
const PET_AFTER = 1_600

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

export const Companion = ({
	visible,
	isProcessing,
	commandHistory,
	selectedProject,
	digitalRainMode,
	isSnowing,
	isGlitching,
	soundEnabled,
	onRun,
}: CompanionProps) => {
	const language = useLanguage()
	const copy = companionCopy[language]
	const { playButtonSound, playDiscoverySound } = useSoundEffects()

	const rootRef = useRef<HTMLDivElement>(null)

	const [mood, setMood] = useState<CompanionMood>('idle')
	const [blink, setBlink] = useState(false)
	const [look, setLook] = useState({ x: 0, y: 0 })
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const [glyph, setGlyph] = useState<string | null>(null)
	const [bubble, setBubble] = useState<{ text: string; command?: string } | null>(null)
	// A nonce keyed onto an inner span, because restarting a CSS animation means
	// remounting the node — and the button must keep its focus while that happens.
	const [fx, setFx] = useState<{ name: string; n: number } | null>(null)

	const moodTimer = useRef(0)
	const bubbleTimer = useRef(0)
	const glyphTimer = useRef(0)
	const petTimer = useRef(0)
	const activityAt = useRef(Date.now())
	const chatterAt = useRef(Date.now())
	const chatterCount = useRef(0)
	const clicks = useRef({ count: 0, at: 0 })
	const asleep = useRef(false)
	const dragged = useRef(false)
	const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null)
	const handled = useRef<string | null>(null)
	const moodNow = useRef<CompanionMood>('idle')
	const busy = useRef(false)

	useEffect(() => {
		moodNow.current = mood
	}, [mood])

	useEffect(() => {
		busy.current = bubble !== null
	}, [bubble])

	const say = useCallback((text: string, ms = 5_200, command?: string) => {
		setBubble({ text, command })
		clearTimeout(bubbleTimer.current)
		bubbleTimer.current = window.setTimeout(() => setBubble(null), ms)
	}, [])

	/** `ms = 0` holds the mood until something else changes it. */
	const react = useCallback((next: CompanionMood, effect?: string, ms = 2_800) => {
		setMood(next)
		if (effect) setFx((prev) => ({ name: effect, n: (prev?.n ?? 0) + 1 }))
		clearTimeout(moodTimer.current)
		if (ms > 0) moodTimer.current = window.setTimeout(() => setMood('idle'), ms)
	}, [])

	const wake = useCallback(() => {
		activityAt.current = Date.now()
		if (!asleep.current) return
		asleep.current = false
		react('happy', 'pop', 1_800)
		say(pick(copy.wake), 2_600)
	}, [copy, react, say])

	// ── Senses ───────────────────────────────────────────────────────────────

	useEffect(() => {
		let frame = 0

		const onMove = (event: PointerEvent) => {
			wake()
			if (frame) return
			frame = requestAnimationFrame(() => {
				frame = 0
				const rect = rootRef.current?.getBoundingClientRect()
				if (!rect) return

				const x = clamp((event.clientX - (rect.left + rect.width / 2)) / 260)
				const y = clamp((event.clientY - (rect.top + rect.height / 2)) / 200)
				// Bail out of the render when the pointer barely moved: this runs on
				// every frame the mouse is in motion.
				setLook((prev) =>
					Math.abs(prev.x - x) < 0.02 && Math.abs(prev.y - y) < 0.02 ? prev : { x, y }
				)
			})
		}

		window.addEventListener('pointermove', onMove)
		window.addEventListener('keydown', wake)

		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener('pointermove', onMove)
			window.removeEventListener('keydown', wake)
		}
	}, [wake])

	useEffect(() => {
		let open = 0
		let close = 0

		const loop = () => {
			setBlink(true)
			close = window.setTimeout(() => setBlink(false), 130)
			open = window.setTimeout(loop, 2_400 + Math.random() * 5_200)
		}

		open = window.setTimeout(loop, 3_000)

		return () => {
			clearTimeout(open)
			clearTimeout(close)
		}
	}, [])

	// Dozing off, and the unprompted chatter. One poll drives both, so there is
	// only ever a single timer running while nobody is doing anything.
	useEffect(() => {
		const id = window.setInterval(() => {
			const quiet = Date.now() - activityAt.current

			if (quiet > SLEEP_AFTER) {
				if (!asleep.current && moodNow.current === 'idle') {
					asleep.current = true
					setMood('sleep')
					setBubble(null)
				}
				return
			}

			if (asleep.current || busy.current || moodNow.current !== 'idle') return
			if (Date.now() - chatterAt.current < CHATTER_EVERY) return

			chatterAt.current = Date.now()
			chatterCount.current += 1

			// Alternate: something about the work, then something to try.
			if (chatterCount.current % 2 === 1) {
				say(pick(copy.idle), 8_000)
			} else {
				const tip = pick(copy.tips)
				say(tip.text, 11_000, tip.command)
			}
		}, 5_000)

		return () => clearInterval(id)
	}, [copy, say])

	// biome-ignore lint/correctness/useExhaustiveDependencies: greets once, in whatever language the page loaded with.
	useEffect(() => {
		const timer = window.setTimeout(() => say(pick(copy.boot), 6_000), 1_400)
		return () => clearTimeout(timer)
	}, [])

	// ── Reactions to the shell ───────────────────────────────────────────────

	useEffect(() => {
		if (isProcessing) {
			activityAt.current = Date.now()
			react('thinking', undefined, 0)
			if (Math.random() < 0.3) say(pick(copy.thinking), 1_800)
		} else {
			setMood((current) => (current === 'thinking' ? 'idle' : current))
		}
	}, [isProcessing, copy, react, say])

	/**
	 * The entry keeps its id while its output is revealed line by line, but is a
	 * new object on every one of those updates — so the id, not the object, is
	 * what says whether this command has already been reacted to.
	 */
	const lastCommand = useMemo(() => {
		for (let index = commandHistory.length - 1; index >= 0; index--) {
			const entry = commandHistory[index]
			if (entry.input && !entry.isLoading) return entry
		}
		return null
	}, [commandHistory])

	useEffect(() => {
		if (!lastCommand || handled.current === lastCommand.id) return
		handled.current = lastCommand.id
		wake()

		if (lastCommand.failed) {
			react('error', 'shake')
			say(pick(copy.error), 4_200)
			return
		}

		const input = lastCommand.input.toLowerCase()

		if (input.includes('konami')) {
			react('love', 'hop', 3_400)
			say(copy.eggs.konami, 5_600)
			return
		}

		react('happy', 'hop', 2_200)

		const line = copy.commands[input]
		if (line) say(line, 6_000)
	}, [lastCommand, copy, react, say, wake])

	useEffect(() => {
		if (!selectedProject) return

		setGlyph(PROJECT_GLYPHS[selectedProject.id] ?? '📁')
		clearTimeout(glyphTimer.current)
		glyphTimer.current = window.setTimeout(() => setGlyph(null), 5_200)

		react('wow', 'pop', 1_600)

		const line = copy.projects[selectedProject.id]
		if (line) say(line, 7_500)
	}, [selectedProject, copy, react, say])

	useEffect(() => {
		const egg = digitalRainMode ? 'rain' : isGlitching ? 'glitch' : isSnowing ? 'snow' : null
		if (!egg) return

		react('wow', 'hop', 2_600)
		say(copy.eggs[egg], 6_000)
	}, [digitalRainMode, isSnowing, isGlitching, copy, react, say])

	useEffect(
		() => () => {
			clearTimeout(moodTimer.current)
			clearTimeout(bubbleTimer.current)
			clearTimeout(glyphTimer.current)
			clearTimeout(petTimer.current)
		},
		[]
	)

	// ── Being handled ────────────────────────────────────────────────────────

	const clampOffset = useCallback((x: number, y: number) => {
		const element = rootRef.current
		const parent = element?.offsetParent as HTMLElement | null
		if (!element || !parent) return { x, y }

		// Anchored bottom-right, so it can only ever be dragged up and to the left.
		const left = parent.clientWidth - element.offsetWidth - 12
		const up = parent.clientHeight - element.offsetHeight - 12

		return { x: Math.min(0, Math.max(-left, x)), y: Math.min(0, Math.max(-up, y)) }
	}, [])

	useEffect(() => {
		const onResize = () => setOffset((current) => clampOffset(current.x, current.y))
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [clampOffset])

	const handleClick = () => {
		if (dragged.current) return
		wake()
		if (soundEnabled) playButtonSound()

		const now = Date.now()
		clicks.current = {
			count: now - clicks.current.at < 900 ? clicks.current.count + 1 : 1,
			at: now,
		}

		if (clicks.current.count >= 4) {
			clicks.current = { count: 0, at: now }
			react('dizzy', 'spin', 2_600)
			say(pick(copy.dizzy), 3_400)
			if (soundEnabled) playDiscoverySound()
			return
		}

		react('happy', 'pop', 2_000)
		say(pick(copy.click), 4_200)
	}

	const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
		dragged.current = false
		drag.current = {
			id: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			ox: offset.x,
			oy: offset.y,
		}
		event.currentTarget.setPointerCapture(event.pointerId)
	}

	const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
		const start = drag.current
		if (!start || start.id !== event.pointerId) return

		const dx = event.clientX - start.x
		const dy = event.clientY - start.y

		if (!dragged.current) {
			if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
			dragged.current = true
			clearTimeout(petTimer.current)
			react('held', undefined, 0)
			say(pick(copy.drag), 2_600)
		}

		setOffset(clampOffset(start.ox + dx, start.oy + dy))
	}

	const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
		if (!drag.current) return
		drag.current = null
		event.currentTarget.releasePointerCapture?.(event.pointerId)

		if (!dragged.current) return
		react('wow', 'land', 1_200)
		// Cleared after the click event that follows this pointerup, so a drag never
		// also reads as a click.
		window.setTimeout(() => {
			dragged.current = false
		}, 0)
	}

	const handleEnter = () => {
		wake()
		clearTimeout(petTimer.current)
		petTimer.current = window.setTimeout(() => {
			if (dragged.current) return
			react('love', 'pop', 3_200)
			say(pick(copy.pet), 3_600)
		}, PET_AFTER)
	}

	const handleLeave = () => clearTimeout(petTimer.current)

	if (!visible) return null

	const theme = digitalRainMode ? 'rain' : isGlitching ? 'glitch' : isSnowing ? 'snow' : 'normal'

	const faceColor =
		theme === 'rain'
			? 'var(--green)'
			: theme === 'glitch'
				? 'var(--pink)'
				: theme === 'snow'
					? 'var(--cyan)'
					: 'var(--purple)'

	// The one informational colour on the whole pet, and it follows the same rule
	// as the rest of the palette: amber is running, pink is a failure, green is ready.
	const ledColor =
		mood === 'thinking'
			? 'var(--amber)'
			: mood === 'error'
				? 'var(--pink)'
				: mood === 'sleep'
					? 'var(--fg-muted)'
					: 'var(--green)'

	return (
		<div
			ref={rootRef}
			className="companion"
			data-mood={mood}
			data-theme={theme}
			style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
		>
			{bubble && (
				<div className="companion-bubble">
					<p>{bubble.text}</p>

					{bubble.command && (
						<button
							type="button"
							className="companion-run"
							onClick={() => {
								setBubble(null)
								onRun(bubble.command as string)
							}}
						>
							<Play size={10} />
							{bubble.command}
						</button>
					)}
				</div>
			)}

			<button
				type="button"
				className="companion-body"
				aria-label={copy.label}
				onClick={handleClick}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onPointerEnter={handleEnter}
				onPointerLeave={handleLeave}
			>
				<span key={fx?.n} className="companion-anim" data-anim={fx?.name}>
					<CompanionFace
						mood={mood}
						blink={blink}
						look={look}
						glyph={glyph}
						faceColor={faceColor}
						ledColor={ledColor}
					/>
				</span>
			</button>
		</div>
	)
}
