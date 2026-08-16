import { Play } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/utils/prefersReducedMotion'

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
 * it failed, the project that just opened, what is half-typed at the prompt — so
 * it is a readout of the app with a face on it, not an animation playing beside it.
 *
 * What makes it read as alive is that it acts without being asked: it wanders
 * along the floor, yawns, stretches, looks around, and notices when you leave and
 * come back. Those are the `moments` below — one poll picks them, so however many
 * behaviours it grows, there is still a single timer running.
 *
 * Motion is CSS, so the `prefers-reduced-motion` block in `index.css` already
 * flattens all of it; what survives is a pet that blinks and talks, which is the
 * part worth keeping when someone has asked the OS for less movement.
 */

/** Goes to sleep after this long with no pointer, key or command. */
const SLEEP_AFTER = 60_000
/** Floor between two unprompted lines. The interval only polls. */
const CHATTER_EVERY = 42_000
/** Floor between two idle behaviours — a yawn, a stretch, a glance. */
const MOMENT_EVERY = 11_000
/** Floor between two strolls along the bottom of the pane. */
const WANDER_EVERY = 26_000
/** Pointer travel that turns a click into a drag. */
const DRAG_THRESHOLD = 5
/** Hover this long without leaving and it counts as petting. */
const PET_AFTER = 1_600
/** Walking pace and falling pace, in pixels per second. */
const WALK_SPEED = 74
const FALL_SPEED = 900
/** Per-character delay while a line is typed into the bubble. */
const SAY_REVEAL = 16

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

type Bubble = { text: string; command?: string }
type Motion = { ms: number; facing: 'left' | 'right'; walking: boolean }

