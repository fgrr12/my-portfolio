export const TERMINAL_CONFIG = {
	PROCESSING_TIME: {
		MIN: 400,
		MAX: 1200,
	},
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

export const PROJECT_STATUS = {
	PRODUCTION: 'Production',
	BETA: 'Beta',
	DEVELOPMENT: 'Development',
} as const
