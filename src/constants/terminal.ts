export const TERMINAL_CONFIG = {
	// A real shell answers instantly; the old 400-1200ms "thinking" pause plus a
	// 150ms-per-line reveal made `help` take up to 5.7s. Enough jitter is kept to
	// read as a machine responding, not enough to make anyone wait.
	PROCESSING_TIME: {
		MIN: 90,
		MAX: 220,
	},
	/** Per-line stagger while printing a command's output. */
	LINE_REVEAL: 35,
	ANIMATION_DELAYS: {
		STARTUP_SOUND: 1000,
		SOUND_FEEDBACK: 100,
		FOCUS_RESTORE: 0,
	},
	FLICKER_TIMING: {
		START_DELAY: 2000,
		RANDOM_DELAY_MAX: 4,
		REPEAT_DELAY_MAX: 3,
		REPEAT_DELAY_MIN: 2,
	},
} as const

export const COMMANDS = {
	AVAILABLE: ['show projects', 'show project', 'about me', 'skills', 'open contact', 'help'],
	HIDDEN: [
		'cls',
		'clear',
		'ls',
		'pwd',
		'whoami',
		'date',
		'man',
		'exit',
		'sudo',
		'back',
		'sound on',
		'sound off',
		'lang en',
		'lang es',
		'download resume',
		'connect',
	],
	EASTER_EGGS: [
		'digital rain',
		'brew',
		'snow',
		'glitch',
		'dev mode',
		'rubber duck',
		'stack overflow',
		'konami',
	],
} as const

// Played in order by the "show me everything" button, for visitors who will not
// type a command. Keep it short: bio, stack, work.
export const TOUR_COMMANDS = ['about me', 'skills', 'show projects'] as const

export const KONAMI_CODE = [
	'ArrowUp',
	'ArrowUp',
	'ArrowDown',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowLeft',
	'ArrowRight',
	'KeyB',
	'KeyA',
] as const

export const LANGUAGES = {
	EN: 'en',
	ES: 'es',
} as const