export const Companion = ({
	visible,
	isProcessing,
	currentInput,
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
	const { playButtonSound, playDiscoverySound, playChirpSound } = useSoundEffects()

	const rootRef = useRef<HTMLDivElement>(null)

	const [mood, setMood] = useState<CompanionMood>('idle')
	const [blink, setBlink] = useState(false)
	const [look, setLook] = useState({ x: 0, y: 0 })
	// Set when it is looking at something on purpose — the prompt, the sidebar,
	// where it is walking — and it stops tracking the pointer until that clears.
	const [aim, setAim] = useState<{ x: number; y: number } | null>(null)
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const [motion, setMotion] = useState<Motion | null>(null)
	const [glyph, setGlyph] = useState<string | null>(null)
	const [bubble, setBubble] = useState<Bubble | null>(null)
	const [typed, setTyped] = useState('')
	// A nonce keyed onto an inner span, because restarting a CSS animation means
	// remounting the node — and the button must keep its focus while that happens.
	const [fx, setFx] = useState<{ name: string; n: number } | null>(null)

	const moodTimer = useRef(0)
	const bubbleTimer = useRef(0)
	const glyphTimer = useRef(0)
	const petTimer = useRef(0)
	const aimTimer = useRef(0)
	const walkTimer = useRef(0)
	const activityAt = useRef(Date.now())
	const chatterAt = useRef(Date.now())
	const momentAt = useRef(Date.now())
	const wanderAt = useRef(Date.now())
	const chatterCount = useRef(0)
	const clicks = useRef({ count: 0, at: 0 })
	const asleep = useRef(false)
	const dragged = useRef(false)
	const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null)
	const handled = useRef<string | null>(null)
	const moodNow = useRef<CompanionMood>('idle')
	const offsetNow = useRef({ x: 0, y: 0 })
	const busy = useRef(false)
	const soundNow = useRef(soundEnabled)
	// Short-term memory: enough to notice a losing streak and to stop repeating itself.
	const failures = useRef(0)
	const commandCount = useRef(0)
	const milestonesSaid = useRef<number[]>([])

	useEffect(() => {
		moodNow.current = mood
	}, [mood])

	useEffect(() => {
		offsetNow.current = offset
	}, [offset])

	useEffect(() => {
		busy.current = bubble !== null
	}, [bubble])

	useEffect(() => {
		soundNow.current = soundEnabled
	}, [soundEnabled])

	// ── Speaking ─────────────────────────────────────────────────────────────

	const say = useCallback(
		(text: string, ms = 5_200, command?: string) => {
			setBubble({ text, command })
			if (soundNow.current) playChirpSound()
			clearTimeout(bubbleTimer.current)
			// The line is typed in rather than pasted, so it has to finish being said
			// before the clock on reading it starts.
			bubbleTimer.current = window.setTimeout(() => setBubble(null), ms + text.length * SAY_REVEAL)
		},
		[playChirpSound]
	)

	useEffect(() => {
		if (!bubble) {
			setTyped('')
			return
		}

		if (prefersReducedMotion()) {
			setTyped(bubble.text)
			return
		}

		setTyped('')
		let count = 0
		const id = window.setInterval(() => {
			count += 1
			setTyped(bubble.text.slice(0, count))
			if (count >= bubble.text.length) clearInterval(id)
		}, SAY_REVEAL)

		return () => clearInterval(id)
	}, [bubble])

	/** `ms = 0` holds the mood until something else changes it. */
	const react = useCallback((next: CompanionMood, effect?: string, ms = 2_800) => {
		setMood(next)
		if (effect) setFx((prev) => ({ name: effect, n: (prev?.n ?? 0) + 1 }))
		clearTimeout(moodTimer.current)
		if (ms > 0) moodTimer.current = window.setTimeout(() => setMood('idle'), ms)
	}, [])

	/** Look somewhere on purpose for a moment, then go back to following the pointer. */
	const lookAt = useCallback((x: number, y: number, ms = 1_400) => {
		setAim({ x, y })
		clearTimeout(aimTimer.current)
		aimTimer.current = window.setTimeout(() => setAim(null), ms)
	}, [])

	const wake = useCallback(() => {
		activityAt.current = Date.now()
		if (!asleep.current) return
		asleep.current = false
		react('happy', 'stretch', 1_800)
		say(pick(copy.wake), 2_600)
	}, [copy, react, say])

	// ── Moving under its own power ───────────────────────────────────────────

	const clampOffset = useCallback((x: number, y: number) => {
		const element = rootRef.current
		const parent = element?.offsetParent as HTMLElement | null
		if (!element || !parent) return { x, y }

		// Anchored bottom-right, so it can only ever go up and to the left.
		const left = parent.clientWidth - element.offsetWidth - 12
		const up = parent.clientHeight - element.offsetHeight - 12

		return { x: Math.min(0, Math.max(-left, x)), y: Math.min(0, Math.max(-up, y)) }
	}, [])

	/**
	 * Travel is a CSS transition whose duration is set from the distance, so the
	 * pace is constant whether it is stepping aside or crossing the whole pane.
	 * No animation loop, and dragging simply sets the duration to zero.
	 */
	const moveTo = useCallback(
		(x: number, y: number, speed = WALK_SPEED, after?: () => void) => {
			const from = offsetNow.current
			const to = clampOffset(x, y)
			const distance = Math.hypot(to.x - from.x, to.y - from.y)
			if (distance < 3) return

			const ms = Math.min(5_000, Math.max(260, (distance / speed) * 1_000))
			const facing = to.x < from.x ? 'left' : 'right'

			setMotion({ ms, facing, walking: speed === WALK_SPEED })
			setOffset(to)
			lookAt(facing === 'left' ? -0.9 : 0.9, 0, ms)

			clearTimeout(walkTimer.current)
			walkTimer.current = window.setTimeout(() => {
				setMotion(null)
				after?.()
			}, ms)
		},
		[clampOffset, lookAt]
	)

	/**
	 * A stroll along the floor. A stride rather than a destination, because
	 * crossing the whole pane in one go reads as being dragged, not as walking —
	 * and it would take longer than anyone waits.
	 */
	const wander = useCallback(() => {
		const from = offsetNow.current.x
		const stride = 90 + Math.random() * 200

		const reachable = [from - stride, from + stride]
			.map((x) => clampOffset(x, 0).x)
			.filter((x) => Math.abs(x - from) > 20)

		if (reachable.length === 0) return
		moveTo(pick(reachable), 0)
	}, [moveTo, clampOffset])

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

	/** Leaving the tab and coming back is the one absence it notices. */
	useEffect(() => {
		let leftAt = 0

		const onVisibility = () => {
			if (document.hidden) {
				leftAt = Date.now()
				return
			}

			activityAt.current = Date.now()
			asleep.current = false
			if (Date.now() - leftAt < 25_000) return

			react('happy', 'hop', 2_400)
			say(pick(copy.back), 4_200)
		}

		document.addEventListener('visibilitychange', onVisibility)
		return () => document.removeEventListener('visibilitychange', onVisibility)
	}, [copy, react, say])

	/**
	 * Everything it does unprompted, on one clock: dozing off, a small behaviour,
	 * a line about the work, a walk. They are ordered by how much they interrupt,
	 * and each has its own floor, so they never all land at once.
	 */
	useEffect(() => {
		const moments = [
			() => react('yawn', 'yawn', 1_500),
			() => react('happy', 'stretch', 1_200),
			() => {
				// Looks left, then right, the way anything alive checks the room.
				lookAt(-1, -0.2, 700)
				window.setTimeout(() => lookAt(1, -0.2, 700), 720)
			},
			() => {
				react('happy', 'dance', 1_700)
				if (soundNow.current) playChirpSound()
			},
			() => {
				// A glance at the sidebar, which is where the work is.
				react('watching', undefined, 1_200)
				lookAt(-1, -0.35, 1_200)
			},
		]

		const id = window.setInterval(() => {
			const now = Date.now()
			const quiet = now - activityAt.current

			if (quiet > SLEEP_AFTER) {
				if (!asleep.current && moodNow.current === 'idle') {
					asleep.current = true
					setMood('sleep')
					setBubble(null)
				}
				return
			}

			if (asleep.current || moodNow.current !== 'idle' || motion) return

			if (!busy.current && now - chatterAt.current > CHATTER_EVERY) {
				chatterAt.current = now
				chatterCount.current += 1

				// Alternate: something about the work, then something to try.
				if (chatterCount.current % 2 === 1) {
					say(pick(copy.idle), 8_000)
				} else {
					const tip = pick(copy.tips)
					say(tip.text, 11_000, tip.command)
				}
				return
			}

			if (quiet > 14_000 && now - wanderAt.current > WANDER_EVERY && Math.random() < 0.6) {
				wanderAt.current = now
				wander()
				return
			}

			if (now - momentAt.current > MOMENT_EVERY && Math.random() < 0.65) {
				momentAt.current = now
				pick(moments)()
			}
		}, 3_500)

		return () => clearInterval(id)
	}, [copy, say, react, lookAt, wander, motion, playChirpSound])

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

	/** Reading over your shoulder while you type, and looking away when you stop. */
	useEffect(() => {
		if (currentInput) {
			activityAt.current = Date.now()
			lookAt(-1, -0.3, 2_500)
			setMood((current) => (current === 'idle' ? 'watching' : current))
		} else {
			setMood((current) => (current === 'watching' ? 'idle' : current))
		}
	}, [currentInput, lookAt])

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
		commandCount.current += 1

		if (lastCommand.failed) {
			failures.current += 1
			react('error', 'shake')
			say(failures.current >= 3 ? copy.struggling : pick(copy.error), 4_200)
			return
		}

		failures.current = 0
		const input = lastCommand.input.toLowerCase()

		if (input.includes('konami')) {
			react('love', 'dance', 3_400)
			say(copy.eggs.konami, 5_600)
			return
		}

		react('happy', 'hop', 2_200)

		// A milestone outranks the line about the command: it is the rarer thing to say.
		const milestone = copy.milestones.find(
			(entry) => entry.at === commandCount.current && !milestonesSaid.current.includes(entry.at)
		)

		if (milestone) {
			milestonesSaid.current.push(milestone.at)
			say(milestone.text, 6_500)
			return
		}

		const line = copy.commands[input]
		if (line) say(line, 6_000)
	}, [lastCommand, copy, react, say, wake])

	useEffect(() => {
		if (!selectedProject) return

		setGlyph(PROJECT_GLYPHS[selectedProject.id] ?? '📁')
		clearTimeout(glyphTimer.current)
		glyphTimer.current = window.setTimeout(() => setGlyph(null), 5_200)

		react('wow', 'pop', 1_600)
		// Glances at the sidebar entry it is talking about before it starts.
		lookAt(-1, -0.3, 1_400)

		const line = copy.projects[selectedProject.id]
		if (line) say(line, 7_500)
	}, [selectedProject, copy, react, say, lookAt])

	useEffect(() => {
		const egg = digitalRainMode ? 'rain' : isGlitching ? 'glitch' : isSnowing ? 'snow' : null
		if (!egg) return

		react('wow', 'hop', 2_600)
		say(copy.eggs[egg], 6_000)
	}, [digitalRainMode, isSnowing, isGlitching, copy, react, say])

	/** Muting it is done to it, not by it, so it reacts like it was done to it. */
	const soundWas = useRef(soundEnabled)
	useEffect(() => {
		if (soundWas.current === soundEnabled) return
		soundWas.current = soundEnabled

		react(soundEnabled ? 'happy' : 'muted', 'pop', 3_000)
		say(soundEnabled ? copy.unmuted : copy.muted, 3_600)
	}, [soundEnabled, copy, react, say])

	useEffect(
		() => () => {
			clearTimeout(moodTimer.current)
			clearTimeout(bubbleTimer.current)
			clearTimeout(glyphTimer.current)
			clearTimeout(petTimer.current)
			clearTimeout(aimTimer.current)
			clearTimeout(walkTimer.current)
		},
		[]
	)

	useEffect(() => {
		const onResize = () => setOffset((current) => clampOffset(current.x, current.y))
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [clampOffset])

	// ── Being handled ────────────────────────────────────────────────────────

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
		clearTimeout(walkTimer.current)
		setMotion(null)
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
			setAim(null)
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

		// Let go in mid-air and it drops to the floor, then takes the landing.
		if (offsetNow.current.y < -4) {
			moveTo(offsetNow.current.x, 0, FALL_SPEED, () => react('wow', 'land', 900))
		} else {
			react('wow', 'land', 900)
		}

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
			data-walking={motion?.walking ? 'true' : undefined}
			data-held={mood === 'held' ? 'true' : undefined}
			style={{
				transform: `translate(${offset.x}px, ${offset.y}px)`,
				transitionDuration: motion ? `${motion.ms}ms` : '0ms',
			}}
		>
			{bubble && (
				<div className="companion-bubble">
					<p>
						{typed}
						{typed.length < bubble.text.length && <span className="caret-blink">▌</span>}
					</p>

					{bubble.command && typed.length === bubble.text.length && (
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
						look={aim ?? look}
						glyph={glyph}
						faceColor={faceColor}
						ledColor={ledColor}
					/>
				</span>
			</button>
		</div>
	)
}
